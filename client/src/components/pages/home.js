import {useState,useEffect} from 'react';
import axios from "axios";
function Home({match,history}){
    console.log(match.params);
    let id = match.params.id;
    const [data,setData] = useState([]);
    const [userData,setUser] = useState([]);
    const [name,setName] = useState("");
    const [price,setPrice] = useState("");
    const [left,setLeft] = useState("");
    const [total,setTotal] = useState("");
    const [nameC,setNameChange] = useState("");
    const [priceC,setPriceChange] = useState(0);
    const [leftC,setLeftChange] = useState(0);
    const [totalC,setTotalChange] = useState(0);
    const [sid,setId] = useState(0);
    const [enterD,setEnter] = useState(false);
    const [sQ,setSQ] = useState("");
    const getData = async ()=> {
        const udata = await axios.get(`/dashboard/getData/${id}`)
        console.log(udata);
        setUser(udata.data);
    }
    const postData = async ()=>{
        let idata;
        if(match.params.query != undefined){
            idata = await axios.post(`/dashboard/getTableName/${match.params.query}`,{
                dbName:localStorage.getItem("table")
            });
        }else{
            idata = await axios.post(`/dashboard/getTable`,{
                dbName:localStorage.getItem("table")
            });
        }
        let content = idata.data;
        setData(content);
        console.log(content);
    }
    const enter = async(e)=> {
        if(name != "" && price != "" && left != "" && total != ""){
            var s = true;
            var i = 0;
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                if(element.name.toLowerCase() == name.toLowerCase()){
                    s = false;
                    i = index;
                    break;
                }
            }
            console.log(1);
            if(s){
                console.log(2);
                if(total-left >= 0){
                    setEnter(!enterD);
                    const data = await axios.post("/dashboard/enterData",{
                        dbName:localStorage.getItem("table"),
                        name:name,
                        price:price,
                        left:left,
                        total:total
                    });
                    console.log(data);
                    e.preventDefault();
                }else{
                    console.log(4);
                    alert("Item left should be lesser than total items");
                    e.preventDefault();
                }
            }else{
                console.log(5);
                alert(`Duplicate name found at ${i+1}`);
            }
        }else{
            console.log(6);
            alert("Please enter all values");
        }
        setEnter(!enterD);
    }
    const deleteItem = async(e)=>{
        setEnter(!enterD);
        await axios.post("/dashboard/delData",{
            dbName:localStorage.getItem("table"),
            id:e.target.id
        });
    }
    const enterChange = async(e)=>{
        var s = true;
        var i = 0;
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            if((element.name.toLowerCase() == nameC.toLowerCase()) && (element._id != sid)){
                s = false;
                i = index;
                break;
            }
        }
        console.log(1);
        if(s){
            console.log(2);
            if(totalC-leftC >= 0){
                setEnter(!enterD);
                await axios.post("/dashboard/changeData",{
                    dbName:localStorage.getItem("table"),
                    id:sid,
                    name:nameC,
                    price:priceC,
                    left:leftC,
                    total:totalC
                });
                e.preventDefault();
            }else{
                console.log(4);
                alert("Item left should be lesser than total items");
                e.preventDefault();
            }
        }else{
            console.log(5);
            alert(`Duplicate name found at ${i+1}`);
        }
        setEnter(!enterD);
    }
    const enterChangeData = (e)=>{
        let i = e.target.value;
        setNameChange(data[i].name);
        setPriceChange(data[i].price);
        setLeftChange(data[i].left);
        setTotalChange(data[i].total);
        setId(data[i]._id);
    }
    useEffect(()=>{
        getData();
        postData();
        setPrice("");
        setName("");
        setLeft("");
        setTotal("");
    },[enterD]);
    const item = data.map((i,index)=>{
        return(
            <div id={i._id}  style={{textTransform:"capitalize"}}>
                {index+1} - {i.name} {i.price} {i.left}/{i.total}
                <button type="button" class="btn-primary" value={index} data-bs-toggle="modal" onClick={enterChangeData} data-bs-target="#exampleModal">
                    Edit
                </button>

                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <input type="text"   style={{textTransform:"capitalize"}} onChange={(e)=>(setNameChange(e.target.value))} value={nameC}/>
                            <input type="number" onChange={(e)=>(setPriceChange(e.target.value))} value={priceC}/>
                            <input type="number" onChange={(e)=>(setLeftChange(e.target.value))} value={leftC}/>
                            <input type="number" onChange={(e)=>(setTotalChange(e.target.value))} value={totalC}/>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onClick={enterChange}  data-bs-dismiss="modal">Save changes</button>
                        </div>
                        </div>
                    </div>
                </div>
                <button className=" btn-danger"  id={i._id} onClick={deleteItem}>Delete</button>
            </div>
        )
    });
    const searchName = ()=>{
        history.push(`/home/${localStorage.getItem("id")}/${sQ}`);
        window.location.reload();
    }
    const showAll = ()=>{
        history.push(`/home/${localStorage.getItem("id")}/`);
        window.location.reload();
    }
    return(
        <div className={`home`}>
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">Navbar</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                            <form class="d-flex">
                                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                                <button class="btn btn-outline-light" type="submit">Search</button>
                            </form>
                            <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="#">Home</a>
                            </li>
                            <li class="nav-item">
                            <a class="nav-link" href="#">Link</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div>{userData.name}</div>
            <div>{userData.phNo}</div>
            <div>{userData.email}</div>
            <div>{userData.address}</div>
            <form>
                <input type="text" value={name} onChange={(e)=>{setName(e.target.value)}}/>
                <input type="number" value={price} onChange={(e)=>{setPrice(e.target.value)}}/>
                <input type="number" value={left}  onChange={(e)=>{setLeft(e.target.value)}}/>
                <input type="number"  value={total} onChange={(e)=>{setTotal(e.target.value)}}/>
                <button type="button" className="btn-primary" onClick={enter}>Enter</button>
                <br />
                <input type="search" onChange={(e)=>setSQ(e.target.value)}/>
                <button className="btn-primary" type="button" onClick={searchName}>Search</button>
                <br/>
                <button className="btn-primary" type="button" onClick={showAll}>Show All</button>
            </form>
            {(data.length == 0)?"No data found":item}
        </div>
    ); 
}
export default Home;