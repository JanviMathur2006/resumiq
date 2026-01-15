import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // 🔐 replace with real auth later
    navigate("/app");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7fb] px-4">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        {/* HEADER */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Welcome back
        </h1>
        <p className="text-gray-600 mb-6">
          Log in to continue building your resume
        </p>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-gray-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-black text-white
              text-lg font-medium hover:bg-gray-800 transition"
          >
            Login
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-gray-600 mt-6 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-black font-medium hover:underline">
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
}
