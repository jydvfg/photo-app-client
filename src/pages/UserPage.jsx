import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

function UserProfilePage() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const getUser = () => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      axios
        .get(`${backendUrl}/users/${user._id}`, {
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
  useEffect(() => {
    setTimeout(() => {
      getUser();
    }, 1000);
  }, [user]);

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
    </div>
  );
}

export default UserProfilePage;
