// ImageDisplay.js
import "./ImageDisplay.css";
import React, { useEffect, useState } from "react";
import ROSLIB from "roslib";
import loadingIcon from "./loading-carga.gif";

const ImageDisplay = () => {
  const [imageSrc, setImageSrc] = useState("");
  const [loadingText, setLoadingText] = useState("Loading...");

  useEffect(() => {
    const ros = new ROSLIB.Ros({
      url: "ws://10.0.0.243:9090",
    });

    const topic = new ROSLIB.Topic({
      ros: ros,
      name: "/yolov5_compressed_image",
      messageType: "sensor_msgs/CompressedImage",
    });

    // Setting loading texts sequentially
    const loadingTexts = ["Loading...", "Initializing...", "Hold On..."];
    let currentTextIndex = 0;
    const loadingInterval = setInterval(() => {
      currentTextIndex = (currentTextIndex + 1) % loadingTexts.length;
      setLoadingText(loadingTexts[currentTextIndex]);
    }, 1000); // Change text every 2 seconds

    topic.subscribe((message) => {
      if (message && message.data) {
        setImageSrc(`data:image/jpg;base64,${message.data}`);
        clearInterval(loadingInterval); // Clear the interval once the image is loaded
      }
    });

    return () => {
      topic.unsubscribe();
      clearInterval(loadingInterval); // Clear interval on component unmount
    };
  }, []);

  return (
    <div className="image-container">
      {!imageSrc ? (
        <div className="loading">
          <img src={loadingIcon} alt="loading icon" className="loading-icon" />
          <span className="loading-text">{loadingText}</span>
        </div>
      ) : (
        <div class="row " style={{ justifyContent: "center" }}>
          <div className="col-sm-2">
            <div>
              <span className="side-text block">
                CurrentStamp : {new Date().toLocaleTimeString()}
              </span>
              <span className="side-text">
                Status:{" "}
                <span className="side-loading-text">Streaming from ROS</span>
              </span>
            </div>
          </div>
          <div className=" col-sm image-frame">
            <img src={imageSrc} alt="From ROS" className="image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;
