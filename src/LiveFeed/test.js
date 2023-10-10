// ImageDisplay.js
import "./ImageDisplay.css";
import React, { useEffect, useState } from "react";
import ROSLIB from "roslib";
import cross from "./download.png";
import tick from "./tick.png";

import AWS from "aws-sdk";

const ImageDisplay = () => {
  const [imageSrc, setImageSrc] = useState("");
  const [loadingText, setLoadingText] = useState("Loading...");
  const [uploadQueue, setUploadQueue] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const s3 = new AWS.S3({
    accessKeyId: "AKIARWZZ67ATZUF5ROV6",
    secretAccessKey: "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",
  });

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
    }, 1000);

    // subscribe to the ros topic
    topic.subscribe((message) => {
      if (message && message.data) {
        setImageSrc(`data:image/jpg;base64,${message.data}`);
        clearInterval(loadingInterval);
        setIsStreaming(true);
      }
    });
    // callback to clear the topic subscription when not in the page
    return () => {
      topic.unsubscribe();
      clearInterval(loadingInterval);
      setIsStreaming(false);
    };
  }, []);

  // To handle image capture when the user clicks "Upload"
  const handleCaptureImage = () => {
    console.log("Adding image to upload queue", imageSrc);
    if (imageSrc) {
      // Add the current image details to the upload queue
      const imageDetails = {
        dataURL: imageSrc,
        timestamp: Date.now(),
      };
      setUploadQueue((prevQueue) => [...prevQueue, imageDetails]);
    }
  };

  // Function to call upload to s3 function and clear image quque once uploaded
  const handleUploadImages = async () => {
    if (uploadQueue.length === 0 || isUploading) {
      return;
    }

    setIsUploading(true);

    for (const imageDetails of uploadQueue) {
      const { dataURL, timestamp } = imageDetails;
      await uploadImageToS3(dataURL, timestamp);
      // Remove the uploaded image from the queue
      setUploadQueue((prevQueue) =>
        prevQueue.filter((item) => item.timestamp !== timestamp)
      );
    }

    setIsUploading(false);
  };

  // upload image to S3
  const uploadImageToS3 = async (dataURL, timestamp) => {
    const base64 = dataURL.split(",")[1]; // Get the Base64 string, removing the prefix
    const buf = Buffer.from(base64, "base64"); // Create a buffer from the Base64 string

    // Create the S3 parameters
    const data = {
      Bucket: "masterprojectbucket",
      Key: `ReportImages/${timestamp}.jpg`, // set the file name
      Body: buf,
      ContentEncoding: "base64",
      ContentType: "image/jpeg", // set the correct MIME type
    };

    // Upload the image to S3
    s3.putObject(data, (err, data) => {
      if (err) {
        console.log(err);
        console.log("Error uploading data:", data);
      } else {
        console.log("Successfully uploaded the image!");
      }
    });
    console.log(`Uploading image with timestamp ${timestamp} to S3...`);
  };

  useEffect(() => {
    handleUploadImages();
  }, [uploadQueue]);

  return (
    <div className="image-container">
      {
        // !imageSrc ? (
        //   <div className="loading">
        //     <img src={loadingIcon} alt="loading icon" className="loading-icon" />
        //     <span className="loading-text">{loadingText}</span>
        //   </div>
        // ) : (
        <div class="row " style={{ justifyContent: "center" }}>
          <div className="col-sm-2 side-column">
            <div className="statusContainer">
              {/* <span className="side-text block">
                CurrentStamp : {new Date().toLocaleTimeString()}
              </span> */}
              <span className="side-text">
                Status:{" "}
                <span className="side-loading-text">
                  {isStreaming ? "Streaming from ROS" : "Not Streaming"}
                </span>
              </span>
            </div>
            <div className="sideImageContainer">
              <span className="action-sidebar">Actions</span>
              <span className="side-image">
                <img
                  src={cross}
                  className="side-image-image"
                  onClick={() => {
                    handleCaptureImage();
                  }}
                ></img>
                <img src={tick} className="side-image-image"></img>
              </span>
            </div>
          </div>
          <div className=" col-sm image-frame">
            <img src={imageSrc} alt="Loading from ros.." className="image" />
          </div>
        </div>
        // )
      }
    </div>
  );
};

export default ImageDisplay;
