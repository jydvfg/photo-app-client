import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const EditProfile = ({ toggleEditMode }) => {
  const { userId } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    about: "",
    profileImage: null,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formView, setFormView] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setAuthenticated(true);
      getUserDetails(userId);
    }
  }, [userId]);

  const getUserDetails = async (userId) => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const response = await axios.get(`${backendUrl}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      const user = response.data;
      setFormData({
        name: user.name,
        about: user.about,
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError("Failed to fetch user details");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        setError("Authentication token not found");
        return;
      }
      const res = await axios.get(`${backendUrl}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      const user = res.data;

      const response = await axios.put(
        `${backendUrl}/users/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      console.log("User details updated:", response.data);
    } catch (error) {
      console.error("Error updating user details:", error);
      toggleEditMode(false);
      setError("Failed to update user details");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        setError("Authentication token not found");
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setError("New password and confirm password do not match");
        return;
      }

      const response = await axios.put(
        `${backendUrl}/auth/users/${userId}/password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      console.log("Password changed successfully:", response.data);
      toggleFormView(false);
    } catch (error) {
      console.error("Error changing password:", error);
      setError("Failed to change password");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profileImage: file });
  };

  const toggleFormView = () => {
    setFormView(!formView);
  };

  return (
    <div>
      {authenticated && (
        <>
          <button onClick={toggleFormView}>Edit user</button>
          {formView && (
            <>
              <h2>Edit Profile</h2>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />

                <label>About:</label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                />

                <label>Profile Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                <button type="submit">Update Profile</button>
              </form>

              <h2>Change Password</h2>
              <form onSubmit={handlePasswordChange}>
                <label>Current Password:</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                />

                <label>New Password:</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                />

                <label>Confirm New Password:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />

                <button type="submit">Change Password</button>
              </form>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default EditProfile;
