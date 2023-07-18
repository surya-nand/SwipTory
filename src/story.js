import React, { useState } from "react";
import axios from "axios";


const StoryForm = ({ onSave }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
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
        likesCount: 3245,
      };

      const category ={
        category : slides[0].slide_category,
      }

      const response = await axios.post(
        "http://localhost:5000/api/stories",
        story
      );

      await axios.post("http://localhost:5000/api/categories",category)
      console.log(response.data); // Optionally, handle the response

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
      setIsFormOpen(false);
    } catch (error) {
      console.error(error);
      // Handle error state or display an error message to the user
    }
  };

  return (
    <div>
      {!isFormOpen && (
        <button onClick={() => setIsFormOpen(true)}>Add Story</button>
      )}
      {isFormOpen && (
        <form onSubmit={handleSubmit}>
          <div>
            {slides.map((_, index) => (
              <button key={index} onClick={(e) => handleSlideButtonClick(e,index)}>
                Slide {index + 1}
              </button>
            ))}
            {slides.length < 6 && (
              <button type="button" onClick={handleAddSlide}>
                Add Slide
              </button>
            )}
          </div>
          <div>
            <div>
              <input
                type="text"
                required
                placeholder="Slide Heading"
                value={slides[currentSlideIndex].slide_heading}
                onChange={(e) =>
                  handleInputChange(
                    currentSlideIndex,
                    "slide_heading",
                    e.target.value
                  )
                }
              />
              <input
                type="text"
                required
                placeholder="Slide Description"
                value={slides[currentSlideIndex].slide_description}
                onChange={(e) =>
                  handleInputChange(
                    currentSlideIndex,
                    "slide_description",
                    e.target.value
                  )
                }
              />
              <input
                type="text"
                required
                placeholder="Slide Image URL"
                value={slides[currentSlideIndex].slide_imageurl}
                onChange={(e) =>
                  handleInputChange(
                    currentSlideIndex,
                    "slide_imageurl",
                    e.target.value
                  )
                }
              />
              <select
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
                <option value="Health and Fitness">Health and Fitness</option>
                <option value="Travel">Travel</option>
                <option value="Movie">Movie</option>
                <option value="Education">Education</option>
              </select>
            </div>
          </div>
          <div>
            {currentSlideIndex > 0 && (
              <button type="button" onClick={handlePreviousSlide}>
                Previous
              </button>
            )}
            {currentSlideIndex < slides.length - 1 && (
              <button type="button" onClick={handleNextSlide}>
                Next
              </button>
            )}
          </div>
          <div>
            {slides.length >= 3 && <button type="submit">Save Story</button>}
          </div>
        </form>
      )}
    </div>
  );
};

export default StoryForm;
