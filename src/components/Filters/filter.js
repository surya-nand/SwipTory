import React, { useState, useEffect } from "react";
import axios from "axios";
import "./../Filters/filter.css";

import likedSymbol from "./../../Assets/liked.png";
import bookmarkedSymbol from "./../../Assets/bookmarked.png";
import unLikedSymbol from "./../../Assets/unliked.png";
import unBookmarkedSymbol from "./../../Assets/unbookmarked.png";
import closeSymbol from "./../../Assets/close.png";
import shareSymbol from "./../../Assets/share.png";
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
            {loggedInUser.stories.slice(0, showAllStories ? undefined : 4).map((story) => (
              <div
                className="story-card"
                onClick={() => handleStoryCard(story)}
                key={story._id}
              >
                <div className="story-heading">{story.storyHeading}</div>
                <div className="story-description">{story.storyDescription}</div>
                <div className="story-image">
                  <img
                    className="story-image-picture"
                    src={story.storyImageUrl}
                    alt="story"
                  />
                </div>
              </div>
            ))}
            <div className="see-more-options">
              {loggedInUser.stories && (
                <span onClick={() => setShowAllStories(!showAllStories)}>
                  {showAllStories ? 'See Less' : 'See More'}
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="no-userstories-message">Your stories will appear here</div>
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
    </>
  );
}
export default Filter;
