import { useState, useEffect } from "react";
import axios from "axios";

import SignupPage from "./SignupPage";
import Gallery from "../components/Gallery";
import { AuthContext } from "../context/auth.context";
const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [isLoggedIn]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while verifying authentication
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {isLoggedIn ? <Gallery /> : <SignupPage />}
    </AuthContext.Provider>
  );
}
