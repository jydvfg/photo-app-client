import React, { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const storedToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${backendUrl}/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        setComments(response.data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [postId]);

  return (
    <div>
      <h3>Comments</h3>
      {comments.map((comment) => (
        <div key={comment._id}>
          <p>{comment.comment}</p>
          <p>Posted by: {comment.user.username}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
