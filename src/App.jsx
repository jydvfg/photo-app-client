import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import LoginPage from "../src/pages/LoginPage";
import { AuthProviderWrapper } from "./context/auth.context";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <Router>
      <AuthProviderWrapper>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </AuthProviderWrapper>
    </Router>
  );
}

export default App;
