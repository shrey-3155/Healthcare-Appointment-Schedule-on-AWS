import React, { useContext,useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../image/navbaricon1.png";
import { AuthContext } from "../Auth/AuthContext";
import axios from "axios";
import SignupModal from './SignupModal';

// import GoogleLogin from "react-google-login";
// import axios from "axios";

const Navbar = () => {
  const { token, setToken, setGoogleId } = useContext(AuthContext);
  const history = useHistory();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");


  const handleSignup = async (formData) => {
    try {
      console.log('Signup Data:', formData);
    } catch (error) {
      console.error('Signup failed', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/patients/login`, // Adjust endpoint if needed
        loginData
      );

      if (response.data) {
        // Store token and user ID in local storage
        const { token, googleId } = response.data;
        window.localStorage.setItem("token", token);
        window.localStorage.setItem("googleId", googleId);

        setToken(token);
        setGoogleId(googleId);

        history.push("/patient");
        
        setShowLoginModal(false); // Close login modal
      }
    } catch (error) {
      console.error("[Login] Error:", error);
      setErrorMessage("Invalid email or password");
    }
  };

  const signOut = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("googleId");
    setToken(null);
    setGoogleId(null);
    history.push("/");
  };
  return (
    <nav
      className="navbar navbar-dark bg-dark navbar-expand-lg pl-4 pr-4 w-100 "
      style={{ backgroundColor: " #1a1a1a" }}
    >
      <Link to="/" className="navbar-brand">
        <img
          src="https://healtcareappointmentschedule.s3.us-east-1.amazonaws.com/images/navbaricon1.png"
          alt=""
          width="30"
          height="24"
          className="d-inline-block align-top mr-2 mt-1"
        ></img>
        Hospital Management System
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#collapsibleNavbar"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse " id="collapsibleNavbar">
        <ul className="navbar-nav ml-auto text-light bg-dark">
          <li className="navbar-item" style={{ textAlign: "right" }}>
            <link to="/" className="nav-link " style={{ padding: 0 }} />
            {!token && (
              <>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="btn btn-outline-primary mr-2"
                >
                  Login As A Patient
                </button>
                <button
                  onClick={() => setShowSignupModal(true)}
                  className="btn btn-primary"
                >
                  Sign Up
                </button>
              </>
            )}
            {token && (
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={signOut}
              >
                Logout
              </button>
            )}
          </li>
        </ul>
      </div>
      <SignupModal 
        show={showSignupModal} 
        handleClose={() => setShowSignupModal(false)}
        onSignup={handleSignup}
      />
   {/* Login Modal */}
   {showLoginModal && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Login</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowLoginModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleLogin}>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      required
                    />
                  </div>
                  {errorMessage && (
                    <div className="alert alert-danger">{errorMessage}</div>
                  )}
                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
