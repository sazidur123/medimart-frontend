import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function CategorySection({ categories = [] }) {
  const navigate = useNavigate();
  return (
    <section className="my-10 w-full px-2 sm:px-4 md:px-8">
      <div className="max-w-6xl mx-auto rounded-2xl p-4 sm:p-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 text-indigo-700 text-center tracking-tight drop-shadow">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full">
          {categories.slice(0, 6).map((cat, index) => (
            <div
              key={cat._id || index}
              className="bg-white rounded-xl shadow p-4 flex flex-col items-center cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-xl h-full"
              onClick={() => navigate(`/category/${cat._id || ""}`)}
            >
              <div className="w-20 h-20 mb-3 flex items-center justify-center bg-indigo-50 rounded-full">
                <img
                  src={
                    cat.image?.startsWith("http")
                      ? cat.image
                      : "https://via.placeholder.com/96?text=No+Image"
                  }
                  alt={cat.name || "Category"}
                  className="h-14 w-14 object-contain"
                />
              </div>
              <h3 className="font-semibold text-gray-800 text-center mb-1">{cat.name || "Unnamed"}</h3>
              <span className="text-xs text-gray-500 text-center">{cat.medicineCount ?? 0} medicines</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
