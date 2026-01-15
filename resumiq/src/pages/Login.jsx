import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { motion } from "framer-motion";
import { auth, googleProvider } from "../firebase";

/* ======================
   ANIMATION VARIANTS
====================== */
const cardVariant = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 110,
      damping: 20,
      when: "beforeChildren",
      staggerChildren: 0.12,
    },
  },
};

const itemVariant = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

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
    navigate("/app");
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/app");
    } catch {
      setError("Google sign-in failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7fb] px-4">

      {/* Animated Card (NO GLOW) */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariant}
        whileHover={{ y: -2 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >

        {/* HEADER */}
        <motion.h1
          variants={itemVariant}
          className="text-2xl font-semibold text-gray-900 mb-2"
        >
          Welcome back
        </motion.h1>

        <motion.p
          variants={itemVariant}
          className="text-gray-600 mb-6"
        >
          Log in to continue building your resume
        </motion.p>

        {error && (
          <motion.p
            variants={itemVariant}
            className="text-red-500 text-sm mb-4"
          >
            {error}
          </motion.p>
        )}

        {/* GOOGLE LOGIN */}
        <motion.button
          variants={itemVariant}
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
        </motion.button>

        {/* DIVIDER */}
        <motion.div
          variants={itemVariant}
          className="flex items-center gap-3 mb-5"
        >
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </motion.div>

        {/* FORM */}
        <motion.form
          variants={itemVariant}
          onSubmit={handleLogin}
          className="space-y-5"
        >
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-black text-white
              text-lg font-medium hover:bg-gray-800 transition"
          >
            Login
          </button>
        </motion.form>

        {/* FOOTER */}
        <motion.p
          variants={itemVariant}
          className="text-center text-gray-600 mt-6 text-sm"
        >
          Don’t have an account?{" "}
          <Link to="/signup" className="text-black font-medium hover:underline">
            Create one
          </Link>
        </motion.p>

      </motion.div>
    </div>
  );
}
