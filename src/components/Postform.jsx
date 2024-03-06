import { useState } from "react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [nsfw, setNsfw] = useState(false);
  const [error, setError] = useState(null);
  const [postImage, setPostImage] = useState("");
  const [tagsDropdownCount, setTagsDropdownCount] = useState(1);

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

    if (!title || !description || !postImage) {
      setError("Please fill in all necessary fields");
      return;
    }

    setError(null);

    try {
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        setError("Authentication token not found");
        return;
      }

      console.log("Stored token =>", storedToken);

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
                selectedTags,
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
            setSelectedTags("");
            setNsfw(false);
            setPostImage(null);
          } catch (error) {
            setError("Failed to post");
          }
        });
      }
    } catch (error) {
      setError("Failed to post");
    }
  };
  const handleTagChange = (index, value) => {
    const updatedTags = [...selectedTags];
    updatedTags[index] = value;
    setSelectedTags(updatedTags);
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
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
          <input
            onChange={handleImage}
            type="file"
            id="formupload-postImage"
            name="postImage"
            onClick={() => document.getElementById("formupload-postImage")}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PostForm;
