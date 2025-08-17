import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import { auth } from "../../../firebase";

const columns = [
  { name: "Transaction ID", selector: row => row.paymentIntentId, sortable: true },
  { name: "Total Price", selector: row => `$${row.amount}` , sortable: true },
  { name: "Status", selector: row => row.status, sortable: true },
  { name: "Date", selector: row => row.date, sortable: true },
];

function UserPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('dashboard.userPayments', 'User Payments - MediMart');
  }, [t]);

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    let token = localStorage.getItem("access_token");
    if (auth.currentUser) {
      token = await auth.currentUser.getIdToken();
    }
    const res = await fetch(`${import.meta.env.VITE_API_URL}/payments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      setPayments([]);
      setLoading(false);
      return;
    }
    const data = await res.json();
    const user = JSON.parse(localStorage.getItem("user"));
    // Only show payments made by this user
    const userPayments = data.filter((p) => p.user?.email === user.email).map((p) => ({
      paymentIntentId: p.paymentIntentId || "-",
      amount: (p.amount / 100).toFixed(2),
      status: p.status,
      date: new Date(p.date).toLocaleDateString(),
    }));
    setPayments(userPayments);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment History</h2>
      <DataTable
        columns={columns}
        data={payments}
        progressPending={loading}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
}

export default UserPayments;
