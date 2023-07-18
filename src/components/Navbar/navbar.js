import React from "react";
import axios from "axios";
import "./../Navbar/navbar.css";
import closeSymbol from "./../../Assets/closesymbol.jpg";
import profilePic from "./../../Assets/picture.jpg";
import hamBurger from "./../../Assets/hamburger.png";
import bookmark from "./../../Assets/bookmark.jpg";
import { useNavigate, useLocation } from "react-router";
import { useState } from "react";

const Base_URL = "http://localhost:5000";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedInUser = location.state && location.state.loggedInUser;

  const [isAddStoryFormOpen, setIsAddStoryFormOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAddSlideClicked, setIsAddSlideClicked] = useState(false)
  const [slides, setSlides] = useState([
    {
      slide_heading: "",
      slide_description: "",
      slide_imageurl: "",
      slide_category: "",
    },
    {
      slide_heading: "",
      slide_description: "",
      slide_imageurl: "",
      slide_category: "",
    },
    {
      slide_heading: "",
      slide_description: "",
      slide_imageurl: "",
      slide_category: "",
    },
  ]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const handleRegisterButton = () => {
    navigate("/register");
  };

  const handleSigninButton = () => {
    navigate("/login");
  };


  const handleBookmarksButton = () => {
    if (location.pathname === "/bookmarkpage") {
      axios
        .get(`${Base_URL}/api/storyUsers`)
        .then((res) => {
          let users_data = res.data;

          const currentUser = users_data.find(
            (user) => user._id === loggedInUser._id
          );
          console.log(currentUser);

          navigate("/", {
            state: {
              loggedInUser: currentUser,
            },
          });
          console.log(currentUser);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .get(`${Base_URL}/api/storyUsers`)
        .then((res) => {
          let users_data = res.data;

          const currentUser = users_data.find(
            (user) => user._id === loggedInUser._id
          );
          console.log(currentUser);

          navigate("/bookmarkpage", {
            state: {
              loggedInUser: currentUser,
            },
          });
          console.log(currentUser);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleAddStoryButton = () => {
    setIsAddStoryFormOpen(true);
  };



  const handleAddSlide = () => {
    setIsAddSlideClicked(true)
    if (slides.length >= 6) return; // Limit the number of slides to 6

    setSlides([
      ...slides,
      {
        slide_heading: "",
        slide_description: "",
        slide_imageurl: "",
        slide_category: "",
      },
    ]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedSlides = [...slides];
    updatedSlides[index][field] = value;
    setSlides(updatedSlides);
  };

  const handleSlideClick = (index) => {
    setCurrentSlideIndex(index);
  };

  const handleSlideButtonClick = (e, index) => {
    e.preventDefault();
    handleSlideClick(index);
  };

  const handlePreviousSlide = () => {
    setCurrentSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      Math.min(prevIndex + 1, slides.length - 1)
    );
  };

  const handleRemoveSlide = (index) => {
    setSlides((prevSlides) => {
      const updatedSlides = [...prevSlides];
      updatedSlides.splice(index, 1);
      return updatedSlides;
    });
  };

  const handleCloseAddStoryForm = () => {
    setSlides([
      {
        slide_heading: "",
        slide_description: "",
        slide_imageurl: "",
        slide_category: "",
      },
      {
        slide_heading: "",
        slide_description: "",
        slide_imageurl: "",
        slide_category: "",
      },
      {
        slide_heading: "",
        slide_description: "",
        slide_imageurl: "",
        slide_category: "",
      },
    ]);
    setIsAddStoryFormOpen(false);
  };

  const handleMenuButton = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleUserLogout = () =>{
    navigate('/')
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate minimum 3 slides
    if (slides.length < 3) {
      // Display an error message or handle it as per your app's design
      alert("Please fill at least 3 slides");
      return;
    }
    try {
      const story = {
        storyHeading: slides[0].slide_heading,
        storyDescription: slides[0].slide_description,
        storyCategory: slides[0].slide_category,
        storyImageUrl: slides[0].slide_imageurl,
        slides: slides.map((slide) => ({
          slide_heading: slide.slide_heading,
          slide_description: slide.slide_description,
          slide_imageurl: slide.slide_imageurl,
          slide_category: slide.slide_category,
        })),
        likesCount: 0,
      };

      if (loggedInUser) {
        loggedInUser.stories = [...loggedInUser.stories, story];
      }

      const category = {
        category: slides[0].slide_category,
      };

      const response = await axios.post(
        "http://localhost:5000/api/stories",
        story
      );

      axios
        .put(`${Base_URL}/api/storyUsers/${loggedInUser._id}`, loggedInUser)
        .then((res) => {
          console.log("User details updated:", res.data);
        })
        .catch((error) => {
          console.log("Failed to update user details:", error);
        });
      await axios
        .post(`${Base_URL}/api/categories`, category)
        .then((res) => {
          console.log("Category details updated:", res.data);
        })
        .catch((error) => {
          console.log("Failed to update category details:", error);
        });
      console.log(response.data);

      // Reset the form after successful submission
      setSlides([
        {
          slide_heading: "",
          slide_description: "",
          slide_imageurl: "",
          slide_category: "",
        },
        {
          slide_heading: "",
          slide_description: "",
          slide_imageurl: "",
          slide_category: "",
        },
        {
          slide_heading: "",
          slide_description: "",
          slide_imageurl: "",
          slide_category: "",
        },
      ]);
      setIsAddStoryFormOpen(false);
      navigate("/", {
        state: {
          loggedInUser: loggedInUser,
        },
      });
    } catch (error) {
      console.error(error);
      // Handle error state or display an error message to the user
    }
  };

  return (
    <div>
      <div className="navbar-component">
        <div className="website-title">SwipTory</div>
        {loggedInUser ? (
          <div className="loggedin-component">
            <button
              onClick={handleBookmarksButton}
              className="bookmarks-button"
            >
              <img className="bookmark-image" src={bookmark} alt=""></img>
              <div className="loggedin-bookmarks">Bookmarks</div>
            </button>
            <button onClick={handleAddStoryButton} className="addstory-button">
              <div className="loggedin-addstory">Add story</div>
            </button>
            <div className="loggedin-image">
              <img
                className="profile-pic"
                src={profilePic}
                alt="profile-pic"
              ></img>
            </div>
            <div className="loggedin-menu" onClick={handleMenuButton}>
              <img className="menu-icon" src={hamBurger} alt="menu-icon"></img>
            </div>
            {isMenuOpen && (
              <div className="menu-bar">
                <div className="menu-user-name">{loggedInUser.userName}</div>
                <div onClick ={handleUserLogout}className="user-logout">Logout</div>
              </div>
            )}
          </div>
        ) : (
          <div className="register-component">
            <button onClick={handleRegisterButton} className="register-button">
              <div className="register-now">Register Now</div>
            </button>
            <button onClick={handleSigninButton} className="signin-button">
              <div className="sign-in">Sign in</div>
            </button>
          </div>
        )}
      </div>
      {isAddStoryFormOpen && (
        <>
          <div className="overlay">
            <div className="addstory-modal">
              <form method="POST" onSubmit={handleSubmit}>
                <div
                  className="close-addstoryform"
                  onClick={handleCloseAddStoryForm}
                >
                  <img
                    src={closeSymbol}
                    alt="close-symbol-pic"
                    className="close-symbol-pic"
                  ></img>
                </div>
                <div className="slides-number-message">
                  <p>Add upto 6 slides</p>
                </div>
                <div className="story-slides-component">
                  {slides.map((_, index) => (
                    <>
                    <button
                      key={index}
                      onClick={(e) => handleSlideButtonClick(e, index)}
                       className={`each-slide ${
                  index === currentSlideIndex ? "selected-slide" : ""
                }`}
                    >
                      Slide {index + 1}
                    </button>
                    {slides.length > 3 && index >= 3 && (
                      <div className="close-symbol-container">
                        <img
                          src={closeSymbol}
                          alt="close-symbol"
                          className="slide-close-symbol"
                          onClick={() => handleRemoveSlide(index)}
                        />
                      </div>
                    )}
                    </>
                  ))}
                  {slides.length < 6 && (
                    <button
                      type="button"
                      onClick={handleAddSlide}
                      className="add-new-slide"
                    >
                      Add +
                    </button>
                  )}
                </div>
                <div>
                  <div className="slide-inputs">
                    <div className="slide-heading-input">
                      <p>Heading :</p>
                      <input
                        type="text"
                        required
                        placeholder="Your Heading"
                        value={slides[currentSlideIndex].slide_heading}
                        onChange={(e) =>
                          handleInputChange(
                            currentSlideIndex,
                            "slide_heading",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="slide-description-input">
                      <p>Description :</p>
                      <input
                        type="text"
                        required
                        placeholder="Story Description"
                        value={slides[currentSlideIndex].slide_description}
                        onChange={(e) =>
                          handleInputChange(
                            currentSlideIndex,
                            "slide_description",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="slide-image-input">
                      <p>Image :</p>
                      <input
                        type="text"
                        required
                        placeholder="Add Image URL"
                        value={slides[currentSlideIndex].slide_imageurl}
                        onChange={(e) =>
                          handleInputChange(
                            currentSlideIndex,
                            "slide_imageurl",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="slide-category-input">
                      <p>Category: </p>
                      <select
                        className="drop-down-menu"
                        required
                        value={slides[currentSlideIndex].slide_category}
                        onChange={(e) =>
                          handleInputChange(
                            currentSlideIndex,
                            "slide_category",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select Category</option>
                        <option value="Food">Food</option>
                        <option value="Health and Fitness">
                          Health and Fitness
                        </option>
                        <option value="Travel">Travel</option>
                        <option value="Movie">Movie</option>
                        <option value="Education">Education</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="post-story-buttons">
                  <div className="previous-next-buttons">
                    {currentSlideIndex > 0 && (
                      <button
                        type="button"
                        className="previous-slide-button"
                        onClick={handlePreviousSlide}
                      >
                        Previous
                      </button>
                    )}
                    {currentSlideIndex < slides.length - 1 && (
                      <button
                        type="button"
                        className="next-slide-button"
                        onClick={handleNextSlide}
                      >
                        Next
                      </button>
                    )}
                  </div>
                  <div>
                    {slides.length >= 3 && (
                      <button className="post-story-button" type="submit">
                        Post
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Navbar;
