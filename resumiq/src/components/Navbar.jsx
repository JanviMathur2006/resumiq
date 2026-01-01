import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-black text-white px-6 py-4 flex items-center justify-between">
      
      {/* Logo */}
      <div className="text-xl font-semibold">
        Resumiq
      </div>

      {/* Navigation Links */}
      <div className="flex gap-6">
        <NavLink
          to="/app"
          className={({ isActive }) =>
            isActive
              ? "text-blue-400 font-medium"
              : "hover:text-gray-300"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            isActive
              ? "text-blue-400 font-medium"
              : "hover:text-gray-300"
          }
        >
          Settings
        </NavLink>

        <NavLink
          to="/app/profile"
          className={({ isActive }) =>
            isActive
              ? "text-blue-400 font-medium"
              : "hover:text-gray-300"
          }
        >
          Profile
        </NavLink>
      </div>
    </nav>
  );
}
