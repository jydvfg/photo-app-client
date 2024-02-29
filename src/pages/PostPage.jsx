import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { Link } from "react-router-dom";

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

export default function PostPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const { postId } = useParams();

  const getPost = () => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      axios
        .get(`${backendUrl}/posts/${postId}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((res) => {
          setPost(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log("error while fetching post =>", error);
          const errorDescription = error.response.data.message;
          setErrorMessage(errorDescription);
        });
    } else {
      setErrorMessage("User not logged in");
    }
  };
  useEffect(() => {
    setTimeout(() => {
      getPost();
    }, 1000);
  }, []);

  if (errorMessage) return <div>{errorMessage}</div>;

  if (loading) return <div>Loading...</div>;

  return (
    <div className="post-body">
      <div>
        {post && (
          <>
            <img src={post.imageUrl} alt="photo" className="post-image" />
          </>
        )}
      </div>
      <Link to="/profile">
        <h2>{post.user.username}</h2>
      </Link>
      <Link to="/">
        <button>Back</button>
      </Link>
    </div>
  );
}
