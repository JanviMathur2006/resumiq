import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("loggedIn") === "true") {
      navigate("/app");
    }
  }, [navigate]);

  const handleLogin = () => {
    setError("");

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
      setError("No account found. Please sign up.");
      return;
    }

    if (email !== savedUser.email || password !== savedUser.password) {
      setError("Invalid email or password.");
      return;
    }

    // Success
    localStorage.setItem("loggedIn", "true");
    navigate("/app");
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">

          <h2 className="text-2xl font-semibold mb-4 text-center">
            Login
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">
              {error}
            </p>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Login
          </button>

          <p className="mt-4 text-center text-sm">
            Don’t have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
