import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase"; // Adjust path if needed

function Login({ setUser }) {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('login.title', 'Login - MediMart');
  }, [t]);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔁 Fetch backend user using Firebase UID
  const fetchBackendUser = async (uid, idToken) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/firebase/${uid}`, {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    return res;
  };

  // 🔄 Ensure user exists in backend, create if not
  const ensureUserInBackend = async (firebaseUser, idToken) => {
    // Try to fetch user
    const res = await fetchBackendUser(firebaseUser.uid, idToken);
    if (res.status === 404) {
      // Create user if not found
      await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          username: firebaseUser.displayName || "No Name",
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || "",
        }),
      });
    }
  };

  // 🔄 Sync user after login/signup with backend
  const syncUserWithBackend = async (user) => {
    const idToken = await user.getIdToken();
    await ensureUserInBackend(user, idToken); // <-- Ensure user exists first
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        firebaseUid: user.uid, // <-- Add this line
        name: user.displayName || "No Name",
        email: user.email,
        photoURL: user.photoURL || "",
        role: "user", // default
        provider: "firebase",
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Sync failed");

    localStorage.setItem("access_token", idToken);
    return data;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Sign in with email/password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const firebaseUser = userCredential.user;

      // Sync and then fetch full user from backend
      await syncUserWithBackend(firebaseUser);
      const backendUser = await fetchBackendUser(firebaseUser.uid);
      const userObj = await backendUser.json();
      setUser(userObj);
      toast.success("Login successful!", { position: "top-right" });
      navigate("/"); // Redirect to home page after login
    } catch (err) {
      // Error
      setError(err.message || "Login failed. Please try again.");
      toast.error(err.message || "Login failed. Please try again.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (providerName) => {
    setError("");
    setLoading(true);

    let provider;
    if (providerName === "google") provider = new GoogleAuthProvider();
    else return;

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Sync and fetch
      await syncUserWithBackend(user);
      const backendUser = await fetchBackendUser(user.uid);
      const userObj = await backendUser.json();
      setUser(userObj);
      toast.success("Login successful!", { position: "top-right" });
      navigate("/"); // Redirect to home page after social login
    } catch (err) {
      // Error
      setError(err.message || "Social login failed. Please try again.");
      toast.error(err.message || "Social login failed. Please try again.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-6 rounded-2xl shadow-2xl bg-white/90 backdrop-blur-md">
          <h2 className="mb-4 text-3xl font-extrabold text-center text-indigo-700 drop-shadow">
            Login to your account
          </h2>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-100 border border-red-300 rounded p-2 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                disabled={loading}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                disabled={loading}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-red-500 text-white font-bold text-lg shadow-lg hover:from-indigo-600 hover:to-red-600 transition-all duration-200"
            >
              {loading ? "Logging in..." : "Sign in"}
            </button>
          </form>

          <div className="flex items-center w-full my-6">
            <hr className="w-full border-gray-300" />
            <p className="px-3 text-gray-400">OR</p>
            <hr className="w-full border-gray-300" />
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleSocialLogin("google")}
              disabled={loading}
              className="flex items-center justify-center w-full p-3 rounded-full bg-white text-gray-700 border border-gray-300 font-semibold shadow hover:bg-gray-50 transition gap-3"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>

          </div>

          <p className="mt-6 text-sm text-center text-gray-600">
            Don’t have an account?
            <Link
              to="/signup"
              className="ml-1 font-semibold text-indigo-600 hover:underline hover:text-red-600 transition"
            >
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
