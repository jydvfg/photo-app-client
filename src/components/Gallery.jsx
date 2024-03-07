import { useEffect, useState } from "react";
import axios from "axios";
import { Gallery } from "react-grid-gallery";
import { Link, useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

const Grid = () => {
  const [images, setImages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting user location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getUserLocation();
  }, []);

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

      const transformedImages = filteredPosts.map((post) => ({
        src: post.imageUrl,
        thumbnail: post.imageUrl,
        thumbnailHeight: 150,
        isSelected: false,
        caption: post.title,
        nsfw: post.nsfw,
        distance: userLocation
          ? calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              post.location.coordinates[0],
              post.location.coordinates[1]
            )
          : null,
      }));

      const sortedImages = userLocation
        ? transformedImages.sort((a, b) => a.distance - b.distance)
        : transformedImages;

      setPosts(filteredPosts);
      setImages(sortedImages);
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
  }, [userLocation]);

  const handleClick = (index) => {
    const clickedImageUrl = images[index].src;
    const matchedPost = posts.find((post) => post.imageUrl === clickedImageUrl);
    if (matchedPost) {
      navigate(`/posts/${matchedPost._id}`);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  return (
    <div className="landing-gallery">
      <Gallery
        images={images}
        enableImageSelection={false}
        margin={10}
        enableLightbox={true}
        rowHeight={275}
        backdropClosesModal={true}
        /* thumbnailStyle={(item) => ({
          filter: item.nsfw ? "blur(10px)" : "none",
        })}*/
        onClick={handleClick}
      />
    </div>
  );
};

export default Grid;
