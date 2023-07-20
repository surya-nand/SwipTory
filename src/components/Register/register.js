import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import closeSymbol from "./../../Assets/closesymbol.jpg";
import "./../Register/register.modules.css";
import axios from "axios";
const Base_URL = "https://server-swipe.onrender.com";

function Register() {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    userName: "",
    password: "",
    bookmarks: [],
    stories: [],
    likes: [],
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

  const [isRegisterFormOpen, setIsRegisterFormOpen] = useState(true);
  const handleRegisterFormSubmit = async (event) => {
    event.preventDefault();
    const existingUser = registeredUsers.find(
      (user) =>
        user.userName.localeCompare(registerData.userName, "en-US", {
          sensitivity: "base",
        }) === 0
    );
    if (existingUser) {
      window.alert("User already exists. Please Signin");
      setIsRegisterFormOpen(false);
      navigate('/')
    } else {
      try {
        const response = await axios.post(
          `${Base_URL}/api/storyUsers`,
          registerData
        );
        console.log(response);
        window.alert(
          `Registration Successful! welcome ${registerData.userName}`
        );
        setIsRegisterFormOpen(false);
        console.log(registerData);
        navigate("/", {
          state: {
            loggedInUser: registerData,
          },
        });
      } catch (error) {
        console.log("Error:", error);
      }
    }
  };
  const handleRegisterFormClose = () => {
    setIsRegisterFormOpen(false);
    navigate("/");
  };
  const handleRegisterInputChange = (event) => {
    const { name, value } = event.target;
    setRegisterData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div>
      {isRegisterFormOpen && (
        <div className="overlay">
          <div className="register-modal">
            <form method="POST" onSubmit={handleRegisterFormSubmit}>
              <div className="add-register-form">
                <div className="registration-data">
                  <img
                    className="close-symbol"
                    src={closeSymbol}
                    onClick={handleRegisterFormClose}
                    alt="close-symbol"
                  ></img>
                  <h1>Register to SwipTory</h1>
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
                          value={registerData.userName}
                          onChange={handleRegisterInputChange}
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
                          value={registerData.password}
                          minLength="5"
                          required
                          placeholder="Enter Password"
                          onChange={handleRegisterInputChange}
                        ></input>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="registration-details-button"
                    >
                      <p className="register-text">Register</p>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
