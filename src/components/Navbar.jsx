import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import axios from "axios";

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

function Navbar({ showPostForm, togglePostForm }) {
  const { isLoggedIn, logOutUser, user } = useContext(AuthContext);
  const [userObject, setUserObject] = useState(null);

  useEffect(() => {
    if (isLoggedIn && user) {
      const storedToken = localStorage.getItem("authToken");

      if (storedToken) {
        axios
          .get(`${backendUrl}/users/${user.username}`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          })
          .then((response) => {
            setUserObject(response.data);
          })
          .catch((error) => {
            console.log("error while fetching user =>", error);
          });
      }
    }
  }, [isLoggedIn, user]);

  return (
    <nav className="navbar">
      <Link to="/">
        <button className="button">Home</button>
      </Link>
      {isLoggedIn ? (
        <button className="button" onClick={logOutUser}>
          Logout
        </button>
      ) : (
        <Link to="/login">
          <button className="button">Login</button>
        </Link>
      )}
      <button className="button" onClick={togglePostForm}>
        {showPostForm ? "-" : "+"}
      </button>
      {isLoggedIn && userObject && (
        <div className="navbar-profile-image">
          <Link to={`/users/${user.username}`}>
            {userObject.image && <img src={userObject.image} alt="User" />}
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
