import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";

export default function Signup() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= PASSWORD STRENGTH ================= */
  const getPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);

  const strengthLabel = [
    "Very weak",
    "Weak",
    "Fair",
    "Good",
    "Strong",
    "Very strong",
  ][strength];

  const strengthColor = [
    "bg-red-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-green-600",
  ][strength];

  /* ================= SIGNUP HANDLER ================= */
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

      // 👉 Redirect to onboarding (IMPORTANT)
      navigate("/onboarding");
    } catch {
      setError("Email already in use or invalid details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-6">
      <div className="max-w-6xl w-full bg-white rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* ================= LEFT PANEL ================= */}
        <div className="hidden md:flex relative bg-gradient-to-br from-[#1B1A4A] via-[#2A256E] to-[#3B2F8F] p-12">

          {/* Resume Preview */}
          <div className="absolute top-24 left-12 bg-white rounded-3xl p-8 shadow-2xl w-[420px]">
            <div className="mb-6">
              <div className="h-5 w-44 bg-slate-800 rounded mb-2" />
              <div className="h-3 w-60 bg-slate-300 rounded" />
            </div>

            <div className="mb-6">
              <div className="h-3 w-28 bg-slate-400 rounded mb-3" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-slate-200 rounded" />
                <div className="h-3 w-5/6 bg-slate-200 rounded" />
                <div className="h-3 w-4/6 bg-slate-200 rounded" />
              </div>
            </div>

            <div>
              <div className="h-3 w-20 bg-slate-400 rounded mb-3" />
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs rounded-full bg-slate-100 text-slate-600">
                  JavaScript
                </span>
                <span className="px-3 py-1 text-xs rounded-full bg-slate-100 text-slate-600">
                  React
                </span>
                <span className="px-3 py-1 text-xs rounded-full bg-slate-100 text-slate-600">
                  HTML
                </span>
                <span className="px-3 py-1 text-xs rounded-full bg-slate-100 text-slate-600">
                  CSS
                </span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-14 left-12 text-white">
            <h3 className="text-2xl font-semibold">
              Build resumes recruiters trust
            </h3>
            <p className="opacity-80 mt-2">
              Your career starts here.
            </p>
          </div>
        </div>

        {/* ================= RIGHT FORM ================= */}
        <div className="p-10 sm:p-14 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-slate-900">
            Create your account
          </h2>
          <p className="text-slate-500 mt-1 mb-8">
            Start building resumes recruiters love
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
            />

            {/* PASSWORD + STRENGTH */}
            <div>
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
              />

              {password && (
                <div className="mt-3">
                  <div className="flex gap-1 mb-1">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full ${
                          i < strength ? strengthColor : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-slate-500">
                    Password strength:{" "}
                    <span className="font-medium">
                      {strengthLabel}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>

          <p className="text-sm text-slate-600 mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
