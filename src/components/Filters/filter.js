import React, { useState, useEffect } from "react";
import axios from "axios";
import "./../Filters/filter.css";

import likedSymbol from "./../../Assets/liked.png";
import bookmarkedSymbol from "./../../Assets/bookmarked.png";
import unLikedSymbol from "./../../Assets/unliked.png";
import unBookmarkedSymbol from "./../../Assets/unbookmarked.png";
import closeSymbol from "./../../Assets/close.png";
import closeSymbol2 from "./../../Assets/closesymbol.jpg";
import shareSymbol from "./../../Assets/share.png";
import editSymbol from "./../../Assets/edit.png";
import { useNavigate, useLocation } from "react-router";

const Base_URL = "http://localhost:5000";

function Filter() {
  const location = useLocation();
  const navigate = useNavigate();
  const loggedInUser = location.state && location.state.loggedInUser;

  const [categories, setCategories] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [isStoryCardOpen, setIsStoryCardOpen] = useState(false);
  const [openedSlides, setOpenedSlides] = useState([]);
  const [openedStory, setOpenedStory] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [showAllStories, setShowAllStories] = useState(false);
  const [isEditStoryFormOpen, setIsEditStoryFormOpen] = useState(false);
  const [editingStory, setEditingStory] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
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
    setIsEditStoryFormOpen(false);
  };

  const handleAddSlide = () => {
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

      if (index === currentSlideIndex) {
        // If the removed slide was the last slide, select the previous slide
        // Otherwise, keep the currentSlideIndex unchanged
        setCurrentSlideIndex(
          index === updatedSlides.length ? index - 1 : currentSlideIndex
        );
      }

      return updatedSlides;
    });
  };

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
        const editingStoryIndex = loggedInUser.stories.findIndex(
          (userStory) => userStory._id === editingStory._id
        );

        loggedInUser.stories[editingStoryIndex] = story;
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
      setIsEditStoryFormOpen(false);
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

  useEffect(() => {
    axios
      .get(`${Base_URL}/api/categories`)
      .then((res) => {
        let categories_data = res.data;
        setCategories(categories_data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${Base_URL}/api/stories`, {
        params: {
          categories: selectedCategories,
        },
      })
      .then((res) => {
        let stories_data = res.data;
        setFilteredStories(stories_data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [selectedCategories]);

  useEffect(() => {
    const uniqueCategoriesSet = new Set(
      categories.map((category) => category.category)
    );
    const uniqueCategoriesArray = Array.from(uniqueCategoriesSet);
    setUniqueCategories(uniqueCategoriesArray);
  }, [categories]);

  const handleCategorySelect = (category) => {
    if (category === "All") {
      setSelectAll(!selectAll);
      if (!selectAll) {
        setSelectedCategories(uniqueCategories);
      } else {
        setSelectedCategories([]);
      }
    } else {
      setSelectAll(false);
      if (selectedCategories.includes(category)) {
        setSelectedCategories((prevCategories) =>
          prevCategories.filter((c) => c !== category)
        );
      } else {
        setSelectedCategories((prevCategories) => [
          ...prevCategories,
          category,
        ]);
      }
    }
  };

  const handleSeeMoreButton = (category) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories((prevExpandedCategories) =>
        prevExpandedCategories.filter((c) => c !== category)
      );
    } else {
      setExpandedCategories((prevExpandedCategories) => [
        ...prevExpandedCategories,
        category,
      ]);
    }
  };

  const handleStoryCard = (story) => {
    setIsStoryCardOpen(true);
    setOpenedStory(story);
    setOpenedSlides(story.slides);
    setCurrentSlide(0);
  };

  const handleCloseStoryCard = () => {
    setIsStoryCardOpen(false);
    setOpenedStory([]);
    setOpenedSlides([]);
    setCurrentSlide(0);
  };

  const handleBookmarkStoryCard = (Story) => {
    if (loggedInUser) {
      const isBookmarked = loggedInUser.bookmarks.find(
        (bookmarkedStory) => bookmarkedStory._id === Story._id
      );
      if (isBookmarked) {
        const updatedBookmarks = loggedInUser.bookmarks.filter(
          (bookmarkedStory) => bookmarkedStory._id !== Story._id
        );
        loggedInUser.bookmarks = updatedBookmarks;
      } else {
        loggedInUser.bookmarks = [...loggedInUser.bookmarks, Story];
      }
      setIsBookmarked(!isBookmarked);
      axios
        .put(`${Base_URL}/api/storyUsers/${loggedInUser._id}`, loggedInUser)
        .then((res) => {
          console.log("User details updated:", res.data);
        })
        .catch((error) => {
          console.log("Failed to update user details:", error);
        });
    } else {
      window.alert("Please login to bookmark this story");
      navigate("/login");
    }
    console.log(loggedInUser);
  };

  const handleShareStoryCard = () => {};

  const handleLikeStoryCard = async (Story) => {
    if (loggedInUser) {
      const isLiked = await loggedInUser.likes.find(
        (likedStory) => likedStory === Story._id
      );
      if (isLiked) {
        const updatedLikes = await loggedInUser.likes.filter(
          (likedStory) => likedStory !== Story._id
        );
        loggedInUser.likes = updatedLikes;
        Story.likesCount = Story.likesCount - 1;
      } else {
        loggedInUser.likes = [...loggedInUser.likes, Story._id];
        Story.likesCount = Story.likesCount + 1;
      }
      setIsLiked(!isLiked);
      axios
        .put(`${Base_URL}/api/storyUsers/${loggedInUser._id}`, loggedInUser)
        .then((res) => {
          console.log("User details updated:", res.data);
        })
        .catch((error) => {
          console.log("Failed to update user details:", error);
        });

      axios
        .put(`${Base_URL}/api/stories/${Story._id}`, Story)
        .then((res) => {
          console.log("Story details updated:", res.data);
        })
        .catch((error) => {
          console.log("Failed to update story details:", error);
        });
    } else {
      window.alert("Please login to like this story");
      navigate("/login");
    }
  };

  const handleStoryEditButton = (e, story) => {
    e.stopPropagation();
    setEditingStory(story);
    setIsEditStoryFormOpen(true);
    const initialSlides = story.slides.map((slide) => ({
      slide_heading: slide.slide_heading,
      slide_description: slide.slide_description,
      slide_imageurl: slide.slide_imageurl,
      slide_category: slide.slide_category,
    }));
    setSlides(initialSlides);
    setCurrentSlideIndex(0);
  };

  useEffect(() => {
    let timer;
    if (isStoryCardOpen) {
      timer = setInterval(() => {
        setCurrentSlide((prevSlide) => prevSlide + 1);
        if (currentSlide === openedStory.slides.length - 1) {
          if (filteredStories && filteredStories.length > 0) {
            setIsStoryCardOpen(false);
            const currentStoryIndex = filteredStories.findIndex(
              (story) => story._id === openedStory._id
            );
            const nextStoryIndex =
              (currentStoryIndex + 1) % filteredStories.length;
            const nextStory = filteredStories[nextStoryIndex];
            if (nextStory) {
              setOpenedStory(nextStory);
              setOpenedSlides(nextStory.slides);
              setIsStoryCardOpen(true);
              setCurrentSlide(0);
            }
          }
        }
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [
    isStoryCardOpen,
    currentSlide,
    openedStory,
    openedStory.slides,
    filteredStories,
  ]);

  return (
    <>
      <div className="categories-component">
        <div
          className={`all-categories ${selectAll ? "selected-category" : ""}`}
          onClick={() => handleCategorySelect("All")}
        >
          All
        </div>
        {uniqueCategories.map((category) => (
          <div
            key={category}
            onClick={() => handleCategorySelect(category)}
            className={
              selectedCategories.includes(category) ? "selected-category" : ""
            }
          >
            {category}
          </div>
        ))}
      </div>
      {loggedInUser && (
        <div>
          <div className="user-stories-component">
            <div className="user-stories-title">Your Stories</div>
            <div className="user-stories-block">
              {loggedInUser.stories.length > 0 ? (
                <>
                  {loggedInUser.stories
                    .slice(0, showAllStories ? undefined : 4)
                    .map((story) => (
                      <div
                        className="story-card"
                        onClick={() => handleStoryCard(story)}
                        key={story._id}
                      >
                        <div className="story-heading">
                          {story.storyHeading}
                        </div>
                        <div className="story-description">
                          {story.storyDescription}
                        </div>
                        <div className="story-image">
                          <img
                            className="story-image-picture"
                            src={story.storyImageUrl}
                            alt="story"
                          />
                        </div>
                        <div
                          onClick={(e) => handleStoryEditButton(e, story)}
                          className="story-edit-block"
                        >
                          <div className="story-edit-button">
                            <img
                              src={editSymbol}
                              alt="edit-symbol"
                              className="edit-symbol"
                            ></img>
                            <p>Edit</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  <div className="see-more-options">
                    {loggedInUser.stories && (
                      <span onClick={() => setShowAllStories(!showAllStories)}>
                        {showAllStories ? "See Less" : "See More"}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="no-userstories-message">
                  Your stories will appear here
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="stories-component">
        {uniqueCategories.map((category) => {
          const Stories = filteredStories.filter(
            (story) => story.storyCategory === category
          );
          const categoryStories = expandedCategories.includes(category)
            ? Stories
            : Stories.slice(0, 4);
          return (
            categoryStories.length > 0 && (
              <>
                <div className="story-block-title">
                  Top stories about {category}
                </div>
                <div className="story-block" key={category}>
                  {categoryStories.map((story) => (
                    <div
                      className="story-card"
                      onClick={() => handleStoryCard(story)}
                      key={story._id}
                    >
                      <div className="story-heading">{story.storyHeading}</div>
                      <div className="story-description">
                        {story.storyDescription}
                      </div>
                      <div className="story-image">
                        <img
                          className="story-image-picture"
                          src={story.storyImageUrl}
                          alt="story"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  className="see-more-option"
                  onClick={() => handleSeeMoreButton(category)}
                >
                  {expandedCategories.includes(category)
                    ? "See Less"
                    : "See More"}
                </div>
              </>
            )
          );
        })}
      </div>
      {isStoryCardOpen && (
        <div className="story-card-overlay">
          <div className="story-card-container">
            <div className="story-card-content">
              {openedSlides.length > 0 && (
                <div className="story-card-slide">
                  <div className="slide-content">
                    <div className="slide-image">
                      <img
                        src={openedSlides[currentSlide].slide_imageurl}
                        className="slide-image-picture"
                        alt="slide"
                      />
                    </div>
                    <div
                      className="story-card-close"
                      onClick={handleCloseStoryCard}
                    >
                      <img
                        src={closeSymbol}
                        alt="close-symbol"
                        className="close-symbol-image"
                      ></img>
                    </div>
                    <div
                      className="story-card-share"
                      onClick={() => handleShareStoryCard(openedStory)}
                    >
                      <img
                        src={shareSymbol}
                        alt="share-symbol"
                        className="share-symbol-image"
                      ></img>
                    </div>
                    <div className="slide-heading">
                      {openedSlides[currentSlide].slide_heading}
                    </div>
                    <div className="slide-description">
                      {openedSlides[currentSlide].slide_description}
                    </div>
                    <div
                      className="story-card-like"
                      onClick={() => handleLikeStoryCard(openedStory)}
                    >
                      <img
                        src={
                          loggedInUser &&
                          loggedInUser.likes.some(
                            (likedStory) => likedStory === openedStory._id
                          )
                            ? likedSymbol
                            : unLikedSymbol
                        }
                        alt="unlike-symbol"
                        className="unlike-symbol-image"
                      ></img>
                    </div>
                    <div className="story-card-likecount">
                      <h1>{openedStory.likesCount}</h1>
                    </div>
                    <div
                      className="story-card-bookmark"
                      onClick={() => handleBookmarkStoryCard(openedStory)}
                    >
                      <img
                        src={
                          loggedInUser &&
                          loggedInUser.bookmarks.some(
                            (bookmarkedStory) =>
                              bookmarkedStory._id === openedStory._id
                          )
                            ? bookmarkedSymbol
                            : unBookmarkedSymbol
                        }
                        alt="unbookmark-symbol"
                        className="unbookmark-symbol-image"
                      ></img>
                    </div>
                  </div>
                  <div className="slide-progress-bar">
                    {openedSlides.map((slide, index) => (
                      <div
                        key={index}
                        className={`slide-progress-bar-item ${
                          index === currentSlide ? "active" : ""
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isEditStoryFormOpen && (
        <>
          <div className="overlay">
            <div className="addstory-modal">
              <form method="POST" onSubmit={handleSubmit}>
                <div
                  className="close-addstoryform"
                  onClick={handleCloseAddStoryForm}
                >
                  <img
                    src={closeSymbol2}
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
                            src={closeSymbol2}
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
    </>
  );
}
export default Filter;
