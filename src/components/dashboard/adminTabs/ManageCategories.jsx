import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { auth } from "../../../firebase";

function ManageCategories({ categories, setCategories }) {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: "", image: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editCategory, setEditCategory] = useState(null); // category being edited
  const [editForm, setEditForm] = useState({ name: "", image: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  // Edit category via backend
  const handleEditCategory = (cat) => {
    setEditCategory(cat);
    setEditForm({ name: cat.name, image: cat.image });
    setEditError("");
  };

  const handleUpdateCategory = async () => {
    if (!editForm.name || !editForm.image) return;
    setEditLoading(true);
    setEditError("");
    try {
      let token = localStorage.getItem("access_token");
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/categories/${editCategory._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Failed to update category");
      const updated = await res.json();
      setCategories((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
      setEditCategory(null);
    } catch (err) {
      setEditError(err.message || "Failed to update category");
    } finally {
      setEditLoading(false);
    }
  };
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('dashboard.manageCategories', 'Manage Categories - MediMart');
  }, [t]);

  // Add category via backend
  const handleAddCategory = async () => {
    if (!categoryForm.name || !categoryForm.image) return;
    setLoading(true);
    setError("");
    try {
      let token = localStorage.getItem("access_token");
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryForm),
      });
      if (!res.ok) throw new Error("Failed to add category");
      const newCategory = await res.json();
      setCategories((prev) => [...prev, newCategory]);
      setShowAddCategory(false);
      setCategoryForm({ name: "", image: "" });
    } catch (err) {
      setError(err.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((c) => c._id !== id));
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-2 sm:p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 drop-shadow text-center sm:text-left">
          <span className="inline-block bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text">Manage Categories</span>
        </h2>
        <button
          className="px-6 py-2 rounded-lg shadow-md text-white bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 transition-all duration-200 w-full sm:w-auto"
          onClick={() => setShowAddCategory(true)}
        >
          + Add Category
        </button>
      </div>
      {/* Responsive Table/Card Layout */}
      <div className="rounded-lg shadow bg-white border border-gray-200">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-[600px] w-full text-xs sm:text-sm md:text-base text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-blue-50 transition">
                  <td
                    className="px-4 py-3 font-semibold max-w-[160px] truncate"
                    title={cat.name}
                  >
                    {cat.name}
                  </td>
                  <td className="px-4 py-3">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-12 h-12 object-contain rounded border"
                    />
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      className="btn btn-xs btn-primary"
                      onClick={() => handleEditCategory(cat)}
                    >Edit</button>
                    <button className="btn btn-xs btn-error">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Card Layout */}
        <div className="md:hidden flex flex-col gap-4 p-2">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-gray-50 rounded-lg border border-gray-200 shadow p-4 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-12 h-12 object-contain rounded border flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="font-semibold text-base text-gray-800 truncate" title={cat.name}>{cat.name}</div>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  className="btn btn-xs btn-primary w-1/2"
                  onClick={() => handleEditCategory(cat)}
                >Edit</button>
                <button className="btn btn-xs btn-error w-1/2">Delete</button>
              </div>
            </div>
          ))}
        </div>

      {/* Edit Category Modal (always rendered at root of component) */}
      {editCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-2">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-md animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">Edit Category</h3>
            {editError && <div className="mb-2 text-red-600">{editError}</div>}
            <input
              type="text"
              placeholder="Name"
              className="input input-bordered w-full mb-3"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              disabled={editLoading}
            />
            <input
              type="text"
              placeholder="Image URL"
              className="input input-bordered w-full mb-4"
              value={editForm.image}
              onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
              disabled={editLoading}
            />
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md w-full sm:w-auto"
                onClick={handleUpdateCategory}
                disabled={editLoading}
              >
                {editLoading ? "Updating..." : "Update"}
              </button>
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 w-full sm:w-auto"
                onClick={() => setEditCategory(null)}
                disabled={editLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-2">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-md animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">Add Category</h3>
            {error && <div className="mb-2 text-red-600">{error}</div>}
            <input
              type="text"
              placeholder="Name"
              className="input input-bordered w-full mb-3"
              value={categoryForm.name}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, name: e.target.value })
              }
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Image URL"
              className="input input-bordered w-full mb-4"
              value={categoryForm.image}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, image: e.target.value })
              }
              disabled={loading}
            />
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md w-full sm:w-auto"
                onClick={handleAddCategory}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add"}
              </button>
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 w-full sm:w-auto"
                onClick={() => setShowAddCategory(false)}
                disabled={loading}
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

export default ManageCategories;
