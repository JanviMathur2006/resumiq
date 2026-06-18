import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

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
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  }}
>
  <img
    src={logo}
    alt="Resumiq"
    style={{
      height: "42px",
      width: "auto",
    }}
  />

  <span
    style={{
      fontWeight: "700",
      fontSize: "24px",
    }}
  >
    Resumiq
  </span>
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