import React from "react";
import Navbar from "../src/components/Navbar";
import PostForm from "../src/components/Postform";
import CreateUserForm from "./components/Signup";

const App = () => {
  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <CreateUserForm />
      </div>
    </div>
  );
};

export default App;
