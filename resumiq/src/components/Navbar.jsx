import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      
      {/* Logo */}
      <div
        className="logo"
        onClick={() => navigate("/app")}
      >
        Resumiq
      </div>

      {/* Navigation Links */}
      <div className="nav-links">
        
        <NavLink
          to="/app"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Settings
        </NavLink>

        <NavLink
          to="/app/profile"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Profile
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="logout-btn"
        >
          Logout
        </button>

      </div>
    </nav>
  );
}