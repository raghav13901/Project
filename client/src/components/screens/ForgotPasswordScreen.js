import { useState } from "react";
import axios from "axios";
import img from '../assets/undraw_forgot_password_gi2d.svg';
import styles from "./ForgotPasswordScreen.module.css";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const forgotPasswordHandler = async (e) => {
    e.preventDefault();

    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        "/api/auth/forgotpassword",
        { email },
        config
      );

      setSuccess(data.data);
    } catch (error) {
      setError(error.response.data.error);
      setEmail("");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <div className={`${styles.forgotPassword}`}>
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
      <div className={`${styles.row} row align-items-center`}>
        <div className={`col-lg-8 ${styles.forImg}`}>
          <img src={img} alt=""/>
        </div>
        <div className={`col-lg-4`}>
          <form
            onSubmit={forgotPasswordHandler}
            className={`shadow-lg ${styles.rounded}`}
          >
            <h2 className="text-center">Forgot Password</h2>
            {error && <span className="error-message">{error}</span>}
            {success && <span className="success-message">{success}</span>}
            <p className="text-center">
                Please enter the email address you register your account with. We
                will send you reset password confirmation to this email
            </p>
            <div className={`form-group ${styles.forRow}`}>
              <div className={`row align-items-center ${styles.row}`}>
                <div className={`col-1 text-center ${styles.labelT}`}>
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
            <button type="submit" className="btn btn-primary">
              Send Email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
