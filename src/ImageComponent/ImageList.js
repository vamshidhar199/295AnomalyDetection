import React, { useState } from "react";
import "./ImageList.css";
import axios from "axios";
import { createWriteStream } from "streamsaver";
import { saveAs } from "file-saver";
const ImageList = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedList, setSelectedList] = useState();
  const images = [
    {
      name: "Image 1",
      url: "https://dummyimage.com/300x300/000/fff&text=Image+1",
    },
    {
      name: "Image 2",
      url: "https://dummyimage.com/300x300/000/fff&text=Image+2",
    },
    {
      name: "Image 3",
      url: "https://dummyimage.com/300x300/000/fff&text=Image+3",
    },
    {
      name: "Image 4",
      url: "https://dummyimage.com/300x300/000/fff&text=Image+4",
    },
    {
      name: "Image 5",
      url: "https://dummyimage.com/300x300/000/fff&text=Image+5",
    },
  ];

  const handleImageClick = (image, index) => {
    setSelectedList(index);
    setSelectedImage(image);
  };

  const handleReport = async (image) => {
    const url = `http://localhost:8501/?image=${image}.jpg`;
    window.open(url, "_blank").focus();
  };
  return (
    <div className="image-list-container">
      <div className="image-list">
        <h2>Image List</h2>
        <ul>
          {images.map((image, index) => (
            <li key={index} className={selectedList == index ? "active" : ""}>
              <div
                className="image-name"
                onClick={() => handleImageClick(image, index)}
              >
                {image.name}
              </div>
            </li>
          ))}
        </ul>
      </div>
      {selectedImage && (
        <div className="selected-image">
          <h3>{selectedImage.name}</h3>
          <div className="image-wrapper">
            <img src={selectedImage.url} alt={selectedImage.name} />
            <img src={selectedImage.url} alt={selectedImage.name} />
          </div>
          <div className="reportDiv">
            <button
              className="reportButton"
              onClick={() => handleReport(selectedImage.name)}
            >
              Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageList;
