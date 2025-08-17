import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";

function AdRequests({ adRequests, setAdRequests, user }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [myAds, setMyAds] = useState([]);
  const [editAd, setEditAd] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', image: '', description: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNewAdModal, setShowNewAdModal] = useState(false);
  const [newAdForm, setNewAdForm] = useState({ title: '', image: '', description: '' });
  const navigate = useNavigate();

  // Fetch only this seller's ad requests from backend
  useEffect(() => {
    if (!user?._id) {
      setLoading(false);
      setError('User info not loaded.');
      return;
    }
    setLoading(true);
    (async () => {
      try {
        let token = localStorage.getItem("access_token");
        if (auth.currentUser) {
          token = await auth.currentUser.getIdToken();
        }
        const res = await fetch(`${import.meta.env.VITE_API_URL}/banners?seller=${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch ads');
        const data = await res.json();
        setMyAds(data);
        setAdRequests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?._id, setAdRequests]);

  const handleEdit = (ad) => {
    setEditAd(ad);
    setEditForm({ title: ad.title, image: ad.image, description: ad.description });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    setLoading(true);
    setError("");
    try {
      let token = localStorage.getItem("access_token");
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/banners/${editAd._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Failed to update ad");
      const updated = await res.json();
      setMyAds((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
      setAdRequests((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
      setShowEditModal(false);
    } catch (err) {
      setError(err.message || "Failed to update ad");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ad?")) return;
    setLoading(true);
    setError("");
    try {
      let token = localStorage.getItem("access_token");
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/banners/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete ad");
      setMyAds((prev) => prev.filter((a) => a._id !== id));
      setAdRequests((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete ad");
    } finally {
      setLoading(false);
    }
  };

  const handleNewAdChange = (e) => {
    setNewAdForm({ ...newAdForm, [e.target.name]: e.target.value });
  };

  const handleNewAdSubmit = async (e) => {
    e.preventDefault();
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
        body: JSON.stringify({ ...newAdForm, seller: user._id }),
      });
      if (!res.ok) throw new Error("Failed to submit ad request");
      const newAd = await res.json();
      setMyAds((prev) => [...prev, newAd]);
      setAdRequests((prev) => [...prev, newAd]);
      setShowNewAdModal(false);
      setNewAdForm({ title: '', image: '', description: '' });
    } catch (err) {
      setError(err.message || "Failed to submit ad request");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <span className="text-red-600 text-lg">{error}</span>
      </div>
    );
  }

  if (!user?._id) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <span className="text-gray-500 text-lg">Loading user info...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-700 drop-shadow">Advertisement Requests</h2>
        <button
          className="btn btn-primary px-6 py-2 rounded-lg shadow-md text-white bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 transition-all duration-200"
          onClick={() => setShowNewAdModal(true)}
        >
          + New Ad Request
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <table className="table table-zebra w-full text-sm md:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="whitespace-nowrap py-3 px-2">Image</th>
              <th className="py-3 px-2">Description</th>
              <th className="py-3 px-2">Medicine</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400 animate-pulse">
                  Loading ads...
                </td>
              </tr>
            ) : myAds.length > 0 ? (
              myAds.map((ad) => (
                <tr key={ad._id} className="hover:bg-indigo-50 transition">
                  <td className="py-2 px-2"><img src={ad.image} alt="ad" className="w-16 h-16 object-cover rounded" /></td>
                  <td className="py-2 px-2">{ad.description}</td>
                  <td className="py-2 px-2">{ad.title}</td>
                  <td className="py-2 px-2 font-semibold capitalize">
                    {ad.status === 'live' ? (
                      <span className="text-green-600">Live</span>
                    ) : ad.status === 'pending' ? (
                      <span className="text-yellow-600">Pending</span>
                    ) : ad.status === 'rejected' ? (
                      <span className="text-red-600">Rejected</span>
                    ) : (
                      <span>{ad.status || 'Pending'}</span>
                    )}
                  </td>
                  <td className="py-2 px-2">
                    <button className="btn btn-xs btn-warning mr-2" onClick={() => handleEdit(ad)}>Edit</button>
                    <button className="btn btn-xs btn-error" onClick={() => handleDelete(ad._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  No ad requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {error && <div className="mt-4 text-center text-red-600 font-semibold">{error}</div>}

      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit Advertisement</h3>
            <input
              type="text"
              name="title"
              placeholder="Title"
              className="input input-bordered w-full mb-3"
              value={editForm.title}
              onChange={handleEditChange}
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              className="input input-bordered w-full mb-3"
              value={editForm.image}
              onChange={handleEditChange}
            />
            <textarea
              name="description"
              placeholder="Description"
              className="input input-bordered w-full mb-3"
              value={editForm.description}
              onChange={handleEditChange}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-success" onClick={handleEditSave} disabled={loading}>Save</button>
              <button className="btn btn-ghost" onClick={() => setShowEditModal(false)} disabled={loading}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showNewAdModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">New Advertisement Request</h3>
            <form onSubmit={handleNewAdSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                className="input input-bordered w-full mb-3"
                value={newAdForm.title}
                onChange={handleNewAdChange}
                required
              />
              <input
                type="text"
                name="image"
                placeholder="Image URL"
                className="input input-bordered w-full mb-3"
                value={newAdForm.image}
                onChange={handleNewAdChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                className="input input-bordered w-full mb-3"
                value={newAdForm.description}
                onChange={handleNewAdChange}
                required
              />
              <div className="flex justify-end gap-2 mt-4">
                <button className="btn btn-success" type="submit" disabled={loading}>Submit</button>
                <button className="btn btn-ghost" type="button" onClick={() => setShowNewAdModal(false)} disabled={loading}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdRequests;
