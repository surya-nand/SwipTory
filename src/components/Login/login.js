import React from 'react'
import './../Login/login.css'
import { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import closeSymbol from './../../Assets/closesymbol.jpg'
const Base_URL = "http://localhost:5000";

function Login() {
    const navigate = useNavigate()
    const [isSigninFormOpen, setIsSigninFormOpen] = useState(true);
    const [isUsernameAlertOpen, setIsUsernameAlertOpen] = useState(false);
    const [isPasswordAlertOpen, setIsPasswordAlertOpen] = useState(false);

    const [signinData, setSigninData] = useState({
        userName: "",
        password: "",
        bookmarks: [],
        stories: [],
        likes: []
      });
    
      const [registeredUsers, setRegisteredUsers] = useState([]);
      useEffect(() => {
        axios
          .get(`${Base_URL}/api/storyUsers`)
          .then((res) => {
            let users_data = res.data;
            setRegisteredUsers(users_data);
          })
          .catch((error) => {
            console.log(error);
          });
      }, []);

      const handleSigninFormSubmit = async (event) => {
        event.preventDefault();
        const existingUser = registeredUsers.find(
          (user) =>
            user.userName.localeCompare(signinData.userName, "en-US", {
              sensitivity: "base",
            }) === 0
        );
        if (existingUser) {
          if (existingUser.password === signinData.password) {
            window.alert(`Welcome ${signinData.userName}`);
            setIsSigninFormOpen(false);
            setIsUsernameAlertOpen(false);
            setIsPasswordAlertOpen(false);
            navigate("/", {
                state: {
                  loggedInUser: existingUser,
                },
              });
          } else {
            setIsPasswordAlertOpen(true);
          }
        } else {
          setIsUsernameAlertOpen(true);
        }
      };

      const handleSigninFormClose = () => {
        setIsSigninFormOpen(false);
        setIsUsernameAlertOpen(false);
        setIsPasswordAlertOpen(false);
        navigate("/")
      };

      const handleSigninInputChange = (event) => {
        const { name, value } = event.target;
        setSigninData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      };
    
  return (
    <div>
        {isSigninFormOpen && (
        <div className="overlay">
          <div className="register-modal">
            <form method="POST" onSubmit={handleSigninFormSubmit}>
              <div className="add-register-form">
                <div className="registration-data">
                  <img
                    className="close-symbol"
                    src={closeSymbol}
                    onClick={handleSigninFormClose}
                    alt="close-symbol"
                  ></img>
                  <h1>Login to SwipTory</h1>
                  <div className="registration-details">
                    <div className="username-details">
                      <div className="username-text">
                        <p>Username</p>
                      </div>
                      <div className="username-input">
                        <input
                          className="user-name"
                          type="name"
                          name="userName"
                          required
                          placeholder="Enter username"
                          value={signinData.userName}
                          onChange={handleSigninInputChange}
                        ></input>
                      </div>
                    </div>
                    <div className="user-password-details">
                      <div className="password-text">
                        <p>Password</p>
                      </div>
                      <div className="password-input">
                        <input
                          className="user-password"
                          type="password"
                          name="password"
                          value={signinData.password}
                          minLength="5"
                          required
                          placeholder="Enter Password"
                          onChange={handleSigninInputChange}
                        ></input>
                      </div>
                    </div>
                    {isUsernameAlertOpen && (
                      <div className="username-alert">
                        <p>Please enter valid username</p>
                      </div>
                    )}
                    {isPasswordAlertOpen && (
                      <div className="username-alert">
                        <p>Please enter correct password</p>
                      </div>
                    )}
                    <button
                      type="submit"
                      className="registration-details-button"
                    >
                      <p className="register-text">Login</p>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login;