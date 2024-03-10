import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

const PostForm = ({ onSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState({});
  const [nsfw, setNsfw] = useState(false);
  const [error, setError] = useState(null);
  const [postImage, setPostImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tagsDropdownCount, setTagsDropdownCount] = useState(1);
  const { isLoggedIn, user } = useContext(AuthContext);
  const storedToken = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileToBase(file);
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setPostImage(reader.result);
    };
  };

  const handlePostSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);

    if (!title || !description || !postImage) {
      setError("Please fill in all necessary fields");
      setLoading(false);
      return;
    }

    setError(null);

    try {
      if (!storedToken) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          try {
            await axios.post(
              `${backendUrl}/posts`,
              {
                latitude,
                longitude,
                title,
                description,
                tags: Object.values(selectedTags),
                nsfw,
                postImage,
              },
              {
                headers: {
                  Authorization: `Bearer ${storedToken}`,
                },
              }
            );

            setTitle("");
            setDescription("");
            setSelectedTags([]);
            setNsfw(false);
            setPostImage(null);
            setLoading(false);
            onSuccess();
            navigate("/");
          } catch (error) {
            setError("Failed to post");
            setLoading(false);
          }
        });
      }
    } catch (error) {
      setError("Failed to post");
      setLoading(false);
    }
  };

  const handleTagChange = (index, value) => {
    setSelectedTags((prevSelectedTags) => ({
      ...prevSelectedTags,
      [index]: value,
    }));
  };

  const handleAddTagDropdown = () => {
    if (tagsDropdownCount < 5) {
      setTagsDropdownCount(tagsDropdownCount + 1);
    }
  };

  return (
    <div className="post-form">
      <h2>Create a New Post</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handlePostSubmit}>
        <div>
          <label>
            Title<span>*</span>:
            <br />
            <span
              style={{ fontSize: "12px", color: "#666", fontStyle: "italic" }}
            >
              (Max 20 characters)
            </span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>
            Description<span>*</span>:
            <br />
            <span
              style={{ fontSize: "12px", color: "#666", fontStyle: "italic" }}
            >
              (Max 100 characters)
            </span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Tags:</label>
          {[...Array(tagsDropdownCount)].map((_, index) => (
            <div key={index}>
              <select
                value={selectedTags[index] || ""}
                onChange={(e) => handleTagChange(index, e.target.value)}
              >
                <option value="">Select a tag</option>
                {[
                  "street",
                  "portrait",
                  "B&W",
                  "adult",
                  "architecture",
                  "film",
                  "digital",
                  "lo-fi",
                  "post-photography",
                  "astro",
                  "wildlife",
                  "documentary",
                  "sports",
                  "macro",
                  "landscape",
                  "abstract",
                  "event",
                  "nature",
                  "conceptual",
                  "studio",
                  "candid",
                  "vernacular",
                  "fine-art",
                  "composite",
                  "night",
                  "fashion",
                  "analoge",
                  "medium-format",
                  "35-mm",
                ].map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <button type="button" onClick={handleAddTagDropdown}>
            Add Tag
          </button>
        </div>
        <div>
          <label>NSFW:</label>
          <input
            type="checkbox"
            checked={nsfw}
            onChange={(e) => setNsfw(e.target.checked)}
          />
        </div>
        <div>
          <label>
            Post Image<span>*</span>:
            <br />
            <span
              style={{ fontSize: "12px", color: "#666", fontStyle: "italic" }}
            >
              (Max size: 3 MB)
            </span>
          </label>
          <input type="file" accept="image/*" onChange={handleImage} required />
        </div>
        <button type="submit" disabled={loading}>
          {" "}
          {loading ? "Loading..." : "Submit"}{" "}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
