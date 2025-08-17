import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { auth } from "../../../firebase";

function ManageUsers({ users, setUsers, showSellerRequests }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users || []);
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('dashboard.manageUsers', 'Manage Users - MediMart');
  }, [t]);

  // Suggestions for auto search
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }
    const term = searchTerm.toLowerCase().trim();
    const matched = (users || []).filter(
      (user) =>
        user?.username?.toLowerCase().includes(term) ||
        user?.email?.toLowerCase().includes(term)
    );
    // Show up to 5 suggestions
    setSuggestions(matched.slice(0, 5));
  }, [searchTerm, users]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users || []);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    const matched = (users || []).filter(
      (user) =>
        user?.username?.toLowerCase().includes(term) ||
        user?.email?.toLowerCase().includes(term)
    );

    setFilteredUsers(matched);
  }, [searchTerm, users]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      let token = localStorage.getItem("access_token");
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      }
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userId}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!res.ok) {
        toast.error("Failed to update user role.", { position: "top-right" });
        throw new Error("Failed to update role");
      }

      const updatedUser = await res.json();

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === userId ? updatedUser : u))
      );

      setFilteredUsers((prevFiltered) =>
        prevFiltered.map((u) => (u._id === userId ? updatedUser : u))
      );
      toast.success("User role updated!", { position: "top-right" });
    } catch (error) {
      // Error updating role
      toast.error(error.message || "Failed to update user role.", { position: "top-right" });
    }
  };

  // Admin: Approve seller request
  const handleApproveSeller = async (userId) => {
    try {
      let token = localStorage.getItem("access_token");
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      }
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userId}/approve-seller`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to approve seller request");
      const updatedUser = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? updatedUser : u))
      );
      setFilteredUsers((prev) =>
        prev.map((u) => (u._id === userId ? updatedUser : u))
      );
    } catch (err) {
      alert(err.message || "Failed to approve seller request");
    }
  };

  // Admin: Reject seller request
  const handleRejectSeller = async (userId) => {
    try {
      let token = localStorage.getItem("access_token");
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      }
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userId}/reject-seller`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to reject seller request");
      const updatedUser = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? updatedUser : u))
      );
      setFilteredUsers((prev) =>
        prev.map((u) => (u._id === userId ? updatedUser : u))
      );
    } catch (err) {
      alert(err.message || "Failed to reject seller request");
    }
  };

  const handleResetSearch = () => {
    setSearchTerm("");
    setFilteredUsers(users || []);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-2 sm:p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 drop-shadow text-center sm:text-left">
          Manage Users
        </h2>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by name or email"
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 bg-white border border-gray-200 rounded shadow z-10 mt-1 max-h-48 overflow-y-auto">
              {suggestions.map((user) => (
                <li
                  key={user._id}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm truncate"
                  onClick={() => setSearchTerm(user.username)}
                >
                  {user.username}{" "}
                  <span className="text-gray-400">({user.email})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg shadow bg-white border border-gray-200">
        <table className="min-w-[600px] w-full text-xs sm:text-sm md:text-base text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-blue-50 transition">
                <td
                  className="px-4 py-3 font-semibold max-w-[160px] truncate"
                  title={user.username}
                >
                  {user.username}
                </td>
                <td
                  className="px-4 py-3 max-w-[200px] truncate"
                  title={user.email}
                >
                  {user.email}
                </td>
                <td className="px-4 py-3 capitalize">{user.role}</td>
                <td className="px-4 py-3 space-x-2">
                  {/* Seller request actions */}
                  {user.sellerRequested && user.role === "user" && (
                    <>
                      <button
                        className="btn btn-xs btn-success"
                        onClick={() => handleApproveSeller(user._id)}
                      >
                        Approve Seller
                      </button>
                      <button
                        className="btn btn-xs btn-error"
                        onClick={() => handleRejectSeller(user._id)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {/* Role change actions */}
                  {user.role !== "admin" && (
                    <>
                      {user.role === "user" && (
                        <button
                          className="btn btn-xs btn-info"
                          onClick={() => handleRoleChange(user._id, "seller")}
                        >
                          Make Seller
                        </button>
                      )}
                      {user.role === "seller" && (
                        <button
                          className="btn btn-xs btn-warning"
                          onClick={() => handleRoleChange(user._id, "user")}
                        >
                          Make User
                        </button>
                      )}
                    </>
                  )}
                  {/* User can request seller if not already requested or seller */}
                  {/* This button should only be visible in the user's own profile, not in admin manage users */}
                  {/* REMOVE the following block from admin manage users */}
                  {/*
                  {!user.sellerRequested && user.role === 'user' && (
                    <button className="btn btn-xs btn-outline" onClick={() => handleRequestSeller(user._id)}>Request Seller</button>
                  )}
                  */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageUsers;
