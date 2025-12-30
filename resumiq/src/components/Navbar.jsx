import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="logo-section" onClick={() => navigate("/app")}>
        <img src={logo} alt="Resumiq Logo" className="logo" />
        <span className="brand">Resumiq</span>
      </div>

      {/* Navigation Links */}
      <div className="nav-links">
        <Link to="/app">Home</Link>
        <Link to="/app/create">Create</Link>
        <Link to="/app/profile">Profile</Link>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
