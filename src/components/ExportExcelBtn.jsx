import * as XLSX from "xlsx";
export default function ExportExcelBtn({ data }) {
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SalesReport");
    XLSX.writeFile(wb, "sales-report.xlsx");
  };
  return <button className="btn btn-sm" onClick={handleExport}>Export Excel</button>;
}