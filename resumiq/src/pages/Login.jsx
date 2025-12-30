import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    if (!savedUser) {
      setError("No account found. Please sign up.");
      return;
    }

    if (email !== savedUser.email || password !== savedUser.password) {
      setError("Invalid email or password");
      return;
    }

    // Successful login
    localStorage.setItem("loggedIn", "true");
    navigate("/app");
  };

  return (
    <div className="page">
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      <p style={{ marginTop: "15px" }}>
        Don’t have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/signup")}
        >
          Sign up
        </span>
      </p>
    </div>
  );
}
