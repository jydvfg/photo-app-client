import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import LoginPage from "../src/pages/LoginPage";
import { AuthProviderWrapper } from "./context/auth.context";
import SignupPage from "./pages/SignupPage";
import UserProfilePage from "../src/pages/UserPage"
import LandingPage from "./pages/LandingPage";
import PostPage from "./pages/PostPage";
import PostForm from "./components/Postform";
import Footer from "./components/Footer";
import About from "./pages/AboutPage";
function App() {
  const [showPostForm, setShowPostForm] = useState(false);

  return (
    <Router>
      <AuthProviderWrapper>
        <Navbar
          showPostForm={showPostForm}
          togglePostForm={() => setShowPostForm(!showPostForm)}
        />
        <div className="form-container">{showPostForm && <PostForm />}</div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/posts/:postId" element={<PostPage />} />
          <Route path="/users/:userId" element={<UserProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about" element={<About />} />
        </Routes>

        <Footer />
      </AuthProviderWrapper>
    </Router>
  );
}

export default App;
