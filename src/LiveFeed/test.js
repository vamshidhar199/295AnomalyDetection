// ImageDisplay.js
import "./ImageDisplay.css";
import React, { useEffect, useState } from "react";
import ROSLIB from "roslib";
import cross from "./download.png";
import tick from "./tick.png";
import { Buffer } from "buffer";

import AWS from "aws-sdk";

const ImageDisplay = () => {
  const [imageSrc, setImageSrc] = useState("");
  const [rosTopic, setRosTopic] = useState();
  const [loadingText, setLoadingText] = useState("Loading...");
  const [uploadQueue, setUploadQueue] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const s3 = new AWS.S3({
    accessKeyId: "AKIARWZZ67ATZUF5ROV6",
    secretAccessKey: "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",
  });

  // Start of use effect
  useEffect(() => {
    const ros = new ROSLIB.Ros({
      url: "ws://10.0.0.243:9090",
    });

    // Define ros topic to be commected
    const topic = new ROSLIB.Topic({
      ros: ros,
      name: "/yolov8_custom_image", //"/yolov5_compressed_image",
      messageType: "yolo_custom_topic/CustomMsg", //"sensor_msgs/CompressedImage",
    });

    // This is for loading
    const loadingTexts = ["Loading...", "Initializing...", "Hold On..."];
    let currentTextIndex = 0;
    const loadingInterval = setInterval(() => {
      currentTextIndex = (currentTextIndex + 1) % loadingTexts.length;
      setLoadingText(loadingTexts[currentTextIndex]);
    }, 1000);

    // subscribe to the ros topic
    topic.subscribe((message) => {
      // console.log(message);
      if (message && message.processed_image.data) {
        setRosTopic(message);
        setImageSrc(`data:image/jpg;base64,${message.processed_image.data}`);
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
  }, []); //useeffect end

  // To handle image capture when the user clicks "Upload"
  const handleCaptureImage = (rosTopicToUpload) => {
    console.log("Adding topic to upload queue", rosTopicToUpload);

    if (rosTopicToUpload) {
      // Add the current image details to the upload queue
      const imageDetails = {
        processedImageDataURL: rosTopicToUpload.processed_image.data,
        rawImageDataURL: rosTopicToUpload.raw_image.data,
        annotationText: rosTopicToUpload.detections,
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
    console.log("Uploading data to S3", isUploading);

    for (const imageDetails of uploadQueue) {
      const {
        processedImageDataURL,
        rawImageDataURL,
        annotationText,
        timestamp,
      } = imageDetails;
      // Uploading processed image with annotation drawn on it
      await uploadImageToS3(
        processedImageDataURL,
        timestamp,
        "ReportedProcessedImages",
        "Image",
        ""
      );
      // Uploading raw image with no annotations
      await uploadImageToS3(
        rawImageDataURL,
        timestamp,
        "ReportedRawImages",
        "Image",
        ""
      );
      await uploadImageToS3(
        annotationText,
        timestamp,
        "ReportedAnnotations",
        "Text",
        annotationText
      );

      // Remove the uploaded image from the queue
      setUploadQueue((prevQueue) =>
        prevQueue.filter((item) => item.timestamp !== timestamp)
      );
    }

    setIsUploading(false);
  };

  // Since Buffer is not present in react js defining custom function
  const convertBase64 = (base64) => {
    var binaryString = atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  // upload image to S3
  const uploadImageToS3 = async (
    dataURL,
    timestamp,
    directory,
    type,
    annotationText
  ) => {
    const buf = type == "Image" ? convertBase64(dataURL) : "";

    // Create the S3 parameters
    const data =
      type == "Image"
        ? {
            Bucket: "masterprojectbucket",
            Key: `${directory}/image_${timestamp}.jpg`, // set the file name ReportImages
            Body: buf,
            ContentEncoding: "base64",
            ContentType: "image/jpeg", // set the correct MIME type
          }
        : {
            Bucket: "masterprojectbucket",
            Key: `${directory}/image_${timestamp}.txt`, // set the file name ReportImages
            Body: annotationText,
            ContentType: "text/plain", // set the correct MIME type
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
                    handleCaptureImage(rosTopic);
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
