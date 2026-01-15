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

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});

  const handleSignup = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("Please fill in all fields");
      setTouched({ name: true, email: true, password: true });
      return;
    }

    setError("");
    navigate("/onboarding");
  };

  const handleGoogleSignup = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/onboarding");
    } catch {
      setError("Google sign-up failed");
    }
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
          Create your account
        </motion.h1>

        <motion.p variants={itemVariant} className="text-gray-600 mb-6">
          Start building your professional resume
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

        {/* GOOGLE SIGNUP */}
        <motion.button
          variants={itemVariant}
          onClick={handleGoogleSignup}
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
        <motion.div variants={itemVariant} className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </motion.div>

        {/* FORM */}
        <form onSubmit={handleSignup} className="space-y-5">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            onChange={(e) => setName(e.target.value)}
            className={inputClass(touched.name && !name)}
          />

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
            className="w-full py-3 rounded-xl bg-black text-white
              text-lg font-medium hover:bg-gray-800 transition"
          >
            Create account
          </button>
        </form>

        <motion.p variants={itemVariant} className="text-center text-gray-600 mt-6 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="font-medium hover:underline">
            Log in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
