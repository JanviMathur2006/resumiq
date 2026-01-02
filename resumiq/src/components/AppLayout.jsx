import { Outlet, NavLink } from "react-router-dom";

export default function AppLayout() {
  return (
    <div>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-black text-white">
        <h1 className="text-xl font-semibold">Resumiq</h1>

        <div className="flex gap-6 items-center">
          <NavLink
            to="/app"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "text-white"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/app/settings"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "text-white"
            }
          >
            Settings
          </NavLink>

          <NavLink
            to="/app/profile"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "text-white"
            }
          >
            Profile
          </NavLink>
        </div>
      </nav>

      {/* Page Content */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
