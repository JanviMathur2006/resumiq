import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { motion } from "framer-motion";
import { auth, googleProvider } from "../firebase";

/* ======================
   ANIMATION VARIANTS
====================== */
const cardVariant = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
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

const shakeVariant = {
  shake: {
    x: [-10, 10, -8, 8, -4, 4, 0],
    transition: { duration: 0.4 },
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

const inputClass = (hasError) =>
  `w-full px-4 py-3 rounded-xl border transition
   ${
     hasError
       ? "border-red-500 focus:ring-2 focus:ring-red-500"
       : "border-gray-300 focus:ring-2 focus:ring-blue-500"
   }
   focus:outline-none`;

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      setTouched({ email: true, password: true });
      return;
    }

    setError("");
    navigate("/app");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7fb] px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariant}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <motion.h1 variants={itemVariant} className="text-2xl font-semibold mb-2">
          Welcome back
        </motion.h1>

        <motion.p variants={itemVariant} className="text-gray-600 mb-6">
          Log in to continue building your resume
        </motion.p>

        {error && (
          <motion.p
            key={error}
            variants={shakeVariant}
            animate="shake"
            className="text-red-500 text-sm mb-4"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass(touched.email && !email)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass(touched.password && !password)}
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-black text-white text-lg font-medium hover:bg-gray-800 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="font-medium hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
