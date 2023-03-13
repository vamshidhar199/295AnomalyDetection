import React, { Component } from "react";
import { Outlet, Link } from "react-router-dom";
import "./Nav.css";
function Nav(props) {
  const change = (name) => {
    console.log(name);
  };

  return (
    <div className="container-fluid">
      <nav class="navbar navbar-expand-lg navbar-light bg-light navBackground">
        <a class="navbar-brand" href="#" style={{ color: "white" }}>
          <Link
            class="nav-link"
            to={
              JSON.parse(localStorage.getItem("auth")) &&
              JSON.parse(localStorage.getItem("auth")).employees[0].userRole ==
                "airline"
                ? "/AirlineEmp"
                : JSON.parse(localStorage.getItem("auth")) &&
                  JSON.parse(localStorage.getItem("auth")).employees[0]
                    .userRole == "airport"
                ? "/AirportEmp"
                : ""
            }
            style={{ color: "white" }}
          >
            SFJC Airport
          </Link>
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul
            class="navbar-nav mr-auto nav-tabs nav"
            style={{ border: "none", color: "white" }}
          >
            <li class="nav-item ">
              <Link
                style={{ color: "white" }}
                onClick={() => {
                  props.change("Home");
                }}
                class="nav-link"
                to="/"
              >
                Home
              </Link>{" "}
            </li>
            <li class="nav-item" style={{ border: "none", color: "white" }}>
              {/* <Link  onClick={() => {
                    this.props.change("Flight");
                  }} class="nav-link" to="/Flight">
                    <li>Flights</li>
                  </Link> */}
              <li class="nav-link" style={{ color: "white" }}>
                Flights
                <ul
                  style={{
                    backgroundColor: "#5597c8",
                    marginTop: "10px",
                    marginBottom: "-10px",
                    color: "white",
                  }}
                >
                  {/* <li>  */}
                  <Link
                    onClick={() => {
                      props.change("Flight");
                    }}
                    class="nav-link"
                    to="/Flight"
                    style={{ color: "white" }}
                  >
                    <li class="sub-menu" style={{ color: "white" }}>
                      Status
                    </li>
                  </Link>

                  {/* <Link
                      onClick={() => {
                        props.change("Flight");
                      }}
                      class="nav-link"
                      to="/FlightSchedules"
                      style={{color:"white"}}
                    >
                      <li class="sub-menu" style={{color:"white"}}> Schedules</li>
                    </Link> */}
                  {/* <Link
                      onClick={() => {
                        this.props.change("Flight");
                      }}
                      class="nav-link"
                      to="/AirlinesAtSffo"
                    >
                      <li class="sub-menu">Airlines</li>
                    </Link> */}
                </ul>
              </li>
            </li>
            <li class="nav-item dropdown"></li>

            {/* <li class="nav-item">
                <a class="nav-link disabled" href="#">
                  Disabled
                </a>
              </li> */}
          </ul>
        </div>
        {/* <button
            class="btn my-2 my-sm-0 hoverButton"
            type="submit"
            onClick={() => {
              this.props.change("LogIn");
            }}
          > */}
        <ul
          class="navbar-nav mr-auto nav-tabs nav"
          style={{ border: "none", color: "white" }}
        >
          <li class="nav-item" id={localStorage.getItem("auth")}>
            <Link
              onClick={() => {
                if (
                  JSON.parse(localStorage.getItem("auth")).employees[0].isLogged
                ) {
                  localStorage.removeItem("auth");
                  props.changeLogged(false);
                }
                props.change("LogIn");
              }}
              class="nav-link navButton"
              to="/LogIn"
              style={{ color: "white" }}
            >
              {props.logged || localStorage.getItem("auth")
                ? "Log Out"
                : "Log In"}
            </Link>
          </li>
        </ul>
        {/* </button> */}
      </nav>
    </div>
  );
}

export default Nav;
