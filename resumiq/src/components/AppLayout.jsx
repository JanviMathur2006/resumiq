import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-[#f5f7fb]">
      <Outlet />
    </div>
  );
}