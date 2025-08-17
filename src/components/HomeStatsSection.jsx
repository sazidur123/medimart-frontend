import React, { useState, useEffect } from "react";

export default function HomeStatsSection() {
  const [stats, setStats] = useState({ customers: 0, sellers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/counts`);
        const data = await res.json();
        setStats(data);
      } catch {
        setStats({ customers: 0, sellers: 0 });
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <section className="mt-4 lg:pl-10 lg:pr-10">
      <div className="w-full rounded-2xl p-4 sm:p-8 bg-gradient-to-br from-green-50 via-white to-blue-50 shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 text-green-700 text-center tracking-tight drop-shadow">Our Community</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {/* Users */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center transition-transform hover:-translate-y-1 hover:shadow-xl h-full">
            <span className="mb-3 text-4xl text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </span>
            <span className="text-4xl font-bold text-green-700">
              {loading ? <span className="loading loading-spinner loading-md"></span> : stats.customers}
            </span>
            <span className="mt-2 text-lg font-medium text-gray-600">Users</span>
          </div>
          {/* Sellers */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center transition-transform hover:-translate-y-1 hover:shadow-xl h-full">
            <span className="mb-3 text-4xl text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422A12.083 12.083 0 0121 13.5c0 2.485-2.239 4.5-5 4.5s-5-2.015-5-4.5c0-.638.12-1.247.34-1.822L12 14z" /></svg>
            </span>
            <span className="text-4xl font-bold text-blue-700">
              {loading ? <span className="loading loading-spinner loading-md"></span> : stats.sellers}
            </span>
            <span className="mt-2 text-lg font-medium text-gray-600">Sellers</span>
          </div>
        </div>
      </div>
    </section>
  );
}
