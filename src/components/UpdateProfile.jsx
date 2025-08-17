import React, { useState, useEffect } from "react";
import { auth } from "../firebase";

const UpdateProfile = ({ user, onUpdate }) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    photoURL: "",
    phone: "",
    address: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      let token = localStorage.getItem("access_token");
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      }
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form), // ✅ now phone & address are included
        }
      );
      if (!res.ok) throw new Error("Failed to update profile");
      const updated = await res.json();
      setSuccess("Profile updated successfully!");
      if (onUpdate) onUpdate(updated);
      setEditing(false);
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <div className="flex-shrink-0">
            <img
              src={form.photoURL || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-36 h-36 rounded-full border-4 border-indigo-500 shadow-md object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800">
              {form.username || "Unknown User"}
            </h2>
            <p className="text-gray-600">{form.email}</p>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold shadow-md hover:from-indigo-600 hover:to-pink-600 transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Success / Error Messages */}
        {error && (
          <div className="mb-4 text-red-600 text-center font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-green-600 text-center font-medium">
            {success}
          </div>
        )}

        {/* Info or Edit Form */}
        {!editing ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold text-gray-700">Phone</p>
              <p className="text-gray-600">{form.phone || "Not Provided"}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold text-gray-700">Address</p>
              <p className="text-gray-600">{form.address || "Not Provided"}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Photo URL</label>
              <input
                type="text"
                name="photoURL"
                value={form.photoURL}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:from-indigo-600 hover:to-pink-600 transition-all"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 py-2 rounded-full border border-gray-400 text-gray-700 font-bold text-lg hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateProfile;
