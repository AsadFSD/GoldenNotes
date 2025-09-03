import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        GoldenNotes
      </Link>

      <ul className="nav-links">
        {currentPath !== "/" && (
          <li>
            <Link to="/">Home</Link>
          </li>
        )}
        {currentPath !== "/notes" && (
          <li>
            <Link to="/notes">Notes</Link>
          </li>
        )}
        {currentPath !== "/about" && (
          <li>
            <Link to="/about">About</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
