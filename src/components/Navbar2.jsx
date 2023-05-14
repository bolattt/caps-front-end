import React from "react";
import { Link } from "react-router-dom";
function Navbar2() {
  return (
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-5">
      <div class="container">
        <Link class="navbar-brand" href="/index">
          HAPP'N
          <img className="logo" src="location2.png" alt="location pin logo" />
        </Link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" href="#">
                Home
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#!">
                About
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#!">
                Contact
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">
                Blog
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar2;
