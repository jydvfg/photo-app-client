import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

const Gallery = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const response = await axios.get(`${backendUrl}/api/posts`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const filteredPosts = response.data.filter((post) => {
        const postTimestamp = new Date(post.timestamp);
        const currentTimestamp = new Date();
        const twentyFourHoursAgo = new Date(
          currentTimestamp.getTime() - 24 * 60 * 60 * 1000
        );
        return postTimestamp > twentyFourHoursAgo;
      });

      setPosts(filteredPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts().catch((err) => {
      console.error(err);
    });

    const refreshInterval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 12 && now.getMinutes() === 0) {
        fetchPosts();
      }
    }, 1000 * 60);

    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <div className="gallery">
      {posts.map((post) => (
        <div className="gallery-item" key={post._id}>
          <Link to={`/posts/${post._id}`}>
            <img src={post.imageUrl} alt={post.title} />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
