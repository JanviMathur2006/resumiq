import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "15px", background: "#222" }}>
      <Link to="/" style={{ color: "white", marginRight: "15px" }}>Home</Link>
      <Link to="/create" style={{ color: "white", marginRight: "15px" }}>Create</Link>
      <Link to="/profile" style={{ color: "white", marginRight: "15px" }}>Profile</Link>
      <Link to="/login" style={{ color: "white" }}>Login</Link>
    </nav>
  );
}
