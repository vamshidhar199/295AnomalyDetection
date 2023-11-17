import logo from "./logo.svg";
import "./App.css";
import ImageList from "./ImageComponent/ImageList";
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import Nav from "./NavComponent/Nav";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ImageDisplay from "./LiveFeed/test";
import Home from "./Home/Home";
import SegmentAuto from "./SegmentAuto/SegmentAuto";
import { useState } from "react";
import AutoTrain from "./AutoTrain/AutoTrain";
function App() {
  const [trainingStatus, setTrainingStatus] = useState("Idle");
  const [streamStatus, setStreamStatus] = useState("Not Running");

  const setStream = (value) => {
    setStreamStatus(value);
  };
  return (
    <div className="App">
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/ImageList" element={<ImageList />}>
            <Route index element={<ImageList />} />
          </Route>
          <Route path="/Live" element={<ImageDisplay setStream={setStream} />}>
            <Route index element={<ImageDisplay setStream={setStream} />} />
          </Route>
          <Route path="/AutoSegment" element={<SegmentAuto />}>
            <Route index element={<SegmentAuto />} />
          </Route>
          <Route
            path="/AutoTrain"
            element={<AutoTrain trainingStatus={trainingStatus} />}
          >
            <Route
              index
              element={<AutoTrain trainingStatus={trainingStatus} />}
            />
          </Route>
          <Route
            path="/"
            element={<Home streamStatus={streamStatus} setStream={setStream} />}
          >
            <Route
              index
              element={
                <Home streamStatus={streamStatus} setStream={setStream} />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
