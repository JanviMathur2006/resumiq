import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

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

/* ======================
   INPUT STYLE (LIGHT BLUE)
====================== */
const inputClass = (hasError) =>
  `w-full px-4 py-3 rounded-xl border transition bg-blue-50
   ${
     hasError
       ? "border-red-500 focus:ring-2 focus:ring-red-400"
       : "border-blue-200 focus:ring-2 focus:ring-blue-400"
   }
   focus:outline-none`;

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim() !== "" && password.trim() !== "";

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!canSubmit) {
      setError("Please fill in all fields");
      setTouched({ email: true, password: true });
      return;
    }

    try {
      setError("");
      setLoading(true);

      await signInWithEmailAndPassword(auth, email, password);

      navigate("/app", { replace: true });
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariant}
        className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-blue-200"
      >
        <motion.h1
          variants={itemVariant}
          className="text-2xl font-semibold mb-2 text-blue-900"
        >
          Welcome back
        </motion.h1>

        <motion.p
          variants={itemVariant}
          className="text-blue-600 mb-6"
        >
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

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass(touched.email && !email)}
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass(touched.password && !password)}
          />

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={!canSubmit || loading}
            className={`w-full py-3 rounded-xl text-lg font-medium transition ${
              canSubmit
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-blue-200 text-blue-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-blue-600 mt-6 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-blue-700 hover:underline"
          >
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}