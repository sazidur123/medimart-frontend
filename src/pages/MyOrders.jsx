import React, { useEffect, useState } from "react";

function flattenOrder(order) {
  return {
    _id: order._id?.$oid || order._id,
    invoiceNumber: order.invoiceNumber,
    date: order.date?.$date?.$numberLong
      ? Number(order.date.$date.$numberLong)
      : order.date,
    status: order.status,
    total: order.total?.$numberInt
      ? Number(order.total.$numberInt)
      : order.total,
    items: (order.items || []).map((item) => ({
      _id: item._id?.$oid || item._id,
      name: item.name, // If you have a name field, otherwise show price
      quantity: item.quantity?.$numberInt
        ? Number(item.quantity.$numberInt)
        : item.quantity,
      price: item.price?.$numberDouble
        ? Number(item.price.$numberDouble)
        : item.price,
    })),
  };
}

function MyOrders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/invoice?userId=${user?.uid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        // If your API returns a single object, wrap it in an array
        let rawOrders = Array.isArray(data.orders || data.invoices)
          ? data.orders || data.invoices
          : [data.orders || data.invoices];
        // Flatten each order
        setOrders(rawOrders.filter(Boolean).map(flattenOrder));
      } catch (err) {
        setOrders([]);
      }
      setLoading(false);
    };
    if (user?.uid) fetchOrders();
  }, [user]);

  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-base-100 py-8">
      <div className="w-full max-w-3xl mx-4 p-8 rounded-2xl shadow-xl bg-white/90 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-primary mb-6">My Orders</h1>
        {loading ? (
          <div className="text-center text-gray-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500">No orders found.</div>
        ) : (
          <ul className="space-y-6">
            {orders.map((order) => (
              <li key={order._id} className="p-4 rounded-lg bg-base-200 shadow">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div>
                    <div className="font-semibold text-primary">
                      Invoice: {order.invoiceNumber}
                    </div>
                    <div className="text-xs text-gray-500">
                      Placed:{" "}
                      {order.date
                        ? new Date(order.date).toLocaleString()
                        : ""}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">
                    Status:{" "}
                    <span className="font-medium text-success">
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="font-medium mb-1">Items:</div>
                  <ul className="pl-4 list-disc text-gray-700 text-sm">
                    {(order.items || []).map((item, idx) => (
                      <li key={item._id || idx}>
                        {item.name
                          ? item.name
                          : `Item ${idx + 1}`}{" "}
                        &times; {item.quantity} (₹{item.price})
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2 text-right font-semibold text-primary">
                  Total: ₹{order.total}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default MyOrders;