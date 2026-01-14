import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* Forgot password state */
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState("");

  /* ---------------- LOGIN ---------------- */
  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/app");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- PASSWORD RESET ---------------- */
  const handlePasswordReset = async () => {
    setResetStatus("");

    if (!resetEmail) {
      setResetStatus("Please enter your email");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetStatus("Password reset link sent! Check your email.");
    } catch {
      setResetStatus("Failed to send reset email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-6">
      <div className="max-w-6xl w-full bg-white rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* ================= LEFT PANEL ================= */}
        <div className="hidden md:flex relative bg-gradient-to-br from-[#1B1A4A] via-[#2A256E] to-[#3B2F8F] p-12">
          <div className="absolute top-24 left-12 bg-white rounded-3xl p-8 shadow-2xl w-[420px]">
            <div className="mb-6">
              <div className="h-5 w-44 bg-slate-800 rounded mb-2" />
              <div className="h-3 w-60 bg-slate-300 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-slate-200 rounded" />
              <div className="h-3 w-5/6 bg-slate-200 rounded" />
              <div className="h-3 w-4/6 bg-slate-200 rounded" />
            </div>
          </div>

          <div className="absolute bottom-14 left-12 text-white">
            <h3 className="text-2xl font-semibold">
              Build resumes recruiters trust
            </h3>
            <p className="opacity-80 mt-2">Your career starts here.</p>
          </div>
        </div>

        {/* ================= RIGHT FORM ================= */}
        <div className="p-10 sm:p-14 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold">Welcome back</h2>
          <p className="text-slate-500 mb-8">
            Log in to continue building your resume
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowReset(true)}
              className="px-4 py-1.5 rounded-full bg-black text-white text-xs"
            >
              Forgot password?
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-slate-600 mt-6 text-center">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* ================= FORGOT PASSWORD MODAL ================= */}
      {showReset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">
              Reset your password
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Enter your email to receive a reset link
            </p>

            <input
              type="email"
              placeholder="Email address"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3"
            />

            {resetStatus && (
              <p className="text-sm mb-3 text-blue-600">
                {resetStatus}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowReset(false)}
                className="text-sm text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordReset}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Send link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
