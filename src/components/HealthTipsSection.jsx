import React from "react";

export default function HealthTipsSection() {
  return (
    <section className="mt-4 lg:pl-10 lg:pr-10">
      <div className="w-full rounded-2xl p-4 sm:p-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 text-indigo-700 text-center tracking-tight drop-shadow">Health Tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Tip 1 */}
          <div className="flex flex-col items-center bg-white rounded-xl shadow p-4 h-full transition-transform hover:-translate-y-1 hover:shadow-xl">
            <span className="mb-3 text-3xl text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </span>
            <span className="font-semibold text-gray-800 text-center">Take medicines as prescribed by your doctor.</span>
          </div>
          {/* Tip 2 */}
          <div className="flex flex-col items-center bg-white rounded-xl shadow p-4 h-full transition-transform hover:-translate-y-1 hover:shadow-xl">
            <span className="mb-3 text-3xl text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            </span>
            <span className="font-semibold text-gray-800 text-center">Check expiry dates before use.</span>
          </div>
          {/* Tip 3 */}
          <div className="flex flex-col items-center bg-white rounded-xl shadow p-4 h-full transition-transform hover:-translate-y-1 hover:shadow-xl">
            <span className="mb-3 text-3xl text-yellow-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" /></svg>
            </span>
            <span className="font-semibold text-gray-800 text-center">Store medicines in a cool, dry place away from sunlight.</span>
          </div>
          {/* Tip 4 */}
          <div className="flex flex-col items-center bg-white rounded-xl shadow p-4 h-full transition-transform hover:-translate-y-1 hover:shadow-xl">
            <span className="mb-3 text-3xl text-pink-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </span>
            <span className="font-semibold text-gray-800 text-center">Keep medicines out of reach of children.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
