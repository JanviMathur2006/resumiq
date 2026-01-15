import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { motion } from "framer-motion";

import { auth, googleProvider } from "../firebase";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🔐 Email login (mock for now)
  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // replace with real email/password auth later
    navigate("/app");
  };

  // 🔐 Google login
  const handleGoogleLogin = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/app");
    } catch (err) {
      console.error(err);
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7fb] px-4">

      {/* 🔥 Animated Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >

        {/* HEADER */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Welcome back
        </h1>
        <p className="text-gray-600 mb-6">
          Log in to continue building your resume
        </p>

        {/* ERROR MESSAGE */}
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        {/* GOOGLE SIGN-IN */}
        <button
          onClick={handleGoogleLogin}
          className="w-full mb-5 flex items-center justify-center gap-3
            border border-gray-300 rounded-xl py-3
            hover:bg-gray-100 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="font-medium text-gray-700">
            Continue with Google
          </span>
        </button>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* EMAIL LOGIN */}
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-black"
          />

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

      </motion.div>
    </div>
  );
}
