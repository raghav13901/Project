import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./RegisterScreen.module.css";
import img from "../assets/undraw_authentication_fsn5 (3).svg";

const RegisterScreen = ({ history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [address, setAddress] = useState("HELLO WORLD");
  const [phNo, setPhone] = useState(9856321470);
  const [dbName, setDBName] = useState("HELLO");

  const registerHandler = async (e) => {
    e.preventDefault();

    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    if (password !== confirmpassword) {
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setError("");
      }, 5000);
      return setError("Passwords do not match");
    }

    try {
      const { data } = await axios.post(
        "/api/auth/register",
        {
          name,
          email,
          password,
          address,
          phNo,
          dbName
        },
        config
      );

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("id", data.id);
      localStorage.setItem("table", data.dbName);
      history.push(`/home/${localStorage.getItem("id")}`);
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <div className={styles.SignScreen}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Navbar</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Link</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className={`${styles.SignRow} row align-items-center`}>
        <div className={`col-lg-8 ${styles.SignImg} text-center`}>
          <img src={img} alt="Sign In Img"/>
        </div>
        <div className="col-lg-4">
          <form onSubmit={registerHandler} className={`${styles.SignForm} shadow-lg ${styles.rounded}`}>
          <h2 className="register-screen__title">Register</h2>
          {error && <span className="error-message">{error}</span>}
            <div className={`${styles.SignFRow} form-group`}>
              <div className="row align-items-center">
                <div className="col-1 text-left">
                  <label htmlFor="name"><i className="fas fa-signature fa-lg"></i></label>
                </div>
                <div className={`col-11 ${styles.textF}`}>
                  <input
                    type="text"
                    required
                    id="name"
                    placeholder="Enter username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>  
            </div>
            <div className={`${styles.SignFRow} form-group`}>
              <div className="row align-items-center">
                <div className="col-1 text-left">
                  <label htmlFor="email"><i className="fas fa-envelope fa-lg"></i></label>
                </div>
                <div className={`col-11 ${styles.textF}`}>
                  <input
                    type="email"
                    required
                    id="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>  
            </div>
            <div className={`${styles.SignFRow} form-group`}>
              <div className="row align-items-center">
                <div className="col-1 text-left">
                  <label htmlFor="password"><i className="fas fa-key fa-lg"></i></label>
                </div>
                <div className={`col-11 ${styles.textF}`}>
                  <input
                    type="password"
                    required
                    id="password"
                    autoComplete="true"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>  
            </div>
            <div className={`${styles.SignFRow} form-group`}>
              <div className="row align-items-center">
                <div className="col-1 text-left">
                  <label htmlFor="confirmpassword"><i className="fas fa-check-circle fa-lg"></i></label>
                </div>
                <div className={`col-11 ${styles.textF}`}>
                  <input
                    type="password"
                    required
                    id="confirmpassword"
                    autoComplete="true"
                    placeholder="Confirm password"
                    value={confirmpassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>  
            </div>
            <input
                    type="text"
                    required
                    id="confirmpassword"
                    autoComplete="true"
                    placeholder="Confirm password"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <input
                    type="tel"
                    required
                    id="confirmpassword"
                    autoComplete="true"
                    placeholder="Confirm password"
                    value={phNo}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <input
                    type="text"
                    required
                    id="confirmpassword"
                    autoComplete="true"
                    placeholder="Confirm password"
                    value={dbName}
                    onChange={(e) => setDBName(e.target.value)}
                  />
            <button type="submit" className="btn btn-primary">
              Register
            </button>

            <div className={styles.register}>
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
