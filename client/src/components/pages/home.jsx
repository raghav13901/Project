import { useState, useEffect } from "react";
import "./home.css";
import axios from "axios";
import leftI from "../assets/pie-chart.svg";
import totalI from "../assets/percent.svg";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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
  const [salesC, setSaleChange] = useState(true);
  const [discP, setDisc] = useState("");
  const [DP, setDP] = useState(false);
  const [calcValue, setCalc] = useState("");
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
        if ((element.name.toLowerCase() + "s" == name.toLowerCase() ||
          element.name.toLowerCase() + "es" == name.toLowerCase() ||
          element.name.toLowerCase() == name.toLowerCase() ||
          element.name.toLowerCase() == name.toLowerCase() + "s" ||
          element.name.toLowerCase() == name.toLowerCase() + "es")) {
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
        element._id != sid &&
        (element.name.toLowerCase() + "s" == nameC.toLowerCase() ||
          element.name.toLowerCase() + "es" == nameC.toLowerCase() ||
          element.name.toLowerCase() == nameC.toLowerCase() ||
          element.name.toLowerCase() == nameC.toLowerCase() + "s" ||
          element.name.toLowerCase() == nameC.toLowerCase() + "es")
      ) {
        s = false;
        i = index;
        break;
      } else {
        console.log(id, sid);
      }
    }
    console.log(s);
    console.log(1);
    if (s) {
      console.log(2);
      if (totalC - leftC >= 0) {
        setEnter(!enterD);
        let priceS = priceC;
        if (DP) {
          priceS = discP;
        }
        console.log(calcValue, parseInt(leftC), (calcValue - parseInt(leftC)) * priceC);
        setDP(false);
        setDisc("");
        if (calcValue > parseInt(leftC) && salesC) {
          await axios.post(`/dashboard/changeData/${(calcValue - parseInt(leftC)) * priceS}/${localStorage.getItem('id')}`, {
            dbName: localStorage.getItem("table"),
            id: sid,
            name: nameC,
            price: priceC,
            left: leftC,
            total: totalC,
          }).then(
            (data) => {
              console.log(data);
              if (data.status == 200) {
                window.location.reload();
              }
            }
          );
        } else {
          if (!salesC) {
            console.log(1);
            await axios.post(`/dashboard/changeData/${undefined}/${undefined}`, {
              dbName: localStorage.getItem("table"),
              id: sid,
              name: nameC,
              price: priceC,
              left: leftC,
              total: totalC,
            }).then(
              (data) => {
                console.log(data);
                if (data.status == 200) {
                  window.location.reload();
                }
              }
            );
          } else {
            console.log(salesC);
            alert('Invalid Entry for Sales');
          }
        }
      } else {
        console.log(4);
        alert("Item left should be lesser than total items");
      }
    } else {
      console.log(5);
      alert(`Duplicate name found at ${i + 1}`);
    }
  };
  const enterChangeData = (e) => {
    let i = e.target.value;
    setNameChange(data[i].name);
    setPriceChange(data[i].price);
    setLeftChange(data[i].left);
    setTotalChange(data[i].total);
    setCalc(data[i].left);
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
    if (i.price > 0) {
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
              <div class="modal-content rounded">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">
                    Edit
                  </h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ><i class="fas fa-times fa-lg"></i></button>
                </div>
                <div class="modal-body">
                  <div className="container iRow">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="container">
                          <div className="row">
                            <div className="col-2 text-center">
                              <i class="fas fa-signature fa-lg enterImg"></i>
                            </div>
                            <div className="col-10">
                              <input
                                type="text"
                                style={{ textTransform: "capitalize" }}
                                placeholder="Enter Item Name"
                                onChange={(e) => setNameChange(e.target.value)}
                                value={nameC}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 ">
                        <div className="container">
                          <div className="row">
                            <div className="col-2 text-center">
                              <i class="fas fa-money-bill-wave fa-lg enterImg"></i>
                            </div>
                            <div className="col-10">
                              <input
                                type="text"
                                style={{ textTransform: "capitalize" }}
                                onChange={(e) => setPriceChange(e.target.value)}
                                placeholder="Enter Item Price"
                                value={priceC}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 ">
                        <div className="container">
                          <div className="row">
                            <div className="col-2 text-center">
                              <img src={leftI} alt="" className="enterImg" />
                            </div>
                            <div className="col-10">
                              <input
                                type="number"
                                min={0}
                                onChange={(e) => setLeftChange(e.target.value)}
                                placeholder="Enter Item Left"
                                value={leftC}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 ">
                        <div className="container">
                          <div className="row">
                            <div className="col-2 text-right">
                              <img src={totalI} alt="" className="enterImg" />
                            </div>
                            <div className="col-10">
                              <input
                                type="number"
                                onChange={(e) => setTotalChange(e.target.value)}
                                min={0}
                                placeholder="Enter Total Items"
                                value={totalC}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                  <label htmlFor="addSales text-center">
                    <input type="checkbox" name="addSales" id="" checked={salesC} onChange={(e) => {
                      setSaleChange(e.target.checked);
                    }} />
                  &nbsp;Add to Sales
                  </label>
                  </div>
                  <div className="text-center">
                    <label htmlFor="addDP">
                      <input type="checkbox" name="addDP" id="" onChange={(e) => {
                        setDP(e.target.checked);
                      }} disabled={!salesC}
                        checked={DP} />
                    &nbsp;Discount Price
                  </label>
                    <input type="number" name="DP" id="" placeholder="Enter Discount Price" onChange={(e) => setDisc(e.target.value)} disabled={!DP} value={discP} />
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-danger"
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
    }
  });
  const searchName = () => {
    history.push(`/home/${localStorage.getItem("id")}/${sQ}`);
    window.location.reload();
  };
  const showAll = () => {
    history.push(`/home/${localStorage.getItem("id")}/`);
    window.location.reload();
  };
  const showC = () => {
    return (
      <BarChart
        width={window.innerWidth * 0.98}
        height={(window.innerWidth > 800) ? window.innerHeight : window.innerHeight * 0.6}
        data={userData.sales}
        margin={(window.innerWidth > 800) ? {
          top: 5,
          right: 100,
          left: 100,
          bottom: 5,
        } : {
          top: 50,
          right: 10,
          left: 10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend style={{ textTransform: "capitalize" }} />
        <Bar dataKey="sale" fill="#084298" />
      </BarChart>
    );
  }
  return (
    <div className="home">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            SupDB
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
                <a class="nav-link" href={`/home/${localStorage.getItem("id")}/`}>
                  Show All
                </a>
              </li>
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
              <div className="row align-items-center">
                <div className="col-lg-1 col-2">
                  <i className="fas fa-signature fa-lg"></i>
                </div>
                <div className="col-lg-11 col-10">
                  {userData.name}
                </div>
              </div>
              <div className="row align-items-center">
                <div className="col-lg-1 col-2">
                  <i class="fas fa-phone"></i>
                </div>
                <div className="col-lg-11 col-10">
                  {userData.phNo}
                </div>
              </div>
              <div className="row align-items-center">
                <div className="col-lg-1 col-2">
                  <i class="fas fa-envelope"></i>
                </div>
                <div className="col-lg-11 col-10">
                  {userData.email}
                </div>
              </div>
              <div className="row align-items-center">
                <div className="col-lg-1 col-2">
                  <i class="fas fa-map-marked-alt"></i>
                </div>
                <div className="col-lg-11 col-10">
                  {userData.address}
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
                  <div className="container">
                    <div className="row">
                      <div className="col-2 text-center">
                        <i class="fas fa-signature fa-lg enterImg"></i>
                      </div>
                      <div className="col-10">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                          placeholder="Enter Item Name"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="container">
                    <div className="row">
                      <div className="col-2 text-center">
                        <i class="fas fa-money-bill-wave fa-lg enterImg"></i>
                      </div>
                      <div className="col-10">
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
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="container">
                    <div className="row">
                      <div className="col-2 text-center">
                        <img src={leftI} alt="" className="enterImg" />
                      </div>
                      <div className="col-10">
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
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="container">
                    <div className="row">
                      <div className="col-2 text-center">
                        <img src={totalI} alt="" className="enterImg" />
                      </div>
                      <div className="col-10">
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
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="bRow enter">
          <button type="button" className="btn btn-primary" onClick={enter}>
            Enter
              </button>
        </div>
      </div>
      <div class="card  rounded containerL">
        <div class="card-header text-center">
          <h2>Items</h2>
        </div>
        <ul class="list-group list-group-flush" style={{ maxHeight: "85vh", overflowY: "scroll" }}>
          {data.length == 0 ? (
            <h4 className="text-center">
              {match.params.query == undefined ? ('Please Enter Data') : ('No data found for search query ' + match.params.query)}
            </h4>
          ) : (
            <span>
              <li
                style={{ textTransform: "capitalize" }}
                className="list-group-item  text-center sticky-top"
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
      <div className="text-center" style={{ margin: "5%" }}>
        <h3>
          Previous Week Sales - {userData.prevWeekSales}
        </h3>
      </div>
      <h4 className="text-center" style={{ marginBottom: "2%" }}>This Week Sales</h4>
      {showC()}
      <div className="text-center"></div>
      <footer className="footer text-center">
        <div className="text-center" style={{width:"100%"}}>Made By:</div>
        <div className="row align-items-center text-center">
          <div class="col-lg-6">
             Raghav Khatoria
              </div>
          <div class="col-lg-6">
            <div class="social-btns">
              Amulya Ojha
              {/* <a class="btn insta" href="https://www.instagram.com/raghavkhatoria/" target="_blank"><i class="fab fa-instagram fa"></i></a>
              <a class="btn linkedin" href="https://www.linkedin.com/in/raghav-khatoria-b3053018b/" target="_blank"><i class="fa fa-linkedin"></i></a> */}
            </div>
          </div>
        </div>
        <div className="text-center flaticon" >
          Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
        </div>
      </footer>
    </div>
  );
}
export default Home;
