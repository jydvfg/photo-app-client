import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { Link } from "react-router-dom";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

export default function PostPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const { postId } = useParams();
  const storedToken = localStorage.getItem("authToken");

  const getPost = () => {
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

  const findUser = () => {
    axios
      .get(`${backendUrl}/auth/verify`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((res) => {
        setLoggedInUser(res.data._id);
      })
      .catch((err) => {
        console.error("logged in user not found", err);
      });
  };

  useEffect(() => {
    getPost();
    findUser();
  }, []);

  const savePost = () => {
    axios
      .put(
        `${backendUrl}/users/${loggedInUser}`,
        { postId: post._id },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      )
      .then((res) => {
        setLoggedInUser((prevUser) => {
          if (!Array.isArray(prevUser.savedPosts)) {
            console.error("prevUser.savedPosts is not an array");
            return prevUser;
          }
          return {
            ...prevUser,
            savedPosts: [...prevUser.savedPosts, post._id],
          };
        });
      })
      .catch((err) => {
        console.error("Error Saving post", err);
      });
  };

  const handleCommentSuccess = (newComment) => {
    setPost((prevPost) => ({
      ...prevPost,
      comments: [...prevPost.comments, newComment],
    }));
  };

  if (errorMessage) return <div>{errorMessage}</div>;

  if (loading) return <div>Loading...</div>;

  return (
    <div className="content">
      <div className="post-page">
        <div>
          {post && (
            <>
              <img src={post.imageUrl} alt="photo" className="post-image" />
            </>
          )}
        </div>
        <button onClick={savePost}>Save</button>
        <Link to={`/users/${post.user.username}`}>
          <h2>{post.user.username}</h2>
        </Link>
        <h3>{post.title}</h3>
        <p>{post.description}</p>
        <div className="tags-container">
          {post.tags.map((tag, index) => (
            <span key={index} className="tag-label">
              {index > 0 && " "}
              <em>{tag}</em>
            </span>
          ))}
        </div>
        <div className="comment-area">
          <CommentList postId={postId} />
          <CommentForm
            postId={postId}
            loggedInUser={loggedInUser}
            onSuccess={handleCommentSuccess}
          />
        </div>
        <Link to="/">
          <button>Back</button>
        </Link>
      </div>
    </div>
  );
}
