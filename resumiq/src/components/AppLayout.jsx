import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 px-6 py-6 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

    </div>
  );
}
