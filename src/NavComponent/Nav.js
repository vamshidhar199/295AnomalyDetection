import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import "./Nav.css";

const Nav = () => {
  const [selectedPage, setSelectedPage] = useState("");
  const handleLinkClick = (link) => {
    setSelectedPage(link);
  };

  return (
    <div>
      <div className="navbar">
        <ul className="nav-menu">
          <li className="nav-item">
            <Link
              to="/"
              className={
                selectedPage == "/" ? "activeClass nav-links" : "nav-links"
              }
              onClick={() => handleLinkClick("/")}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/Live"
              className={
                selectedPage == "/Live" ? "activeClass nav-links" : "nav-links"
              }
              onClick={() => handleLinkClick("/Live")}
            >
              Live Feed
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/ImageList"
              className={
                selectedPage == "/ImageList"
                  ? "activeClass nav-links"
                  : "nav-links"
              }
              onClick={() => handleLinkClick("/ImageList")}
            >
              Images
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default Nav;
