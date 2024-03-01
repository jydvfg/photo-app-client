import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import axios from "axios";
const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { logOutUser } = useContext(AuthContext);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const storedToken = localStorage.getItem("authToken");
        const response = await axios.get(`${backendUrl}/auth/verify`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (response.data.email) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };
    checkAuthentication();
  }, [isLoggedIn]);
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <nav className="navbar">
        <Link to="/">
          <button className="button">Home</button>
        </Link>
        <Link to="/profile">
          <button className="button">Profile</button>
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
      </nav>
    </AuthContext.Provider>
  );
}

export default Navbar;
