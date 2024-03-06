import React, { useEffect, useState } from "react";
import axios from "axios";
import { Gallery } from "react-grid-gallery";
import { Navigate, useNavigate } from "react-router-dom";

const SavedPosts = ({ userId }) => {
  const [savedImages, setSavedImages] = useState([]);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

  useEffect(() => {
    const fetchSavedImages = async () => {
      try {
        const storedToken = localStorage.getItem("authToken");
        const response = await axios.get(`${backendUrl}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        const savedImages = response.data.savedPosts.map((post) => ({
          src: post.imageUrl,
          thumbnail: post.imageUrl,
          thumbnailHeight: 150,
          isSelected: false,
          caption: post.title,
          _id: post._id,
        }));
        setPosts(response.data.savedPosts);
        setSavedImages(savedImages);
      } catch (error) {
        console.error("Error fetching saved images:", error);
      }
    };

    fetchSavedImages();
  }, [userId]);

  const handleSavedImageClick = (index) => {
    const clickedImageUrl = savedImages[index].src;
    const matchedPost = savedImages.find((post) => {
      return post.src === clickedImageUrl && post._id !== undefined;
    });
    if (matchedPost) {
      navigate(`/posts/${matchedPost._id}`);
    }
  };

  return (
    <div className="saved-posts">
      <h2>Saved Posts</h2>
      <Gallery
        images={savedImages}
        enableImageSelection={false}
        enableLightbox={true}
        backdropClosesModal={true}
        onClick={handleSavedImageClick}
      />
    </div>
  );
};

export default SavedPosts;
