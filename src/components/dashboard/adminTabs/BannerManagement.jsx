import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { auth } from "../../../firebase";

function BannerManagement({ banners, setBanners, currentUserId }) {
  const [showAddBanner, setShowAddBanner] = useState(false);
  const [bannerForm, setBannerForm] = useState({ title: "", image: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('dashboard.bannerManagement', 'Banner Management - MediMart');
  }, [t]);

  // Admin adds a new banner
  const handleAddBanner = async () => {
    if (!bannerForm.title || !bannerForm.image || !bannerForm.description) return;
    setLoading(true);
    setError("");
    try {
      let token = localStorage.getItem("access_token");
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/banners`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bannerForm),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to add banner");
      }
      const newBanner = await res.json();
      setBanners((prev) => [...prev, newBanner]);
      setShowAddBanner(false);
      setBannerForm({ title: "", image: "", description: "" });
    } catch (err) {
      setError(err.message || "Failed to add banner");
    } finally {
      setLoading(false);
    }
  };

  // Admin approves a seller ad request
  const handleApprove = async (id) => {
    try {
      let token = localStorage.getItem("access_token");
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/banners/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to approve banner");
      const updated = await res.json();
      setBanners((prev) => prev.map((b) => (b._id === id ? updated : b)));
    } catch (err) {
      alert(err.message || "Failed to approve banner");
    }
  };

  // Admin declines a seller ad request
  // Admin deletes a banner (only if added by admin)
  const [deleteBannerId, setDeleteBannerId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const handleDeleteBanner = (id) => {
    setDeleteBannerId(id);
  };
  const confirmDeleteBanner = async () => {
    if (!deleteBannerId) return;
    setDeleteLoading(true);
    try {
      let token = localStorage.getItem("access_token");
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/banners/${deleteBannerId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete banner");
      setBanners((prev) => prev.filter((b) => b._id !== deleteBannerId));
      toast.success("Banner deleted!", { position: "top-right" });
      setDeleteBannerId(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete banner", { position: "top-right" });
    } finally {
      setDeleteLoading(false);
    }
  };
  const cancelDeleteBanner = () => {
    setDeleteBannerId(null);
  };
  const handleDecline = async (id) => {
    try {
      let token = localStorage.getItem("access_token");
if (auth.currentUser) {
  token = await auth.currentUser.getIdToken();
}
const res = await fetch(`${import.meta.env.VITE_API_URL}/banners/${id}`, {
  method: "DELETE",
  headers: { Authorization: `Bearer ${token}` },
});
if (!res.ok) throw new Error("Failed to decline banner");
setBanners((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert(err.message || "Failed to decline banner");
    }
  };

  // Admin edits a banner (only if added by admin)
  const [editBannerId, setEditBannerId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", image: "", description: "" });
  const [editLoading, setEditLoading] = useState(false);

  const openEditModal = (banner) => {
    setEditBannerId(banner._id);
    setEditForm({
      title: banner.title || "",
      image: banner.image || "",
      description: banner.description || "",
    });
  };

  const closeEditModal = () => {
    setEditBannerId(null);
    setEditForm({ title: "", image: "", description: "" });
  };

  const handleEditBanner = async () => {
    if (!editForm.title || !editForm.image || !editForm.description) return;
    setEditLoading(true);
    try {
      let token = localStorage.getItem("access_token");
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/banners/${editBannerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      if (res.status === 403) {
        toast.error("You do not have permission to edit this banner.", { position: "top-right" });
        setEditLoading(false);
        return;
      }
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to edit banner");
      }
      const updated = await res.json();
      setBanners((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
      closeEditModal();
    } catch (err) {
      toast.error(err.message || "Failed to edit banner", { position: "top-right" });
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-2 sm:p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Banner Advertise</h2>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"
        onClick={() => setShowAddBanner(true)}
      >
        Add Banner
      </button>
      {/* Responsive Table/Card Layout */}
      <div className="rounded-lg shadow">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Seller</th>
                <th className="px-4 py-3">Slide</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((b) => (
                <tr
                  key={b._id}
                  className="border-b hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-4 py-2">{b.title}</td>
                  <td className="px-4 py-2">
                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-14 h-14 rounded object-cover"
                    />
                  </td>
                  <td className="px-4 py-2">{b.description}</td>
                  <td className="px-4 py-2">{b.seller ? (b.seller.username || b.seller.email || "-") : "-"}</td>
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={b.slide}
                      onChange={() => handleApprove(b._id)}
                      disabled={!b.seller}
                    />
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    {/* Show Approve/Decline for seller requests (slide: false, seller set) */}
                {b.seller && !b.slide && (
                  <>
                    <button
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
                      onClick={() => handleApprove(b._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                      onClick={() => handleDecline(b._id)}
                    >
                      Decline
                    </button>
                  </>
                )}
                {/* Edit and Delete buttons for all banners (admin can edit/delete any) */}
                <button
                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs"
                  onClick={() => openEditModal(b)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                  onClick={() => handleDeleteBanner(b._id)}
                >
                  Delete
                </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Card Layout */}
        <div className="md:hidden flex flex-col gap-4">
          {banners.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-14 h-14 rounded object-cover flex-shrink-0"
                />
                <div>
                  <div className="font-semibold text-base text-gray-800">{b.title}</div>
                  <div className="text-xs text-gray-500">{b.seller ? (b.seller.username || b.seller.email || "-") : "-"}</div>
                </div>
              </div>
              <div className="text-sm text-gray-700 mt-1">{b.description}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-medium text-gray-600">Slide:</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={b.slide}
                  onChange={() => handleApprove(b._id)}
                  disabled={!b.seller}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {b.seller && !b.slide && (
                  <>
                    <button
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
                      onClick={() => handleApprove(b._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                      onClick={() => handleDecline(b._id)}
                    >
                      Decline
                    </button>
                  </>
                )}
                {/* Edit and Delete buttons for all banners (admin can edit/delete any) */}
                <button
                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs"
                  onClick={() => openEditModal(b)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                  onClick={() => handleDeleteBanner(b._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Delete Banner Confirmation Modal */}
      {deleteBannerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2 py-4">
          <div
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col animate-fade-in"
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
          >
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mr-3">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete Banner</h3>
            </div>
            <p className="mb-6 text-gray-700 text-base sm:text-lg">Are you sure you want to delete this banner? This action cannot be undone.</p>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-4">
              <button
                className="w-full sm:w-auto px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 transition"
                onClick={cancelDeleteBanner}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-sm transition"
                onClick={confirmDeleteBanner}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Banner Modal */}
      {editBannerId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-2">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-md animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">Edit Banner</h3>
            <input
              type="text"
              placeholder="Banner Title"
              className="input input-bordered w-full mb-3"
              value={editForm.title}
              onChange={e => setEditForm({ ...editForm, title: e.target.value })}
              disabled={editLoading}
            />
            <input
              type="text"
              placeholder="Image URL"
              className="input input-bordered w-full mb-3"
              value={editForm.image}
              onChange={e => setEditForm({ ...editForm, image: e.target.value })}
              disabled={editLoading}
            />
            <textarea
              placeholder="Description"
              className="input input-bordered w-full mb-4 min-h-[80px]"
              value={editForm.description}
              onChange={e => setEditForm({ ...editForm, description: e.target.value })}
              disabled={editLoading}
            />
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md w-full sm:w-auto"
                onClick={handleEditBanner}
                disabled={editLoading}
              >
                {editLoading ? "Saving..." : "Save"}
              </button>
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 w-full sm:w-auto"
                onClick={closeEditModal}
                disabled={editLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

      )}
    </div>
  );
}

export default BannerManagement;
