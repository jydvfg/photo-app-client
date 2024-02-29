import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

function Navbar() {
  const { logOutUser } = useContext(AuthContext);
  return (
    <nav className="navbar">
      <Link to="/">
        <button className="button">Home</button>
      </Link>
      <Link to="/profile">
        <button className="button">Profile</button>
      </Link>
      <Link to="/login">
        <button className="button">Login</button>
      </Link>
      <button className="button" onClick={logOutUser}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
