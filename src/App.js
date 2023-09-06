import logo from "./logo.svg";
import "./App.css";
import ImageList from "./ImageComponent/ImageList";
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import Nav from "./NavComponent/Nav";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LiveFeedHome from "./LiveFeed/LiveFeedHome";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/ImageList" element={<ImageList />}>
            <Route index element={<ImageList />} />
          </Route>
          <Route path="/Live" element={<LiveFeedHome />}>
            <Route index element={<LiveFeedHome />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
