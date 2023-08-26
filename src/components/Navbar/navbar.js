import React from "react";
import axios from "axios";
import "./../Navbar/navbar.modules.css";
import { v4 as uuidv4 } from "uuid";
import closeSymbol from "./../../Assets/closesymbol.jpg";
import profilePic from "./../../Assets/picture.jpg";
import hamBurger from "./../../Assets/hamburger.png";
import hamBurger2 from "./../../Assets/hamburger.png";
import bookmark from "./../../Assets/bookmark.jpg";
import { useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";

const Base_URL = "https://server-swipe.onrender.com";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedInUser = location.state && location.state.loggedInUser;

  const [isAddStoryFormOpen, setIsAddStoryFormOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formValidityAlertOpen, setFormValidityAlertOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileLoginMenuOpen, setIsMobileLoginMenuOpen] = useState(false);

  //first 3 empty slides
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

  useEffect(() => {
    // Checking  if the first 3 slides have all required fields filled
    const firstThreeSlides = slides.slice(0, 3);
    const areSlidesValid = firstThreeSlides.every(
      (slide) =>
        slide.slide_heading &&
        slide.slide_description &&
        slide.slide_imageurl &&
        slide.slide_category
    );

    // Update the form's validity
    setIsFormValid(areSlidesValid);
  }, [slides]);

  //Navigating Title click to main-page
  const handleTitleClick = () => {
    navigate("/", {
      state: {
        loggedInUser: loggedInUser,
      },
    });
  };

  // Slide Index to handle slide navigation
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const handleRegisterButton = () => {
    navigate("/register");
  };

  const handleSigninButton = () => {
    navigate("/login");
  };

  //Navigates to bookmarks page with updated loggedIn user bookmarks
  const handleBookmarksButton = () => {
    axios
      .get(`${Base_URL}/api/storyUsers`)
      .then((res) => {
        let users_data = res.data;

        const currentUser = users_data.find(
          (user) => user._id === loggedInUser._id
        );
        navigate("/bookmarkpage", {
          state: {
            loggedInUser: currentUser,
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAddStoryButton = () => {
    setIsAddStoryFormOpen(true);
  };

  // Add slide button to add a max of 6 slides
  const handleAddSlide = () => {
    if (slides.length >= 6) return;

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
  //Updating input changes based on indexes and assigning to slides
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

 //max function to make sure no negative Index 
  const handlePreviousSlide = () => {
    setCurrentSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

 //min function to make sure Index doesn't go beyond slides.length
  const handleNextSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      Math.min(prevIndex + 1, slides.length - 1)
    );
  };

  const handleRemoveSlide = (index) => {
    setSlides((prevSlides) => {
      const updatedSlides = [...prevSlides];
      updatedSlides.splice(index, 1);
      setCurrentSlideIndex(index - 1);

      if (index === currentSlideIndex) {
        setCurrentSlideIndex(
          index === updatedSlides.length
            ? currentSlideIndex - 1
            : currentSlideIndex
        );
      }
      return updatedSlides;
    });
  };

  const handleCloseAddStoryForm = () => {
    setIsAddStoryFormOpen(false);
    setFormValidityAlertOpen(false);
  };

  const handleMenuButton = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleUserLogout = () => {
    navigate("/");
  };

  //handling mobile functions
  const handleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileLoginMenu = () => {
    setIsMobileLoginMenuOpen(!isMobileLoginMenuOpen);
  };
  const [isMobileStory, setIsMobileStory] = useState(false);

  const handleMobileUserStories = () => {
    setIsMobileStory(!isMobileStory);
    navigate("/mobilestories", {
      state: {
        loggedInUser: loggedInUser,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // checking form validity
    if (!isFormValid) {
      // Display an alert
      setFormValidityAlertOpen(true);
      return;
    }
    try {
      
      //added new unique to every story posted by an user
      const newStoryId = uuidv4();
      const story = {
        unique_id: newStoryId,
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
        window.alert("Story successfully posted");
        setIsAddStoryFormOpen(false);
        setFormValidityAlertOpen(false);
      }

      const category = {
        category: slides[0].slide_category,
      };

      await axios
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

      await axios
        .post(`${Base_URL}/api/stories`, story)
        .then((res) => {
          console.log("Story details updated:", res.data);
        })
        .catch((error) => {
          console.log("Failed to update story details:", error);
        });

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
      setFormValidityAlertOpen(false);
      navigate("/", {
        state: {
          loggedInUser: loggedInUser,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="navbar-component">
        <div className="website-title" onClick={handleTitleClick}>
          SwipTory
        </div>
        {loggedInUser ? (
          <>
            <div className="loggedin-component">
              <button
                onClick={handleBookmarksButton}
                className="bookmarks-button"
              >
                <img className="bookmark-image" src={bookmark} alt=""></img>
                <div className="loggedin-bookmarks">Bookmarks</div>
              </button>
              <button
                onClick={handleAddStoryButton}
                className="addstory-button"
              >
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
                <img
                  className="menu-icon"
                  src={hamBurger}
                  alt="menu-icon"
                ></img>
              </div>
              {isMenuOpen && (
                <div className="menu-bar">
                  <div className="menu-user-name">{loggedInUser.userName}</div>
                  <div onClick={handleUserLogout} className="user-logout">
                    Logout
                  </div>
                </div>
              )}
            </div>
            <div
              onClick={handleMobileLoginMenu}
              className="mobile-loggedin-hamburger"
            >
              <img src={hamBurger2} alt="loggedin-hamburger"></img>
            </div>
            {isMobileLoginMenuOpen && (
              <div className="mobile-loggedin-user-details">
                <div className="mobile-user-info">
                  <img
                    className="profile-pic"
                    src={profilePic}
                    alt="profile-pic"
                  ></img>
                  <div className="mobile-username">{loggedInUser.userName}</div>
                </div>
                <div
                  className="mobile-user-stories"
                  onClick={handleMobileUserStories}
                >
                  Your stories
                </div>
                <div
                  className="mobile-user-add-story"
                  onClick={handleAddStoryButton}
                  o
                >
                  Add Story
                </div>
                <div
                  className="mobile-user-bookmarks"
                  onClick={handleBookmarksButton}
                >
                  <img
                    src={bookmark}
                    alt="mobile-bookmarks"
                    className="mobile-bookmarks"
                  ></img>
                  <p>Bookmarks</p>
                </div>
                <div className="mobile-user-logout" onClick={handleUserLogout}>
                  Logout
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="register-component">
              <button
                onClick={handleRegisterButton}
                className="register-button"
              >
                <div className="register-now">Register Now</div>
              </button>
              <button onClick={handleSigninButton} className="signin-button">
                <div className="sign-in">Sign in</div>
              </button>
            </div>
            <div onClick={handleMobileMenu} className="mobile-menu-component">
              <img src={hamBurger2} alt="mobile-hamburger"></img>
            </div>
            {isMobileMenuOpen && (
              <div className="mobile-menu-block">
                <div onClick={handleSigninButton} className="mobile-login">
                  login
                </div>
                <div onClick={handleRegisterButton} className="mobile-register">
                  Register
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {isAddStoryFormOpen && (
        <>
          <div className="overlay">
            <div className="addstory-modal">
              <form method="POST" onSubmit={handleSubmit} id="add-story-form">
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
                {formValidityAlertOpen && (
                  <div className="form-validity-alert">
                    <p>Please fill min 3 slides to post</p>
                  </div>
                )}
                <div className="slides-number-message">
                  <p>Add upto 6 slides</p>
                </div>
                <div className="story-slides-block">
                  <div className="mobile-add-story-heading">
                    Add story to your feed
                  </div>
                  <div className="story-slides-component">
                    {slides.map((_, index) => (
                      <div key={index}>
                        <button
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
                      </div>
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
                </div>
                <div className="post-story-buttons">
                  <div className="previous-next-buttons">
                    <button
                      type="button"
                      className="previous-slide-button"
                      onClick={handlePreviousSlide}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className="next-slide-button"
                      onClick={handleNextSlide}
                    >
                      Next
                    </button>
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
