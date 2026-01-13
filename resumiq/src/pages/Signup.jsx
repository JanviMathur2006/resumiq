import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";
import { motion } from "framer-motion";

export default function Signup() {
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- SIGNUP HANDLER ---------------- */
  const handleSignup = async () => {
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(res.user, {
        displayName: name,
      });

      navigate("/app");
    } catch (err) {
      setError("Email already in use or invalid details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-6">

      {/* ================= CARD ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >

        {/* ================= LEFT VISUAL ================= */}
        <div className="hidden md:flex relative items-center justify-center bg-[#0F172A] p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />

          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative z-10 bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm"
          >
            {/* Resume mock preview */}
            <div className="space-y-3">
              <div className="h-4 w-36 bg-slate-300 rounded" />
              <div className="h-2 w-52 bg-slate-200 rounded" />
              <div className="h-2 w-44 bg-slate-200 rounded" />

              <div className="mt-6 space-y-2">
                <div className="h-2 w-full bg-slate-200 rounded" />
                <div className="h-2 w-5/6 bg-slate-200 rounded" />
                <div className="h-2 w-4/6 bg-slate-200 rounded" />
              </div>

              <div className="mt-6 space-y-2">
                <div className="h-2 w-full bg-slate-200 rounded" />
                <div className="h-2 w-3/4 bg-slate-200 rounded" />
              </div>
            </div>
          </motion.div>

          <div className="absolute bottom-8 left-8 text-white z-10">
            <h3 className="text-xl font-semibold">
              Your resume. Done right.
            </h3>
            <p className="text-sm opacity-80 mt-1">
              Join thousands building careers with Resumiq.
            </p>
          </div>
        </div>

        {/* ================= RIGHT FORM ================= */}
        <div className="p-10 sm:p-12 flex flex-col justify-center">

          <h2 className="text-2xl font-semibold text-slate-900 mb-2">
            Create your account
          </h2>
          <p className="text-slate-500 mb-8">
            Start building resumes recruiters love
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>

          <p className="text-sm text-slate-600 mt-6 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
