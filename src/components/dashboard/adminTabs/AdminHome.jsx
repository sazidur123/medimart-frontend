
function formatCurrency(amount) {
  if (typeof amount !== 'number') amount = Number(amount) || 0;
  // Fix floating point issues by rounding to 2 decimals before formatting
  const rounded = Math.round((amount + Number.EPSILON) * 100) / 100;
  return rounded.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function AdminHome({ stats }) {
  return (
    <div className="w-full max-w-6xl mx-auto px-2 py-4 sm:p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-700 mb-6 drop-shadow text-center md:text-left">
        Admin Home
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Sales Revenue */}
        <div className="stat bg-gradient-to-br from-green-50 to-green-100 shadow-lg rounded-2xl p-5 border border-green-200 flex flex-col items-center sm:items-start">
          <div className="stat-title text-xs sm:text-sm text-gray-500 font-medium mb-1">Total Sales Revenue</div>
          <div className="stat-value text-green-700 text-3xl sm:text-4xl font-extrabold tracking-tight">
            {formatCurrency(stats.totalSales)}
          </div>
        </div>

        {/* Paid Total */}
        <div className="stat bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-2xl p-5 border border-blue-200 flex flex-col items-center sm:items-start">
          <div className="stat-title text-xs sm:text-sm text-gray-500 font-medium mb-1">Paid Total</div>
          <div className="stat-value text-blue-700 text-3xl sm:text-4xl font-extrabold tracking-tight">
            {formatCurrency(stats.paid)}
          </div>
        </div>

        {/* Pending Total */}
        <div className="stat bg-gradient-to-br from-red-50 to-red-100 shadow-lg rounded-2xl p-5 border border-red-200 flex flex-col items-center sm:items-start">
          <div className="stat-title text-xs sm:text-sm text-gray-500 font-medium mb-1">Pending Total</div>
          <div className="stat-value text-red-600 text-3xl sm:text-4xl font-extrabold tracking-tight">
            {formatCurrency(stats.pending)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
