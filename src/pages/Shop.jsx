import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

// Dummy API endpoint for medicines
// Replace with your real backend endpoint
const MEDICINES_API = `${import.meta.env.VITE_API_URL}/medicines`;

function Shop({ onAddToCart }) {
  const { t } = useTranslation();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sort, setSort] = useState("price_asc"); // NEW: sorting state

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const res = await fetch(MEDICINES_API);
        const data = await res.json();
        setMedicines(data);
      } catch (err) {
        setMedicines([]);
      }
      setLoading(false);
    };
    fetchMedicines();
  }, []);

  // Sorting logic
  const sortedMedicines = [...medicines].sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    return 0;
  });

  const handleEyeClick = (medicine) => {
    setSelectedMedicine(medicine);
    setModalOpen(true);
  };

  useEffect(() => {
    document.title = t('shop.title', 'Shop - MediMart');
  }, [t]);

  const handleSelect = (medicine) => {
    if (onAddToCart) {
      onAddToCart(medicine);
      toast.success(`${medicine.name} added to cart!`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <h2 className="text-3xl font-bold mb-6 text-primary">Shop Medicines</h2>

      {/* Sorting controls */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <label className="font-semibold">Sort by:</label>
        <select
          className="select select-bordered select-sm w-auto"
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : sortedMedicines.length === 0 ? (
        <div className="text-center text-error">No medicines found.</div>
      ) : (
        <>
          {/* Card grid for mobile/tablet, table for desktop */}
          <div className="block md:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sortedMedicines.map((medicine, idx) => (
                <div key={medicine._id || idx} className="card bg-base-100 shadow-md flex flex-col h-full">
                  <div className="flex flex-col items-center p-4">
                    <img
                      src={medicine.image || "/no-image.png"}
                      alt={medicine.name}
                      className="w-24 h-24 object-cover rounded mb-2"
                      loading="lazy"
                    />
                    <h3 className="font-bold text-lg text-center mb-1">{medicine.name}</h3>
                    <div className="text-xs text-gray-500 mb-1">{medicine.brand}</div>
                    <div className="text-xs text-gray-400 mb-1">
                      Category: {medicine.category?.name || medicine.category || 'N/A'}
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center mb-2">
                      <span className="badge badge-info">${medicine.price}</span>
                      <span className="badge badge-success">Stock: {medicine.stock}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        onClick={() => handleEyeClick(medicine)}
                        title="View details"
                      >
                        <svg
                          className="w-5 h-5 text-primary"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-xs"
                        onClick={() => handleSelect(medicine)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Table for desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {sortedMedicines.map((medicine, idx) => (
                  <tr key={medicine._id || idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <img
                        src={medicine.image || "/no-image.png"}
                        alt={medicine.name}
                        className="w-12 h-12 object-cover rounded"
                        loading="lazy"
                      />
                    </td>
                    <td>{medicine.name}</td>
                    <td>{medicine.company}</td>
                    <td>{medicine.category?.name || medicine.category || 'N/A'}</td>
                    <td>${medicine.price}</td>
                    <td>{medicine.stock}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm cursor-pointer"
                        onClick={() => handleEyeClick(medicine)}
                        title="View details"
                      >
                        <svg
                          className="w-5 h-5 text-primary"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-primary btn-xs ml-2"
                        onClick={() => handleSelect(medicine)}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              type="button"
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
                  loading="lazy"
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
                type="button"
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

export default Shop;
