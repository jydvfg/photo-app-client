import { useState } from "react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [nsfw, setNsfw] = useState(false);
  const [error, setError] = useState(null);

  const [postImage, setPostImage] = useState("");
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setFileToBase(file);
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setPostImage(reader.result);
    };
  };
  console.log("Is post url received => ", postImage.slice(0, 21));
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !description || !tags || !postImage) {
      setError("Please fill in all fields");
      return;
    }

    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("tags", tags);
      formData.append("nsfw", nsfw);
      formData.append("imageUrl", postImage);

      // Get user's current location using Geolocation API
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          formData.append("latitude", latitude);
          formData.append("longitude", longitude);

          // Post data to backend
          await axios.post(`${backendUrl}/posts`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          // Clear form fields after successful post
          setTitle("");
          setDescription("");
          setTags("");
          setNsfw(false);
          setPostImage(null);
        });
      }
    } catch (error) {
      setError("Failed to post");
    }
  };

  return (
    <div>
      <h2>Create a New Post</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
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
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
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
          <label>Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PostForm;
