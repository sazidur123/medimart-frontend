import React, { useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

function Signup({ setUser }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    photo: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = getAuth(app);

  // Cleanup preview blob URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files[0]) {
      setForm({ ...form, photo: files[0] });
      if (preview) URL.revokeObjectURL(preview); // cleanup previous
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Copy robust backend sync logic from Login.jsx
  const fetchBackendUser = async (uid, idToken) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/firebase/${uid}`, {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    return res;
  };

  const ensureUserInBackend = async (firebaseUser, idToken) => {
    const res = await fetchBackendUser(firebaseUser.uid, idToken);
    if (res.status === 404) {
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
          role: "user",
        }),
      });
    }
  };

  const syncUserWithBackend = async (user) => {
    const idToken = await user.getIdToken();
    await ensureUserInBackend(user, idToken);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ firebaseUid: user.uid }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Sync failed");
    localStorage.setItem("access_token", idToken);
    return data;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      // 1. Create user in Firebase Auth
      const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      let uploadedPhotoURL = "";

      // 2. If photo selected, upload it with auth token
      if (form.photo) {
        const idToken = await userCred.user.getIdToken();
        const formData = new FormData();
        formData.append("file", form.photo);
        const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${idToken}` },
          body: formData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedPhotoURL = uploadData.url;
        }
      }

      // 3. Update Firebase profile
      await updateProfile(userCred.user, {
        displayName: form.username,
        photoURL: uploadedPhotoURL || "",
      });

      // 4. Create user in backend
      const backendRes = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: userCred.user.uid,
          username: form.username,
          email: form.email,
          role: form.role,
          photoURL: uploadedPhotoURL || "",
        }),
      });

      if (backendRes.status === 409) {
        // User already exists. Ignore and proceed to login or dashboard.
        setError(""); // Optionally clear error
        // Optionally, fetch user info and set as logged in
        const userInfo = await fetchBackendUser(userCred.user.uid);
        setUser(userInfo);
        navigate("/dashboard");
        setLoading(false);
        return;
      }
      if (!backendRes.ok) throw new Error("Backend sync failed");

      const data = await backendRes.json();
      if (data.token) localStorage.setItem("access_token", data.token);

      const userInfo = await fetchBackendUser(userCred.user.uid);
      setUser(userInfo);
      navigate("/dashboard");
    } catch (err) {
      // Error
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // Replace handleGoogleSignup with robust logic from Login
  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await syncUserWithBackend(user);
      const backendUser = await fetchBackendUser(user.uid, await user.getIdToken());
      const userObj = await backendUser.json();
      setUser(userObj);
      navigate("/dashboard");
    } catch (err) {
      // Error
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-6 rounded-2xl shadow-2xl bg-white/90 backdrop-blur-md">
        <h2 className="mb-3 text-3xl font-extrabold text-center text-indigo-700">Sign Up</h2>

        {error && (
          <div className="alert alert-error mb-4 text-sm font-semibold text-red-600 bg-red-100 p-2 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="file-input w-full file-input-bordered"
          />
          {preview && (
            <div className="mt-3 flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500 shadow-md"
              />
            </div>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          >
            <option value="user">User</option>
            <option value="seller">Seller</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-red-500 text-white font-bold text-lg shadow-lg hover:from-indigo-600 hover:to-red-600 transition-all"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-gray-400">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="flex items-center justify-center w-full p-3 rounded-full bg-gradient-to-r from-red-600 to-indigo-500 text-white font-semibold shadow hover:from-red-700 hover:to-indigo-600 transition-all"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5 mr-2"
            alt="Google"
          />
          Continue with Google
        </button>
        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:underline hover:text-red-600 transition"
          >
            Log in here
          </Link>
        </p>
        <div className="mt-4 text-center">
          <span className="text-gray-500 text-xs">Or</span>
        </div>
        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="flex items-center justify-center w-full p-3 mt-2 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold shadow hover:bg-gray-100 transition-all"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5 mr-2"
            alt="Google"
          />
          Continue as Google
        </button>
      </div>
    </div>
  );
}

export default Signup;
