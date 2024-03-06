import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EditProfile from "../components/EditUser";
import { AuthContext } from "../context/auth.context";
import UserPosts from "../components/UserPosts";
import SavedPosts from "../components/SavedPosts";
import { Navigate } from "react-router-dom";

function UserProfilePage() {
  const { userId } = useParams();
  const { isLoggedIn, user } = useContext(AuthContext);
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [idNum, setIdNum] = useState(null);
  const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

  useEffect(() => {
    const getLoggedInUser = () => {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        axios
          .get(`${backendUrl}/auth/verify`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          })
          .then((response) => {
            setIsLoggedInUser(response.data);
            setIdNum(response.data._id);
          })
          .catch((error) => {
            console.error("Error verifying authentication:", error);
          });
      } else {
        console.log("User is not authenticated");
      }
    };

    getLoggedInUser();
  }, []);

  useEffect(() => {
    const getUser = () => {
      const storedToken = localStorage.getItem("authToken");

      if (storedToken) {
        axios
          .get(`${backendUrl}/users/${userId}`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          })
          .then((response) => {
            setUserProfile(response.data);
            setLoading(false);
          })
          .catch((error) => {
            console.log("error while fetching user =>", error);
            const errorDescription = error.response.data.message;
            setErrorMessage(errorDescription);
          });
      } else {
        setErrorMessage("User not logged in");
      }
    };

    getUser();
  }, [userId]);

  const toggleEditMode = (mode) => {
    setEditMode(mode);
  };

  if (errorMessage) return <div>{errorMessage}</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div className="content">
      <div className="user-page">
        <div>
          <img
            src={userProfile.image}
            alt="profile-photo"
            className="profile-pic"
          />
          <h1 className="profile-name">{userProfile.name}</h1>
          <h2>{userProfile.username}</h2>
          <p>{userProfile.about}</p>

          {userProfile.isPublic && (
            <div className="profile-email">
              <p>
                <strong>Email:</strong> {userProfile.email}
              </p>
            </div>
          )}
        </div>
        <div>
          {isLoggedIn && isLoggedInUser.username === userId ? (
            editMode ? (
              <EditProfile toggleEditMode={toggleEditMode} />
            ) : (
              <button onClick={() => toggleEditMode(true)}>Edit Profile</button>
            )
          ) : null}
        </div>
        {isLoggedIn && isLoggedInUser.username === userId && (
          <>
            <UserPosts idNum={idNum} />
            <SavedPosts userId={userId} />
          </>
        )}
      </div>
    </div>
  );
}

export default UserProfilePage;
