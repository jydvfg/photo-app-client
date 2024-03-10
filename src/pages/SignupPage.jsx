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

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
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
      setError(err.response.data.message);
    }
    setLoading(false);
  };

  return (
    <div className="content">
      <h2>Create a New User</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Email<span>*</span>:
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>
            Password<span>*</span>:
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
            title="Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter."
            required
          />
        </div>
        <div>
          <label>
            Name<span>*</span>:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>
            Username<span>*</span>:
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            maxLength={10}
            required
          />
          <span className="field-info">Maximum 10 characters</span>
        </div>
        <div>
          <label>
            Profile Image<span>*</span>:
          </label>
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleImage}
            required
          />
          <span className="field-info">1:1 format, max. 3MB</span>
        </div>
        <div>
          <label>About:</label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            maxLength={150}
          />
          <span className="field-info">Maximum 150 characters</span>
        </div>
        <div>
          <label>Is Public:</label>
          <input
            type="checkbox"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
          />
          <span className="field-info">Share your contact details</span>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Creating User..." : "Create User"}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
