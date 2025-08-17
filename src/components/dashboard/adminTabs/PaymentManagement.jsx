

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function PaymentManagement() {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('dashboard.paymentManagement', 'Payment Management - MediMart');
  }, [t]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/adminPaymentRequests`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load payment requests");
        setLoading(false);
      });
  }, []);

  const handleAccept = async (id) => {
    setRequests((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status: "accepted" } : r))
    );
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/adminPaymentRequests/${id}/accept`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
    } catch {}
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="w-full max-w-5xl mx-auto p-2 sm:p-4 md:p-8">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-gray-800 drop-shadow text-center sm:text-left">
        Admin Payment Requests
      </h2>
      <div className="overflow-x-auto rounded-lg shadow bg-white border border-gray-200">
        <table className="min-w-[600px] w-full text-xs sm:text-sm md:text-base text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Seller</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r._id} className="border-b hover:bg-gray-50 transition duration-200">
                <td className="px-4 py-3 max-w-[180px] truncate" title={r.sellerPayment?.seller?.email || r.sellerPayment?.seller?._id || "-"}>
                  {r.sellerPayment?.seller?.email || r.sellerPayment?.seller?._id || "-"}
                </td>
                <td className="px-4 py-3">
                  {r.sellerPayment?.amount?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || "-"}
                </td>
                <td className="px-4 py-3">
                  {r.sellerPayment?.invoice?._id || "-"}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${r.status === "accepted" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {r.status === "accepted" ? "paid" : r.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}
                </td>
                <td className="px-4 py-3">
                  {r.status === "pending" && (
                    <button
                      onClick={() => handleAccept(r._id)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md transition"
                    >
                      Accept
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentManagement;
