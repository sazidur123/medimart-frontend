import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useCategoryName from "../hooks/useCategoryName";

function CategoryDetailsMedicine({ onAddToCart, user }) {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const categoryName = useCategoryName(categoryId);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/medicines/category/${categoryId}`);
        const data = await res.json();
        setMedicines(data);
      } catch {
        setMedicines([]);
      }
      setLoading(false);
    };
    if (categoryId) fetchMedicines();
  }, [categoryId]);

  const handleEyeClick = (medicine) => {
    setSelectedMedicine(medicine);
    setModalOpen(true);
  };

  const handleSelect = (medicine) => {
    if (onAddToCart) onAddToCart(medicine);
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [modalOpen]);

  // Close modal on Escape key
  useEffect(() => {
    if (!modalOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') setModalOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [modalOpen]);


  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-8">
      <div className="flex items-center mb-4">
        <button
          className="btn btn-outline btn-primary flex items-center gap-2 px-3 py-1 rounded-md shadow-sm hover:bg-primary hover:text-white transition-colors"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Back</span>
        </button>
        <h2 className="flex-1 text-2xl sm:text-3xl font-bold text-primary capitalize text-center">
          {categoryName} Medicines
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : medicines.length === 0 ? (
        <div className="text-center text-error">No medicines found in this category.</div>
      ) : (
        <>
          {/* Table for md+ screens */}
          <div className="hidden md:block">
            <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">#</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Image</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Company</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Stock</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Mass Unit</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {medicines.map((medicine, idx) => (
                    <tr key={medicine._id || idx} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
                      <td className="px-3 py-2 whitespace-nowrap"><img src={medicine.image || "/no-image.png"} alt={medicine.name} className="w-12 h-12 object-cover rounded" /></td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{medicine.name}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{categoryName || 'N/A'}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{medicine.company}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-green-700 font-semibold">${medicine.price}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{medicine.stock}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{medicine.massUnit || '-'}</td>
                      <td className="px-3 py-2 whitespace-nowrap flex gap-1">
                        <button className="btn btn-ghost btn-sm" onClick={() => handleEyeClick(medicine)} title="View details">
                          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {user && user.role === 'user' && (
                          <button className="btn btn-outline btn-primary btn-xs ml-2" onClick={() => handleSelect(medicine)}>
                            Select
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Card view for mobile */}
          <div className="md:hidden space-y-4">
            {medicines.map((medicine, idx) => (
              <div key={medicine._id || idx} className="bg-white rounded-lg shadow border border-gray-200 p-4 flex flex-col gap-2">
                <div className="flex items-center gap-4 mb-2">
                  <img src={medicine.image || "/no-image.png"} alt={medicine.name} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <div className="font-bold text-lg text-primary">{medicine.name}</div>
                    <div className="text-xs text-gray-500">{medicine.brand} &bull; {medicine.type}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="bg-gray-100 rounded px-2 py-1">Price: <span className="text-green-700 font-semibold">${medicine.price}</span></span>
                  <span className="bg-gray-100 rounded px-2 py-1">Stock: {medicine.stock}</span>
                  <span className="bg-gray-100 rounded px-2 py-1">Mass: {medicine.massUnit || '-'}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <button className="btn btn-ghost btn-sm" onClick={() => handleEyeClick(medicine)} title="View details">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  {user && user.role === 'user' && (
                    <button className="btn btn-outline btn-primary btn-xs ml-2" onClick={() => handleSelect(medicine)}>
                      Select
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal for viewing medicine details */}
      {modalOpen && selectedMedicine && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-all duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="medicine-modal-title"
          onClick={e => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-md relative animate-fade-in overflow-hidden border border-gray-200"
            onClick={e => e.stopPropagation()}
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
          >
            <button
              className="btn btn-sm btn-circle absolute right-4 top-4 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-primary shadow transition-all"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
              style={{ zIndex: 2 }}
            >✕</button>
            <div className="flex flex-col items-center gap-4 px-6 py-8">
              <div className="w-32 h-32 rounded-xl overflow-hidden shadow-md bg-gray-50 flex items-center justify-center mb-2">
                <img
                  src={selectedMedicine.image || "/no-image.png"}
                  alt={selectedMedicine.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-extrabold text-primary text-center mb-2" id="medicine-modal-title">{selectedMedicine.name}</h3>
              <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-2">
                <div className="font-semibold text-gray-700">Type:</div>
                <div className="text-gray-600">{selectedMedicine.type}</div>
                <div className="font-semibold text-gray-700">Brand:</div>
                <div className="text-gray-600">{selectedMedicine.brand}</div>
                <div className="font-semibold text-gray-700">Price:</div>
                <div className="text-green-700 font-bold">${selectedMedicine.price}</div>
                <div className="font-semibold text-gray-700">Stock:</div>
                <div className="text-gray-600">{selectedMedicine.stock}</div>
                <div className="font-semibold text-gray-700">Description:</div>
                <div className="col-span-1 text-gray-600">{selectedMedicine.description || "N/A"}</div>
              </div>
              <button
                className="btn btn-primary w-full mt-2 py-2 text-base font-semibold rounded-lg shadow-md hover:scale-105 transition-transform"
                onClick={() => {
                  handleSelect(selectedMedicine);
                  setModalOpen(false);
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryDetailsMedicine;
