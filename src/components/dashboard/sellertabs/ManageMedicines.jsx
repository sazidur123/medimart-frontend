
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { auth } from "../../../firebase";

function ManageMedicines({ medicines, setMedicines, user, categories, setActiveTab }) {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('dashboard.manageMedicines', 'Manage Medicines - MediMart');
  }, [t]);
  //modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    generic: '',
    description: '',
    image: '',
    imageFile: null,
    category: '',
    company: '',
    massUnit: '',
    price: '',
    discount: 0,
    stock: '',
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");
  const fileInputRef = useRef();

  const openAddModal = () => {
    setShowAddModal(true);
    setAddForm({
      name: '', generic: '', description: '', image: '', imageFile: null, category: '', company: '', massUnit: '', price: '', discount: 0, stock: ''
    });
    setAddError("");
    setAddSuccess("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const closeAddModal = () => {
    setShowAddModal(false);
    setAddError("");
    setAddSuccess("");
    setAddForm({
      name: '', generic: '', description: '', image: '', imageFile: null, category: '', company: '', massUnit: '', price: '', discount: 0, stock: ''
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    if (!addForm.name.trim() || !addForm.price || !addForm.category) {
      setAddError("Name, price, and category are required.");
      setAddSuccess("");
      return;
    }
    setAddLoading(true);
    setAddError("");
    setAddSuccess("");
    try {
      let token = localStorage.getItem("access_token");
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      }
      let imageUrl = addForm.image;
      if (addForm.imageFile) {
        // Upload image file
        const data = new FormData();
        data.append("image", addForm.imageFile);
        const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        });
        const img = await uploadRes.json();
        imageUrl = img.url || img.path || imageUrl;
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/medicines`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...addForm, image: imageUrl, seller: user._id }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to add medicine");
      }
      const newMed = await res.json();
      setMyMeds((prev) => [...prev, newMed]);
      setMedicines((prev) => [...prev, newMed]);
      setAddSuccess("Medicine added successfully!");
      toast.success("Medicine added!", { position: "top-right" });
      setAddForm({
        name: '', generic: '', description: '', brand: '', type: '', image: '', imageFile: null, category: '', company: '', massUnit: '', price: '', discount: 0, stock: ''
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setAddError(err.message || "Failed to add medicine");
      setAddSuccess("");
      toast.error(err.message || "Failed to add medicine", { position: "top-right" });
    } finally {
      setAddLoading(false);
    }
  };
  const [editMed, setEditMed] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    generic: '',
    description: '',
    type: '',
    image: '',
    category: '',
    company: '',
    massUnit: '',
    price: '',
    discount: 0,
    stock: '',
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // Open edit modal
  const openEditModal = (med) => {
    setEditMed(med);
    setEditForm({
      name: med.name || '',
      generic: med.generic || '',
      description: med.description || '',
      image: med.image || '',
      category: med.category || '',
      company: med.company || '',
      massUnit: med.massUnit || '',
      price: med.price || '',
      discount: med.discount || 0,
      stock: med.stock || '',
    });
    setEditError("");
  };
  const closeEditModal = () => {
    setEditMed(null);
    setEditForm({
      name: '', generic: '', description: '', brand: '', type: '', image: '', category: '', company: '', massUnit: '', price: '', discount: 0, stock: ''
    });
    setEditError("");
  };

  // Update medicine
  const handleUpdateMedicine = async () => {
    if (!editForm.name.trim() || !editForm.price || !editForm.category) {
      setEditError("Name, price, and category are required.");
      return;
    }
    setEditLoading(true);
    setEditError("");
    try {
      let token = localStorage.getItem("access_token");
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/medicines/${editMed._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to update medicine");
      }
      const updated = await res.json();
      setMyMeds((prev) => prev.map((m) => (m._id === updated._id ? updated : m)));
      setMedicines((prev) => prev.map((m) => (m._id === updated._id ? updated : m)));
      closeEditModal();
      toast.success("Medicine updated!", { position: "top-right" });
    } catch (err) {
      setEditError(err.message || "Failed to update medicine");
      toast.error(err.message || "Failed to update medicine", { position: "top-right" });
    } finally {
      setEditLoading(false);
    }
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [myMeds, setMyMeds] = useState([]);

  // Fetch only this seller's medicines from backend
  useEffect(() => {
    if (!user?._id) return;
    setLoading(true);
    (async () => {
      let token = localStorage.getItem("access_token");
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/medicines?seller=${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMyMeds(data);
      setMedicines(data);
      setLoading(false);
    })();
  }, [user?._id, setMedicines]);



  return (
    <div className="w-full max-w-6xl mx-auto p-2 sm:p-4">
      <h2 className="text-3xl font-extrabold mb-6 text-center sm:text-left bg-gradient-to-r from-indigo-600 to-blue-500 text-transparent bg-clip-text drop-shadow">
        Manage Medicines
      </h2>
      <button
        className="btn btn-primary mb-4 w-full sm:w-auto"
        onClick={openAddModal}
        style={{ zIndex: 100 }}
      >
        Add Medicine
      </button>
      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-2">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-lg animate-fade-in">
            <h3 className="text-xl font-semibold mb-4 text-center">Add Medicine</h3>
            {addError && <div className="mb-2 text-red-600 text-center">{addError}</div>}
            {addSuccess && <div className="mb-2 text-green-600 text-center">{addSuccess}</div>}
            <form onSubmit={handleAddMedicine} className="grid grid-cols-1 gap-3">
              <input
                type="text"
                placeholder="Item Name"
                className="input input-bordered w-full"
                value={addForm.name}
                onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                disabled={addLoading}
              />
            <input
              type="text"
              placeholder="Generic Name"
              className="input input-bordered w-full"
              value={addForm.generic}
              onChange={e => setAddForm({ ...addForm, generic: e.target.value })}
              disabled={addLoading}
            />
            <input
              type="text"
              placeholder="Short Description"
              className="input input-bordered w-full"
              value={addForm.description}
              onChange={e => setAddForm({ ...addForm, description: e.target.value })}
              disabled={addLoading}
            />
              <div className="flex flex-col sm:flex-row gap-2 items-center">
                <label className="block font-semibold w-full sm:w-1/3 text-left sm:text-right pr-2">Image (Upload or URL)</label>
                <div className="w-full sm:w-2/3 flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full"
                    ref={fileInputRef}
                    onChange={e => setAddForm(f => ({ ...f, imageFile: e.target.files[0] }))}
                    disabled={addLoading}
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    className="input input-bordered w-full"
                    value={addForm.image}
                    onChange={e => setAddForm(f => ({ ...f, image: e.target.value }))}
                    disabled={addLoading}
                  />
                </div>
              </div>
              <select
                className="input input-bordered w-full"
                value={addForm.category}
                onChange={e => setAddForm({ ...addForm, category: e.target.value })}
                disabled={addLoading || !Array.isArray(categories) || categories.length === 0}
              >
                <option value="">{!categories || categories.length === 0 ? "No categories available" : "Select Category"}</option>
                {Array.isArray(categories) && categories.length > 0 &&
                  categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
              </select>
              <input
                type="text"
                placeholder="Company"
                className="input input-bordered w-full"
                value={addForm.company}
                onChange={e => setAddForm({ ...addForm, company: e.target.value })}
                disabled={addLoading}
              />
              <input
                type="text"
                placeholder="Mass Unit"
                className="input input-bordered w-full"
                value={addForm.massUnit}
                onChange={e => setAddForm({ ...addForm, massUnit: e.target.value })}
                disabled={addLoading}
              />
              <input
                type="number"
                placeholder="Stock"
                className="input input-bordered w-full"
                value={addForm.stock}
                onChange={e => setAddForm({ ...addForm, stock: e.target.value })}
                min={0}
                disabled={addLoading}
              />
              <input
                type="number"
                placeholder="Price"
                className="input input-bordered w-full"
                value={addForm.price}
                onChange={e => setAddForm({ ...addForm, price: e.target.value })}
                disabled={addLoading}
              />
              <input
                type="number"
                placeholder="Discount %"
                className="input input-bordered w-full"
                value={addForm.discount}
                onChange={e => setAddForm({ ...addForm, discount: e.target.value })}
                min={0}
                max={100}
                disabled={addLoading}
              />
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-2">
                <button
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md w-full sm:w-auto"
                  type="submit"
                  disabled={addLoading || !Array.isArray(categories) || categories.length === 0}
                >
                  {addLoading ? "Adding..." : "Add"}
                </button>
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 w-full sm:w-auto"
                  type="button"
                  onClick={closeAddModal}
                  disabled={addLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow bg-white border border-gray-200">
        <table className="min-w-[600px] w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {myMeds.filter(m => m.seller === user._id || (m.seller && m.seller._id === user._id)).length > 0 ? (
              myMeds.filter(m => m.seller === user._id || (m.seller && m.seller._id === user._id)).map((m) => (
                <tr key={m._id} className="hover:bg-blue-50 transition">
                  <td className="px-4 py-3 font-semibold max-w-[160px] truncate" title={m.name}>{m.name}</td>
                  <td className="px-4 py-3">${m.price}</td>
                  <td className="px-4 py-3">{m.stock ?? "-"}</td>
                  <td className="px-4 py-3">
                    {
                      (() => {
                        const cat = categories.find((c) => c._id === m.category);
                        if (cat && typeof cat.name === 'string') return cat.name;
                        if (m.category && typeof m.category === 'object' && m.category.name) return m.category.name;
                        return typeof m.category === 'string' ? m.category : '';
                      })()
                    }
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button className="btn btn-xs btn-warning" onClick={() => openEditModal(m)}>Edit</button>
                    <button className="btn btn-xs btn-error" onClick={() => {/* TODO: handle delete */}}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">No medicines found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Mobile Card Layout */}
      <div className="md:hidden flex flex-col gap-4">
        {myMeds.filter(m => m.seller === user._id || (m.seller && m.seller._id === user._id)).length > 0 ? (
          myMeds.filter(m => m.seller === user._id || (m.seller && m.seller._id === user._id)).map((m) => (
            <div key={m._id} className="bg-white rounded-lg border border-gray-200 shadow p-4 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-base text-gray-800 truncate" title={m.name}>{m.name}</div>
                  <div className="text-xs text-gray-500">
                    {
                      (() => {
                        const cat = categories.find((c) => c._id === m.category);
                        if (cat && typeof cat.name === 'string') return cat.name;
                        if (m.category && typeof m.category === 'object' && m.category.name) return m.category.name;
                        return typeof m.category === 'string' ? m.category : '';
                      })()
                    }
                  </div>
                  <div className="text-sm font-bold text-indigo-700 mt-1">${m.price}</div>
                  <div className="text-xs text-gray-500 mt-1">Stock: {m.stock ?? "-"}</div>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <button className="btn btn-xs btn-warning w-full" onClick={() => openEditModal(m)}>Edit</button>
                <button className="btn btn-xs btn-error w-full" onClick={() => {/* TODO: handle delete */}}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 bg-white rounded-lg border border-gray-200 shadow">No medicines found.</div>
        )}
      </div>
      {/* Edit Medicine Modal */}
      {editMed && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-2">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-md animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">Edit Medicine</h3>
            {editError && <div className="mb-2 text-red-600">{editError}</div>}
            <input
              type="text"
              placeholder="Name"
              className="input input-bordered w-full mb-3"
              value={editForm.name}
              onChange={e => setEditForm({ ...editForm, name: e.target.value })}
              disabled={editLoading}
            />
            <input
              type="text"
              placeholder="Generic Name"
              className="input input-bordered w-full mb-3"
              value={editForm.generic}
              onChange={e => setEditForm({ ...editForm, generic: e.target.value })}
              disabled={editLoading}
            />
            <input
              type="text"
              placeholder="Short Description"
              className="input input-bordered w-full mb-3"
              value={editForm.description}
              onChange={e => setEditForm({ ...editForm, description: e.target.value })}
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
            <select
              className="input input-bordered w-full mb-3"
              value={editForm.category}
              onChange={e => setEditForm({ ...editForm, category: e.target.value })}
              disabled={editLoading || !Array.isArray(categories) || categories.length === 0}
            >
              <option value="">{!categories || categories.length === 0 ? "No categories available" : "Select Category"}</option>
              {Array.isArray(categories) && categories.length > 0 &&
                categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
            </select>
            <input
              type="text"
              placeholder="Company"
              className="input input-bordered w-full mb-3"
              value={editForm.company}
              onChange={e => setEditForm({ ...editForm, company: e.target.value })}
              disabled={editLoading}
            />
            <input
              type="text"
              placeholder="Mass Unit"
              className="input input-bordered w-full mb-3"
              value={editForm.massUnit}
              onChange={e => setEditForm({ ...editForm, massUnit: e.target.value })}
              disabled={editLoading}
            />
            <input
              type="number"
              placeholder="Stock"
              className="input input-bordered w-full mb-3"
              value={editForm.stock}
              onChange={e => setEditForm({ ...editForm, stock: e.target.value })}
              min={0}
              disabled={editLoading}
            />
            <input
              type="number"
              placeholder="Price"
              className="input input-bordered w-full mb-3"
              value={editForm.price}
              onChange={e => setEditForm({ ...editForm, price: e.target.value })}
              disabled={editLoading}
            />
            <input
              type="number"
              placeholder="Discount %"
              className="input input-bordered w-full mb-4"
              value={editForm.discount}
              onChange={e => setEditForm({ ...editForm, discount: e.target.value })}
              min={0}
              max={100}
              disabled={editLoading}
            />
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md w-full sm:w-auto"
                onClick={handleUpdateMedicine}
                disabled={editLoading}
              >
                {editLoading ? "Updating..." : "Update"}
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

export default ManageMedicines;
