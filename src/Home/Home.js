import React, { useEffect, useState } from "react";
import "./Home.css";
import BarChartComponent from "./Charts/BarChartComponent";
import { Card, CardContent, Typography } from "@mui/material";
import AWS from "aws-sdk";
import Button from "@mui/material/Button";

const Home = (props) => {
  const [modelList, setModelList] = useState([]);
  const [modelName, setModelName] = useState();
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const s3 = new AWS.S3({
    accessKeyId: "AKIARWZZ67ATZUF5ROV6",
    secretAccessKey: "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",
  });
  const params = {
    Bucket: "masterprojectbucket",
    Prefix: "Model/",
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    async function fetchImages() {
      const data = await s3.listObjectsV2(params).promise();
      const objects = data.Contents.filter((object) => {
        return object.Key !== "Model/";
      });
      console.log(data.Contents);
      setModelList(data.Contents);
    }
    fetchImages();
    return () => clearInterval(intervalId);
  }, []);

  const detectedImagesCount = 150; // Dummy number
  const userReportedImagesCount = 120; // Dummy number
  const chartData = [
    {
      name: "Detected vs Reported",
      detected: detectedImagesCount,
      reported: userReportedImagesCount,
    },
  ];
  return (
    <div className="dashboard">
      <h2>Monitoring Dashboard</h2>
      <div className="infoSection">
        <Card
          sx={{
            // background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
            borderRadius: 3,
            boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
            // color: "white",
            padding: "0 30px",
            minHeight: 80,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <CardContent>
            <Typography variant="h5" component="div">
              Monitored Images with Defects:
            </Typography>
            <Typography variant="body1" color="white">
              30
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            // background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
            borderRadius: 3,
            boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
            // color: "white",
            padding: "0 30px",
            minHeight: 80,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <CardContent>
            <Typography variant="h5" component="div">
              Images Annotated:
            </Typography>
            <Typography variant="body2">50</Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            // background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
            borderRadius: 3,
            boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
            // color: "white",
            padding: "0 30px",
            minHeight: 80,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <CardContent>
            <Typography variant="h5" component="div">
              Current Time:
            </Typography>
            <Typography variant="body2">{currentTime}</Typography>
          </CardContent>
        </Card>
      </div>
      <div className="infoSection">
        <Card
          sx={{
            // background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
            borderRadius: 3,
            boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
            // color: "white",
            padding: "0 30px",
            minHeight: 120,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <CardContent>
            <Typography variant="h5" component="div">
              Error Status:
            </Typography>
            <Typography variant="body2">None</Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            // background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
            borderRadius: 3,
            boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
            // color: "white",
            padding: "0 30px",
            minHeight: 120,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <CardContent>
            <Typography variant="h5" component="div">
              Stream Status:
            </Typography>
            <Typography variant="body2">{props.streamStatus}</Typography>
          </CardContent>
        </Card>
        {/* <div className="tile">
          <p>: {currentTime}</p>
        </div> */}
      </div>
      <div className="graphSection">
        <div className="graphSection">
          <h3>Graphs</h3>
          <BarChartComponent data={chartData} />
          {/* Insert more graph components here if needed */}
        </div>
        {/* Insert your actual graph components here */}
      </div>
      <div className="graphSection" style={{ padding: "20px" }}>
        <label htmlFor="bucket-select">Choose a model:</label>
        <select
          id="bucket-select"
          style={{ marginBottom: "20px" }}
          onChange={(event) => setModelName(event.target.value)}
        >
          {modelList.map((bucket) => (
            <option key={bucket.Key} value={bucket.Key}>
              {bucket.Key}
            </option>
          ))}
        </select>
        <Button variant="contained">Submit</Button>
      </div>
    </div>
  );
};

export default Home;
