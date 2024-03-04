import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import LoginPage from "../src/pages/LoginPage";
import { AuthProviderWrapper } from "./context/auth.context";
import SignupPage from "./pages/SignupPage";
import UserProfilePage from "./pages/UserPage";
import LandingPage from "./pages/LandingPage";
import PostPage from "./pages/PostPage";
import PostForm from "./components/Postform";
function App() {
  const [showPostForm, setShowPostForm] = useState(false);

  return (
    <Router>
      <AuthProviderWrapper>
        <Navbar
          showPostForm={showPostForm}
          togglePostForm={() => setShowPostForm(!showPostForm)}
        />
        {showPostForm && <PostForm />}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/posts/:postId" element={<PostPage />} />
          <Route path="/users/:userId" element={<UserProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </AuthProviderWrapper>
    </Router>
  );
}

export default App;
