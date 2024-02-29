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
                tags,
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
            setTags("");
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

  return (
    <div>
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
