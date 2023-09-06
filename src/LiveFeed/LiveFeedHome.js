import React, { useState, useEffect } from "react";
import "./LiveFeedHome.css";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: "AKIARWZZ67ATZUF5ROV6",
  secretAccessKey: "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",
});
const S3_BUCKET_NAME = "masterprojectbucket";
const S3_DIRECTORY = "ReportImages/";

const LiveFeedHome = () => {
  const [totalImagesAnnotated, setTotalImagesAnnotated] = useState(0);
  const [totalScanned, setTotalScanned] = useState(0);
  const [imageURL, setImageURL] = useState("");
  const [latestImageTimeStamp, setLatestImageTimeStamp] = useState(1693532352);
  const [lastLoadedImage, setLastLoadedImage] = useState(
    `image_${latestImageTimeStamp}.jpg`
  );

  let latestImageTimeStampInt = 1693532882;

  // Simulated data fetching and image refreshing
  useEffect(() => {
    // Simulate fetching data and updating the state
    const fetchData = () => {
      // Fetch and update totalImagesAnnotated and totalScanned data here
      setTotalImagesAnnotated(/* your totalImagesAnnotated value */);
      setTotalScanned(/* your totalScanned value */);
    };

    // Simulate fetching image URL
    const fetchImage = () => {
      // Fetch image URL from S3 bucket or your source
      setImageURL(
        `https://masterprojectbucket.s3.amazonaws.com/ReportImages/image_${latestImageTimeStampInt}.jpg`
      );
      latestImageTimeStampInt++;
    };

    // async function findImageWithTimestamp() {
    //   const currentTimestamp = `image_${Math.floor(
    //     (Date.now() - 50000) / 1000
    //   ).toString()}.jpg`;

    //   let continuationToken = null;
    //   let imageFound = false;

    //   while (!imageFound) {
    //     const params = {
    //       Bucket: S3_BUCKET_NAME,
    //       Prefix: S3_DIRECTORY,
    //       ContinuationToken: continuationToken,
    //     };

    //     try {
    //       const response = await s3.listObjectsV2(params).promise();
    //       const matchingObject = response.Contents.find((obj) =>
    //         obj.Key.includes(currentTimestamp)
    //       );

    //       if (matchingObject) {
    //         console.log("Found Image:", matchingObject.Key);
    //         imageFound = true;
    //         setLastLoadedImage(currentTimestamp);
    //       }

    //       if (response.IsTruncated) {
    //         continuationToken = response.NextContinuationToken;
    //       } else {
    //         break; // No more objects to retrieve
    //       }
    //     } catch (error) {
    //       console.error("Error listing objects:", error);
    //       break;
    //     }
    //   }

    //   if (!imageFound) {
    //     console.log("Image not found.");
    //   }
    // }

    // const fetchLatestImage = async () => {
    //   s3.getObject(
    //     {
    //       Bucket: "masterprojectbucket",
    //       Key: `ReportImages/image_${latestImageTimeStampInt}.jpg`,
    //     },
    //     (err, data) => {
    //       if (err) {
    //         console.log(err, err.stack);
    //       } else {
    //         let imageUrl = URL.createObjectURL(new Blob([data.Body]));
    //         console.log(imageUrl);
    //         console.log(latestImageTimeStampInt);
    //         latestImageTimeStampInt++;
    //         setImageURL(imageUrl);
    //         // setLatestImageTimeStamp(latestImageTimeStamp + 1);
    //         // setLastLoadedImage(`image_${latestImageTimeStamp}.jpg`);
    //       }
    //     }
    //   );
    // };

    fetchData();
    // findImageWithTimestamp();
    fetchImage();

    // Refresh image every 1000ms
    const interval = setInterval(fetchImage, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="two-column-container">
      <div className="left-column">
        <div>Total Images Annotated: {totalImagesAnnotated}</div>
        <div>Total Scanned: {totalScanned}</div>
      </div>
      <div className="right-column">
        {imageURL && (
          <img src={imageURL} alt="S3 Bucket Image" width={"600px"} />
        )}
      </div>
    </div>
  );
};

export default LiveFeedHome;
