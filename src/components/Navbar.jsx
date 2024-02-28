import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <button>Home</button>
      <button>Profile</button>
      <Link to="/login">Login</Link>
    </nav>
  );
}

export default Navbar;
