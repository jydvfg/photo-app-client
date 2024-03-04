import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EditProfile from "../components/EditUser";
import { AuthContext } from "../context/auth.context";

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

function UserProfilePage() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [editMode, setEditMode] = useState(false);
  const { userId } = useParams();
  const { isLoggedIn, user } = useContext(AuthContext);
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);

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

  const getLoggedInUser = () => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      axios
        .get(`${backendUrl}/auth/verify`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((response) => {
          setIsLoggedInUser(response.data);
        })
        .catch((error) => {
          console.error("Error verifying authentication:", error);
        });
    } else {
      console.log("User is not authenticated");
    }
  };

  useEffect(() => {
    getUser();
    getLoggedInUser();
  }, [userId]);

  const toggleEditMode = (mode) => {
    setEditMode(mode);
  };

  if (errorMessage) return <div>{errorMessage}</div>;

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <div>
        {userProfile && (
          <>
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
          </>
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
    </div>
  );
}

export default UserProfilePage;
