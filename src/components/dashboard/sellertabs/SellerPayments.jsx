import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase";

function SellerPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    let token = localStorage.getItem("access_token");
    if (auth.currentUser) {
      token = await auth.currentUser.getIdToken();
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/sellerpayments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch payments: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        // Unexpected response format: payments data is not an array.
        throw new Error("Unexpected response format: payments data is not an array.");
      }
      // Only show payments for medicines added by the current seller
      const user = JSON.parse(localStorage.getItem("user"));
      const sellerPayments = data.map((sp) => {
        const items = sp.invoice?.items || [];
        const filtered = items.filter(item => {
          // item.product.seller can be string or object
          if (!item.product?.seller || !user?._id) {
            return false;
          }
          if (typeof item.product.seller === 'string') {
            return item.product.seller === user._id;
          }
          if (typeof item.product.seller === 'object' && item.product.seller._id) {
            return item.product.seller._id === user._id;
          }
          return false;
        });
        return filtered.map((item) => ({
          medicine: item.product?.name || '-',
          buyer: sp.invoice?.user?.username || '-',
          quantity: item.quantity || '-',
          total: (item.product?.price && item.quantity) ? (item.product.price * item.quantity).toFixed(2) : '-',
          status: sp.status && sp.status.toLowerCase() === 'paid' ? 'Paid' : 'Pending',
          date: sp.createdAt ? new Date(sp.createdAt).toLocaleDateString() : '-',
        }));
      }).flat();
      // ...existing code...
      setPayments(sellerPayments);
    } catch (error) {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 text-center">Payment History</h2>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center text-gray-500 py-8">Payments not found.</div>
      ) : (
        <>
          {/* Desktop/tablet: Table view */}
          <div className="hidden md:block">
            <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Medicine Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Buyer Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total Price</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {payments.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.medicine}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.buyer}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.quantity}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700 font-semibold">${row.total}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${row.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{row.status}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile: Card view */}
          <div className="md:hidden space-y-4">
            {payments.map((row, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow border border-gray-200 p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-500">Medicine</span>
                  <span className="text-sm font-bold text-gray-800">{row.medicine}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-500">Buyer</span>
                  <span className="text-sm text-gray-800">{row.buyer}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-500">Quantity</span>
                  <span className="text-sm text-gray-800">{row.quantity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-500">Total</span>
                  <span className="text-sm text-green-700 font-semibold">${row.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-500">Status</span>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${row.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{row.status}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-500">Date</span>
                  <span className="text-sm text-gray-500">{row.date}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SellerPayments;
