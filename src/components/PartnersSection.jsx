import React from "react";

export default function PartnersSection() {
  return (
    <section className="mt-4 lg:pl-10 lg:pr-10">
      <div className="w-full rounded-2xl p-4 sm:p-8 bg-gradient-to-br from-indigo-50 via-white to-blue-50 shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 text-indigo-700 text-center tracking-tight drop-shadow">Our Trusted Partners</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 items-center justify-items-center w-full">
          <div className="bg-white rounded-xl shadow p-3 flex items-center justify-center w-full h-20 transition-transform hover:-translate-y-1 hover:shadow-xl">
            <img src="https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/s2l9t4fqkq7grjgkjeej" alt="Partner 1" className="h-12 object-contain max-w-full" />
          </div>
          <div className="bg-white rounded-xl shadow p-3 flex items-center justify-center w-full h-20 transition-transform hover:-translate-y-1 hover:shadow-xl">
            <img src="https://images.crunchbase.com/image/upload/c_pad,f_auto,q_auto:eco,dpr_1/czpq3kubfzdlbs4geaqv" alt="Partner 2" className="h-12 object-contain max-w-full" />
          </div>
          <div className="bg-white rounded-xl shadow p-3 flex items-center justify-center w-full h-20 transition-transform hover:-translate-y-1 hover:shadow-xl">
            <img src="https://naturaldispensary.co.uk/images/catalog/category10.png" alt="Partner 3" className="h-12 object-contain max-w-full" />
          </div>
          <div className="bg-white rounded-xl shadow p-3 flex items-center justify-center w-full h-20 transition-transform hover:-translate-y-1 hover:shadow-xl">
            <img src="https://www.tbsnews.net/sites/default/files/styles/big_2/public/images/2022/04/27/square_pharma.jpg" alt="Partner 3" className="h-12 object-contain max-w-full" />
          </div>
          <div className="bg-white rounded-xl shadow p-3 flex items-center justify-center w-full h-20 transition-transform hover:-translate-y-1 hover:shadow-xl">
            <img src="https://www.tbsnews.net/sites/default/files/styles/author/public/organization/logo/incepta_pharmaceuticals_ltd.png" alt="Partner 3" className="h-12 object-contain max-w-full" />
          </div>
          <div className="bg-white rounded-xl shadow p-3 flex items-center justify-center w-full h-20 transition-transform hover:-translate-y-1 hover:shadow-xl">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwRSwQuAhnSq-2mzFv_JIfcLIoIAKJde0I_g&s" alt="Partner 3" className="h-12 object-contain max-w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
