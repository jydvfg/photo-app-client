import { useState } from "react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    username: "",
    image: "https://i.imgur.com/GvsgVco.jpeg",
    isPublic: false,
    about: "",
    isAdmin: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/auth/signup`, formData);
      console.log("User created:", response.data);
      setFormData({
        email: "",
        password: "",
        name: "",
        username: "",
        image: "https://i.imgur.com/GvsgVco.jpeg",
        isPublic: false,
        about: "",
        isAdmin: false,
      });
      setError("");
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Failed to create user");
    }
    setLoading(false);
  };

  return (
    <div className="content">
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
        <button type="submit" disabled={loading}>
          {loading ? "Creating User..." : "Create User"}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
