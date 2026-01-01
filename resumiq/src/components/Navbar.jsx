import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-blue-400 font-semibold"
      : "text-white hover:text-gray-300";

  return (
    <nav className="bg-black text-white px-6 py-4 flex items-center justify-between shadow-md">
      
      {/* Logo */}
      <div
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/app")}
      >
        Resumiq
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        <NavLink to="/app" className={linkClass}>
          Home
        </NavLink>

        <NavLink to="/app/settings" className={linkClass}>
          Settings
        </NavLink>

        <NavLink to="/app/profile" className={linkClass}>
          Profile
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
