import React, { useEffect, useState } from "react";
import "./Home.css";
import BarChartComponent from "./Charts/BarChartComponent";

const Home = () => {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

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
        <div className="tile">
          <p>Monitored Images with Defects: 30</p>
        </div>
        <div className="tile">
          <p>Images Annotated: 50</p>
        </div>
        <div className="tile">
          <p>Current Time: {currentTime}</p>
        </div>
      </div>
      <div className="infoSection">
        <div className="tile">
          <p>Errors: None</p>
        </div>
        <div className="tile">
          <p>Stream Status: Running</p>
        </div>
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
        <div className="graph">
          <p>User Reported Images: {userReportedImagesCount}</p>
        </div>
        {/* Insert your actual graph components here */}
      </div>
    </div>
  );
};

export default Home;
