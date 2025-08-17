import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function MedicineTable() {
  const [medicines, setMedicines] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("price_asc");
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch } = useForm();

  // Search fields: name, generic, company
  const search = watch();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Example API: /api/medicines?page=1&limit=10&sort=price_asc&name=...&generic=...&company=...
      const params = new URLSearchParams({
        page,
        limit: 10,
        sort,
        ...search
      });
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/medicines?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMedicines(data.medicines);
      setTotalPages(data.totalPages);
      setLoading(false);
    };
    fetchData();
  }, [page, sort, search.name, search.generic, search.company]);

  return (
    <div>
      <form className="flex gap-2 mb-3" onSubmit={handleSubmit(() => setPage(1))}>
        <input {...register("name")} placeholder="Search Name" className="input input-sm" />
        <input {...register("generic")} placeholder="Generic Name" className="input input-sm" />
        <input {...register("company")} placeholder="Company Name" className="input input-sm" />
        <button type="submit" className="btn btn-sm btn-primary">Search</button>
      </form>
      <div className="mb-2">
        <button onClick={() => setSort(sort === "price_asc" ? "price_desc" : "price_asc")} className="btn btn-xs">
          Sort by Price {sort === "price_asc" ? "▲" : "▼"}
        </button>
      </div>
      <table className="table table-zebra">
        {/* ...table head and body... */}
      </table>
      <div className="flex justify-between mt-2">
        <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="btn btn-xs">Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages} className="btn btn-xs">Next</button>
      </div>
    </div>
  );
}
export default MedicineTable;