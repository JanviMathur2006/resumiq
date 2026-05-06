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
   INPUT STYLE
====================== */

const inputClass = (hasError) =>
  `w-full px-4 py-3 rounded-xl border transition bg-white
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
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-6">

      {/* BLUR CIRCLES */}

      <div className="absolute top-[-100px] left-[-100px] w-[320px] h-[320px] bg-blue-400 opacity-20 blur-3xl rounded-full"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[380px] h-[380px] bg-blue-700 opacity-20 blur-3xl rounded-full"></div>

      {/* MAIN CONTAINER */}

      <div className="w-full max-w-6xl grid md:grid-cols-2 items-center gap-12 z-10">

        {/* LEFT SIDE */}

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="hidden md:block"
        >
          <h1 className="text-6xl font-bold leading-tight text-blue-950">
            Build resumes <br />
            that <span className="text-blue-600">get you hired.</span>
          </h1>

          <p className="mt-6 text-lg text-blue-800 max-w-lg">
            Create professional resumes in minutes with modern templates,
            AI assistance, and smooth editing experience.
          </p>

          <div className="mt-10 space-y-4 text-blue-900">

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              AI Powered Suggestions
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              ATS Friendly Templates
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              Fast & Secure Resume Builder
            </div>

          </div>
        </motion.div>

        {/* LOGIN CARD */}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariant}
          className="glass-card w-full max-w-md mx-auto p-8"
        >
          <motion.h1
            variants={itemVariant}
            className="text-5xl font-bold mb-2 text-blue-900"
          >
            Welcome back
          </motion.h1>

          <motion.p
            variants={itemVariant}
            className="text-blue-700 mb-8"
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

            <motion.div variants={itemVariant}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onBlur={() =>
                  setTouched((t) => ({ ...t, email: true }))
                }
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass(touched.email && !email)}
              />
            </motion.div>

            {/* PASSWORD */}

            <motion.div variants={itemVariant}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onBlur={() =>
                  setTouched((t) => ({ ...t, password: true }))
                }
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass(touched.password && !password)}
              />
            </motion.div>

            {/* FORGOT PASSWORD */}

            <motion.div
              variants={itemVariant}
              className="flex justify-end"
            >
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline bg-transparent shadow-none p-0 m-0"
              >
                Forgot password?
              </button>
            </motion.div>

            {/* LOGIN BUTTON */}

            <motion.div variants={itemVariant}>
              <button
                type="submit"
                disabled={!canSubmit || loading}
                className={`w-full py-3 rounded-xl text-lg font-semibold transition-all duration-300 ${
                  canSubmit
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:scale-[1.02] hover:shadow-xl"
                    : "bg-blue-200 text-blue-400 cursor-not-allowed"
                }`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </motion.div>

            {/* DIVIDER */}

            <motion.div
              variants={itemVariant}
              className="flex items-center gap-4 py-2"
            >
              <div className="flex-1 h-[1px] bg-blue-200"></div>

              <span className="text-sm text-blue-500">
                or continue with
              </span>

              <div className="flex-1 h-[1px] bg-blue-200"></div>
            </motion.div>

            {/* GOOGLE BUTTON */}

            <motion.button
              variants={itemVariant}
              type="button"
              className="w-full py-3 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 transition font-medium text-blue-900 shadow-none"
            >
              Continue with Google
            </motion.button>

            {/* GITHUB BUTTON */}

            <motion.button
              variants={itemVariant}
              type="button"
              className="w-full py-3 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 transition font-medium text-blue-900 shadow-none"
            >
              Continue with GitHub
            </motion.button>

          </form>

          {/* SIGNUP */}

          <motion.p
            variants={itemVariant}
            className="text-center text-blue-700 mt-7 text-sm"
          >
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-blue-800 hover:underline"
            >
              Create one
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}