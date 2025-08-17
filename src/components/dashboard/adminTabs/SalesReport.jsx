import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";

function SalesReport({ sales }) {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('dashboard.salesReport', 'Sales Report - MediMart');
  }, [t]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [filtered, setFiltered] = useState(sales);

  // Filter sales by date range
  const handleFilter = () => {
    if (!from && !to) return setFiltered(sales);
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;
    setFiltered(
      sales.filter((r) => {
        const d = new Date(r.date);
        if (fromDate && d < fromDate) return false;
        if (toDate && d > toDate) return false;
        return true;
      })
    );
  };

  // Download as CSV
  const handleDownloadCSV = () => {
    const headers = ["Medicine", "Seller", "Buyer", "Total", "Date"];
    const rows = filtered.map((r) => [r.medicine, r.seller, r.buyer, r.total, r.date]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sales-report.csv";
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      if (document.body.contains(link)) document.body.removeChild(link);
    }, 2000);
  };

  // Download as XLSX
  const handleDownloadXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(
      filtered.map((r) => ({
        Medicine: r.medicine,
        Seller: r.seller,
        Buyer: r.buyer,
        Total: r.total,
        Date: r.date,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SalesReport");
    XLSX.writeFile(wb, "sales-report.xlsx");
  };

  const columns = [
    { name: "Medicine", selector: (row) => row.medicine, sortable: true },
    { name: "Seller", selector: (row) => row.seller, sortable: true },
    { name: "Buyer", selector: (row) => row.buyer, sortable: true },
    { name: "Total", selector: (row) => `$${row.total}`, sortable: true },
    { name: "Date", selector: (row) => row.date, sortable: true },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-2 sm:p-4">
      <h2 className="text-3xl font-extrabold  drop-shadow mb-6 text-center sm:text-left bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text">Sales Report</h2>
      <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-4 mb-4 w-full">
        <div className="flex flex-col w-full md:w-auto">
          <label className="block text-xs font-semibold mb-1">From</label>
          <input type="date" className="input input-bordered w-full" value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div className="flex flex-col w-full md:w-auto">
          <label className="block text-xs font-semibold mb-1">To</label>
          <input type="date" className="input input-bordered w-full" value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <div className="flex flex-row gap-2 w-full md:w-auto mt-2 md:mt-0">
          <button className="btn btn-primary w-full md:w-auto" onClick={handleFilter}>Filter</button>
          {/* Download buttons only visible inline on md+ */}
          <button className="btn btn-outline w-full md:w-auto hidden md:inline-block" onClick={handleDownloadCSV}>Download CSV</button>
          <button className="btn btn-outline w-full md:w-auto hidden md:inline-block" onClick={handleDownloadXLSX}>Download XLSX</button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg shadow bg-white border border-gray-200">
        <DataTable
          columns={columns}
          data={filtered}
          pagination
          highlightOnHover
          striped
          responsive
          customStyles={{
            table: { style: { minWidth: '600px' } },
            rows: { style: { minHeight: '48px' } },
          }}
        />
      </div>
      {/* Download buttons under table on mobile */}
      <div className="flex flex-col gap-2 mt-4 md:hidden">
        <button className="btn btn-outline w-full" onClick={handleDownloadCSV}>Download CSV</button>
        <button className="btn btn-outline w-full" onClick={handleDownloadXLSX}>Download XLSX</button>
      </div>
    </div>
  );
}

export default SalesReport;
