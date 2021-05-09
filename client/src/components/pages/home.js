import { useState, useEffect } from "react";
import "./home.css";
import axios from "axios";
function Home({ match, history }) {
  console.log(match.params);
  let id = match.params.id;
  const [data, setData] = useState([]);
  const [userData, setUser] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [left, setLeft] = useState("");
  const [total, setTotal] = useState("");
  const [nameC, setNameChange] = useState("");
  const [priceC, setPriceChange] = useState(0);
  const [leftC, setLeftChange] = useState(0);
  const [totalC, setTotalChange] = useState(0);
  const [sid, setId] = useState(0);
  const [enterD, setEnter] = useState(false);
  const [sQ, setSQ] = useState("");
  const [salesC,setSaleChange] = useState(false);
  const logOut = () => {
    localStorage.removeItem("table");
    localStorage.removeItem("id");
    localStorage.removeItem("authToken");
    history.push("/login");
  };
  const getData = async () => {
    const udata = await axios.get(`/dashboard/getData/${id}`);
    console.log(udata);
    setUser(udata.data);
  };
  const postData = async () => {
    let idata;
    if (match.params.query != undefined) {
      idata = await axios.post(
        `/dashboard/getTableName/${match.params.query}`,
        {
          dbName: localStorage.getItem("table"),
        }
      );
    } else {
      idata = await axios.post(`/dashboard/getTable`, {
        dbName: localStorage.getItem("table"),
      });
    }
    let content = idata.data;
    setData(content);
    console.log(content);
  };
  const enter = async (e) => {
    if (name != "" && price != "" && left != "" && total != "") {
      var s = true;
      var i = 0;
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.name.toLowerCase() == name.toLowerCase()) {
          s = false;
          i = index;
          break;
        }
      }
      console.log(1);
      if (s) {
        console.log(2);
        if (total - left >= 0) {
          setEnter(!enterD);
          const data = await axios.post("/dashboard/enterData", {
            dbName: localStorage.getItem("table"),
            name: name,
            price: price,
            left: left,
            total: total,
          });
          console.log(data);
          e.preventDefault();
        } else {
          console.log(4);
          alert("Item left should be lesser than total items");
          e.preventDefault();
        }
      } else {
        console.log(5);
        alert(`Duplicate name found at ${i + 1}`);
      }
    } else {
      console.log(6);
      alert("Please enter all values");
    }
    history.push(`/home/${localStorage.getItem("id")}/`);
  };
  const deleteItem = async (e) => {
    setEnter(!enterD);
    await axios.post("/dashboard/delData", {
      dbName: localStorage.getItem("table"),
      id: e.target.id,
    });
  };
  const enterChange = async (e) => {
    var s = true;
    var i = 0;
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if (
        element.name.toLowerCase() == nameC.toLowerCase() &&
        element._id != sid
      ) {
        s = false;
        i = index;
        break;
      }
    }
    console.log(1);
    if (s) {
      console.log(2);
      if (totalC - leftC >= 0) {
        setEnter(!enterD);
        await axios.post("/dashboard/changeData", {
          dbName: localStorage.getItem("table"),
          id: sid,
          name: nameC,
          price: priceC,
          left: leftC,
          total: totalC,
        });
        e.preventDefault();
      } else {
        console.log(4);
        alert("Item left should be lesser than total items");
        e.preventDefault();
      }
    } else {
      console.log(5);
      alert(`Duplicate name found at ${i + 1}`);
    }
    setEnter(!enterD);
  };
  const enterChangeData = (e) => {
    let i = e.target.value;
    setNameChange(data[i].name);
    setPriceChange(data[i].price);
    setLeftChange(data[i].left);
    setTotalChange(data[i].total);
    setId(data[i]._id);
  };
  useEffect(() => {
    getData();
    postData();
    setPrice("");
    setName("");
    setLeft("");
    setTotal("");
  }, [enterD]);
  const item = data.map((i, index) => {
    return (
      <li
        id={i._id}
        style={{ textTransform: "capitalize" }}
        className="list-group-item  text-center"
      >
        <div class="card rounded">
          <div class="card-body">
            <h5 class="card-title">
              <div className="container">
                <div className="row">
                  <div className="col-1 text-center">{index + 1}</div>
                  <div className="col-3 text-center">{i.name}</div>
                  <div className="col-3 text-center">{i.price}</div>
                  <div className="col-2 text-end">{i.left}</div>
                  <div className="col-1 text-center">/</div>
                  <div className="col-2 text-start">{i.total}</div>
                </div>
              </div>
            </h5>
          </div>
          <div className="contaner bRow">
          <div className="row">
            <div className="col-6 fc">
              <button
                type="button"
                class="btn-primary"
                value={index}
                data-bs-toggle="modal"
                onClick={enterChangeData}
                data-bs-target="#exampleModal"
              >
                Edit
              </button>
            </div>
            <div className="col-6 lc">
              <button className=" btn-danger" id={i._id} onClick={deleteItem}>
                Delete
              </button>
            </div>
          </div>
        </div>
        </div>

        
        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                  Modal title
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <input
                  type="text"
                  style={{ textTransform: "capitalize" }}
                  onChange={(e) => setNameChange(e.target.value)}
                  value={nameC}
                />
                <input
                  type="number"
                  onChange={(e) => setPriceChange(e.target.value)}
                  value={priceC}
                />
                <input
                  type="number"
                  onChange={(e) => setLeftChange(e.target.value)}
                  value={leftC}
                />
                <input
                  type="number"
                  onChange={(e) => setTotalChange(e.target.value)}
                  value={totalC}
                />
                <label htmlFor="addSales">
                  <input type="checkbox" name="addSales" id="" onChange={(e) => {
                    setSaleChange(e.target.checked);
                  }}/>
                  &nbsp;Add to Sales
                </label>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  onClick={enterChange}
                  data-bs-dismiss="modal"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  });
  const searchName = () => {
    history.push(`/home/${localStorage.getItem("id")}/${sQ}`);
    window.location.reload();
  };
  const showAll = () => {
    history.push(`/home/${localStorage.getItem("id")}/`);
    window.location.reload();
  };
  return (
    <div className="home">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            Navbar
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
              <form class="d-flex">
                <input
                  class="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  onChange={(e) => setSQ(e.target.value)}
                />
                <button
                  class="btn btn-outline-light"
                  type="button"
                  onClick={searchName}
                >
                  <i class="fas fa-search"></i>
                </button>
              </form>
              <li
                class="nav-item"
                style={{ cursor: "pointer", marginLeft: "10px" }}
              >
                <a class="nav-link" onClick={logOut}>
                  Log Out
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container containerL">
        <div className="text-contain-right Details card rounded">
          <div className="card-header text-center">
            <h2>User Profile</h2>
          </div>
          <div className="card-body userDetails row align-items-center">
            <div className="col-lg-2 ">
              <i className="far fa-user"></i>
            </div>
            <div className="col-lg-10">
              <div className="row">
                <div className="col-lg-1 col-sm-1">
                  <h4>
                    <i className="fas fa-signature"></i>
                  </h4>
                </div>
                <div className="col-lg-11 col-sm-11">
                  <h4>{userData.name}</h4>
                </div>
                <div className="col-lg-1 col-sm-1">
                  <h4>
                    <i className="fas fa-map-marked"></i>
                  </h4>
                </div>
                <div className="col-lg-11 col-sm-11">
                  <h4>{userData.address}</h4>
                </div>
                <div className="col-lg-1 col-sm-1">
                  <h4>
                    <i className="fas fa-phone-alt"></i>
                  </h4>
                </div>
                <div className="col-lg-11 col-sm-11">
                  <h4>{userData.phNo}</h4>
                </div>
                <div className="col-lg-1 col-sm-1">
                  <h4>
                    <i className="fas fa-envelope"></i>
                  </h4>
                </div>
                <div className="col-lg-11 col-sm-11">
                  <h4>{userData.email}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card rounded containerL">
        <div class="card-header text-center">
          <h2>Enter New Data</h2>
        </div>
        <div class="card-body">
          <form className="text-center">
            <div className="container iRow">
              <div className="row">
                <div className="col-md-6 col-lg-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    placeholder="Enter Item Name"
                  />
                </div>
                <div className="col-md-6 col-lg-3">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                    }}
                    min={0}
                    placeholder="Enter Item Prices"
                  />
                </div>
                <div className="col-md-6 col-lg-3">
                  <input
                    type="number"
                    value={left}
                    onChange={(e) => {
                      setLeft(e.target.value);
                    }}
                    min={0}
                    placeholder="Enter Items Left"
                  />
                </div>
                <div className="col-md-6 col-lg-3">
                  <input
                    type="number"
                    value={total}
                    onChange={(e) => {
                      setTotal(e.target.value);
                    }}
                    min={0}
                    placeholder="Enter Total Items"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="contaner bRow">
          <div className="row">
            <div className="col-6 fc">
              <button type="button" className="btn btn-primary" onClick={enter}>
                Enter
              </button>
            </div>
            <div className="col-6 lc">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={showAll}
              >
                Show All
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="card  rounded containerL">
        <div class="card-header text-center">
          <h2>Items</h2>
        </div>
        <ul class="list-group list-group-flush">
          {data.length == 0 ? (
            <h4 className="text-center">
              No data found for search query '{match.params.query}'
            </h4>
          ) : (
            <span>
              <li
                style={{ textTransform: "capitalize" }}
                className="list-group-item  text-center"
              >
                <div class="card rounded indexRow">
                  <div class="card-body">
                    <h5 class="card-title">
                    <div className="container ">
                          <div className="row">
                            <div className="col-1 text-center">S.no</div>
                            <div className="col-3 text-center">Name</div>
                            <div className="col-3 text-center">Price</div>
                            <div className="col-2 text-end">Left</div>
                            <div className="col-1 text-center">/</div>
                            <div className="col-2 text-start">Total</div>
                          </div>
                        </div>
                    </h5>
                  </div>
                </div>
              </li>
              {item}
            </span>
          )}
        </ul>
      </div>
    </div>
  );
}
export default Home;
