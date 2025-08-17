
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

function SellerHome({ stats }) {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('dashboard.sellerHome', 'Seller Home - MediMart');
  }, [t]);
  // Format amounts to 2 decimals
  const formatAmount = (amt) => Number(amt).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <div className="w-full max-w-6xl mx-auto p-2 sm:p-4">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 text-center sm:text-left bg-gradient-to-r from-teal-500 to-cyan-600 text-transparent bg-clip-text drop-shadow">
        Seller Dashboard
      </h2>
      <div className="mb-6 text-center sm:text-left text-gray-500 text-base font-medium">
        The amounts below show the total value of products you have sold.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Sales Revenue */}
        <div className="rounded-xl bg-gradient-to-br from-teal-100 to-cyan-100 p-6 flex flex-col items-center justify-center border border-cyan-200 shadow-md">
          <div className="uppercase tracking-wide text-xs sm:text-sm font-semibold text-cyan-700 mb-2">Total Sales Revenue</div>
          <div className="text-4xl sm:text-5xl font-bold text-cyan-700 flex items-end">
            <span className="text-2xl align-super mr-1">$</span>{formatAmount(stats.totalSales)}
          </div>
        </div>
        {/* Paid Total */}
        <div className="rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 p-6 flex flex-col items-center justify-center border border-emerald-200 shadow-md">
          <div className="uppercase tracking-wide text-xs sm:text-sm font-semibold text-emerald-700 mb-2">Paid Total</div>
          <div className="text-4xl sm:text-5xl font-bold text-emerald-700 flex items-end">
            <span className="text-2xl align-super mr-1">$</span>{formatAmount(stats.paid)}
          </div>
        </div>
        {/* Pending Total */}
        <div className="rounded-xl bg-gradient-to-br from-orange-100 to-rose-100 p-6 flex flex-col items-center justify-center border border-rose-200 shadow-md">
          <div className="uppercase tracking-wide text-xs sm:text-sm font-semibold text-rose-700 mb-2">Pending Total</div>
          <div className="text-4xl sm:text-5xl font-bold text-rose-700 flex items-end">
            <span className="text-2xl align-super mr-1">$</span>{formatAmount(stats.pending)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerHome;
