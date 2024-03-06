import React, { useEffect, useState } from "react";
import axios from "axios";
import { Gallery } from "react-grid-gallery";
import { Navigate, useNavigate } from "react-router-dom";

const UserPosts = ({ idNum }) => {
  const [images, setImages] = useState([]);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

  useEffect(() => {
    const fetchUserImages = async () => {
      try {
        const storedToken = localStorage.getItem("authToken");
        const response = await axios.get(`${backendUrl}/posts/users/${idNum}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        const userImages = response.data.posts.map((post) => ({
          src: post.imageUrl,
          thumbnail: post.imageUrl,
          thumbnailHeight: 150,
          isSelected: false,
          caption: post.title,
        }));
        setPosts(response.data.posts);
        setImages(userImages);
      } catch (error) {
        console.error("Error fetching user images:", error);
      }
    };

    fetchUserImages();
  }, [idNum]);

  const handleClick = (index) => {
    const clickedImageUrl = images[index].src;
    const matchedPost = posts.find((post) => post.imageUrl === clickedImageUrl);
    if (matchedPost) {
      navigate(`/posts/${matchedPost._id}`);
    }
  };

  return (
    <div className="your-posts">
      <h2>Your Posts</h2>
      <Gallery
        images={images}
        enableImageSelection={false}
        enableLightbox={true}
        backdropClosesModal={true}
        onClick={handleClick}
      />
    </div>
  );
};

export default UserPosts;
