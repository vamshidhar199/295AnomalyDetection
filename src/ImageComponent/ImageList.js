import React, { useState, useEffect } from "react";
import "./ImageList.css";
import AWS from "aws-sdk";
import axios from "axios";
import loadingIcon from "./../LiveFeed/loading-carga.gif";

const loadYoloAnnotations = (imageName) => {
  // Replace with the correct URL to your YOLO annotation file
  // const annotationUrl = `http://localhost:YOUR_PORT/annotations/${imageName.replace(
  //   ".jpg",
  //   ".txt"
  // )}`;

  const annotationUrl = `https://masterprojectbucket.s3.amazonaws.com/ReportAnnotation/img023621.txt`;
  let parsedAnnotation;
  axios.get(annotationUrl).then((response) => {
    console.log(response.data);
    parsedAnnotation = response.data
      .trim()
      .split("\n")
      .map((line) => {
        const [classId, x_center, y_center, width, height] = line.split(" ");
        return {
          classId,
          x_center,
          y_center,
          width,
          height,
        };
      });
  });

  return parsedAnnotation;
};

const ImageList = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedList, setSelectedList] = useState();
  const [images1, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");

  const loadingTexts = ["Loading...", "Initializing...", "Hold On..."];
  let currentTextIndex = 0;
  const loadingInterval = setInterval(() => {
    currentTextIndex = (currentTextIndex + 1) % loadingTexts.length;
    setLoadingText(loadingTexts[currentTextIndex]);
  }, 1000); // Change text every 2 seconds

  const s3 = new AWS.S3({
    accessKeyId: "AKIARWZZ67ATZUF5ROV6",
    secretAccessKey: "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",
  });
  const params = {
    Bucket: "masterprojectbucket",
    Prefix: "ReportedProcessedImages/",
  };

  useEffect(() => {
    async function fetchImages() {
      const data = await s3.listObjectsV2(params).promise();
      const objects = data.Contents.filter((object) => {
        return object.Key !== "ReportedProcessedImages/";
      });
      console.log(data.Contents);
      setImages(objects);
    }

    fetchImages();
  }, []);

  // Function to render bounding boxes on the second image
  const renderAnnotations = (imageJson) => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // Load the selected image onto the canvas
    const img = new Image();
    img.src = imageJson.url;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const annotationUrl = `https://masterprojectbucket.s3.amazonaws.com/ReportAnnotation/img003706.txt`;
      let yoloAnnotations;
      axios.get(annotationUrl).then((response) => {
        console.log(response.data);
        yoloAnnotations = response.data
          .trim()
          .split("\n")
          .map((line) => {
            const [classId, x_center, y_center, width, height] =
              line.split(" ");
            return {
              classId,
              x_center,
              y_center,
              width,
              height,
            };
          });
        for (const annotation of yoloAnnotations) {
          const x = annotation.x_center * canvas.width;
          const y = annotation.y_center * canvas.height;
          const width = annotation.width * canvas.width;
          const height = annotation.height * canvas.height;
          ctx.strokeStyle = "red"; // Customize the bounding box color
          ctx.lineWidth = 2; // Customize the bounding box line width
          ctx.strokeRect(x - width / 2, y - height / 2, width, height);

          ctx.fillStyle = "red"; // Customize the label text color
          ctx.font = "16px Arial"; // Customize the label font
          ctx.fillText(annotation.classId, x - width / 2, y - height / 2 - 5); // Adjust label position
        }
      });
      // Draw bounding boxes and labels
    };
  };

  const getImage = (imageName) => {
    // const imageName = "YOUR_IMAGE_NAME.jpg"; // Replace with the name of your image file

    s3.getObject(
      {
        Bucket: "masterprojectbucket",
        Key: `ReportedProcessedImages/${imageName}`,
      },
      (err, data) => {
        if (err) {
          setShowLoading(false);
          console.log(err, err.stack);
        } else {
          const imageUrl = URL.createObjectURL(new Blob([data.Body]));
          setImageUrl(imageUrl);
          const imageJson = {
            name: imageName,

            url: imageUrl,
          };
          console.log(imageJson);
          setSelectedImage(imageJson);
          renderAnnotations(imageJson);
        }
      }
    );
  };
  const handleImageClick = (image, index) => {
    setShowLoading(true);
    setSelectedList(index);
    getImage(image);
    setShowLoading(false);
  };

  const handleReport = async (image, type) => {
    if (type == "annotate") {
      const url = `http://localhost:8501/?image=${image}`;
      window.open(url, "_blank").focus();
    } else {
      const url = `http://localhost:5000/labeller?image_id=${image}`;
      window.open(url, "_blank").focus();
    }
  };
  return (
    <div className="image-list-container">
      <div className="image-list">
        <h2>Image List</h2>
        <ul>
          {images1.map((image, index) => (
            <li
              key={index}
              className={
                selectedList == index ? "active listClass" : "listClass"
              }
            >
              <div
                className="image-name"
                onClick={() =>
                  handleImageClick(
                    image.Key.replace("ReportedProcessedImages/", ""),
                    index
                  )
                }
              >
                {image.Key.replace("ReportedProcessedImages/", "")}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="selected-image">
        {showLoading && (
          <div className="loading">
            <span className="loading-text">{loadingText}</span>
          </div>
        )}

        <h3>{selectedImage ? selectedImage.name : "Please select an Image"}</h3>
        <div className="image-wrapper">
          <canvas id="canvas" width="100px"></canvas>
        </div>
        <div className="reportDiv">
          <div className="additionalButtons">
            <button
              className="reportButton1"
              onClick={() => handleReport(selectedImage.name, "annotate")}
            >
              Report For Annotation
            </button>
            <button
              className="reportButton1"
              onClick={() => handleReport(selectedImage.name, "segmentation")}
            >
              Report For Segmentation
            </button>
          </div>
          <button
            className="reportButton"
            // onClick={() => handleReport(selectedImage.name)}
          >
            {selectedImage ? "Report" : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageList;
