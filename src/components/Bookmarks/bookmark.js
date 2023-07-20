import React from "react";
import { useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import likedSymbol from "./../../Assets/liked.png";
import bookmarkedSymbol from "./../../Assets/bookmarked.png";
import unLikedSymbol from "./../../Assets/unliked.png";
import unBookmarkedSymbol from "./../../Assets/unbookmarked.png";
import closeSymbol from "./../../Assets/close.png";
import shareSymbol from "./../../Assets/share.png";
import axios from "axios";
import "./../Bookmarks/bookmark.modules.css";
const Base_URL = "https://server-swipe.onrender.com";

function Bookmark() {
  const location = useLocation();
  const navigate = useNavigate();
  const loggedInUser = location.state && location.state.loggedInUser;
  const [isStoryCardOpen, setIsStoryCardOpen] = useState(false);
  const [openedSlides, setOpenedSlides] = useState([]);
  const [openedStory, setOpenedStory] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
 // handling story clicks
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

  const handleShareStoryCard = () => {};

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
          if (loggedInUser.bookmarks && loggedInUser.bookmarks.length > 0) {
            setIsStoryCardOpen(false);
            const currentStoryIndex = loggedInUser.bookmarks.findIndex(
              (story) => story._id === openedStory._id
            );
            const nextStoryIndex =
              (currentStoryIndex + 1) % loggedInUser.bookmarks.length;
            const nextStory = loggedInUser.bookmarks[nextStoryIndex];
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
    loggedInUser,
  ]);
  return (
    <>
      <div className="bookmarks-component">
        <div className="bookmarks-title">
          <h1>Your Bookmarks</h1>
        </div>
        <div className="story-block">
          {loggedInUser.bookmarks.length > 0 ? (
            loggedInUser.bookmarks.map((story) => (
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
            ))
          ) : (
            <div className="no-bookmarks-message">Your bookmarked stories will appear here</div>
          )}
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
        </div>
      </div>
    </>
  );
}

export default Bookmark;
