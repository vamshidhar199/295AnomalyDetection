import React, { useState, useEffect } from "react";
import axios from "axios";
import loadingIcon from "./../LiveFeed/loading-carga.gif";
import "./SegmentAuto.css";
const SegmentAuto = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("URL:", url);
    console.log("Prompt:", prompt);
    // Axios call
  };

  return (
    <div className="container">
      {showLoading ? (
        <div className="loading">
          <img src={loadingIcon}></img>
          <span className="loading-text">Loading...</span>
        </div>
      ) : (
        <div>
          <form onSubmit={handleSubmit} className="form">
            <h1 style={{ textAlign: "center" }}>Enter Prompt</h1>
            <label htmlFor="url" className="label">
              URL:
              <input
                type="text"
                id="url"
                name="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="input"
              />
            </label>
            <label htmlFor="prompt">
              Prompt:
              <input
                type="text"
                id="prompt"
                name="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="input"
              />
            </label>
            <button type="submit" className="button">
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SegmentAuto;
