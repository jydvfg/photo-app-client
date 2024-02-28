import React, { useState } from "react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    username: "",
    image: "https://i.imgur.com/r8bo8u7.png", // Default image URL
    isPublic: false,
    about: "",
    isAdmin: false,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backendUrl}/auth/signup`, formData);
      console.log("User created:", response.data);
      // Clear form after successful submission
      setFormData({
        email: "",
        password: "",
        name: "",
        username: "",
        image: "https://i.imgur.com/r8bo8u7.png", // Reset to default image URL
        isPublic: false,
        about: "",
        isAdmin: false,
      });
      setError("");
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Failed to create user");
    }
  };

  return (
    <div>
      <h2>Create a New User</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>About:</label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Is Public:</label>
          <input
            type="checkbox"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Is Admin:</label>
          <input
            type="checkbox"
            name="isAdmin"
            checked={formData.isAdmin}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Create User</button>
      </form>
    </div>
  );
};

export default SignupPage;
