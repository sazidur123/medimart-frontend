import React, { useState, useRef } from "react";
import { UploadCloud, Eye, Save, Trash2 } from "lucide-react";

function Prescription() {
  const [prescriptions, setPrescriptions] = useState(() => {
    // Load from localStorage for demo; replace with API in production
    const saved = localStorage.getItem("prescriptions");
    return saved ? JSON.parse(saved) : [];
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [prescriptionName, setPrescriptionName] = useState("");
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      setPreviewUrl(URL.createObjectURL(selected));
    } else {
      setPreviewUrl("");
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!file || !prescriptionName.trim()) return;
    const newPrescription = {
      id: Date.now(),
      name: file.name,
      displayName: prescriptionName,
      url: previewUrl,
      date: new Date().toLocaleString(),
    };
    const updated = [newPrescription, ...prescriptions];
    setPrescriptions(updated);
    localStorage.setItem("prescriptions", JSON.stringify(updated));
    setFile(null);
    setPreviewUrl("");
    setPrescriptionName("");
    fileInputRef.current.value = "";
  };

  const handleDelete = (id) => {
    const updated = prescriptions.filter((p) => p.id !== id);
    setPrescriptions(updated);
    localStorage.setItem("prescriptions", JSON.stringify(updated));
  };

  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-base-100 py-8">
      <div className="w-full max-w-xl mx-4 p-8 rounded-2xl shadow-xl bg-white/90 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
          <UploadCloud className="w-7 h-7" />
          Upload Prescription
        </h1>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="file-input file-input-bordered w-full"
            required
          />
          <input
            type="text"
            placeholder="Prescription Name"
            className="input input-bordered w-full"
            value={prescriptionName}
            onChange={(e) => setPrescriptionName(e.target.value)}
            required
          />
          {previewUrl && (
            <div className="flex flex-col items-center gap-2">
              {file?.type?.startsWith("image/") ? (
                <img
                  src={previewUrl}
                  alt="Prescription Preview"
                  className="max-h-48 rounded shadow"
                />
              ) : (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  Preview PDF
                </a>
              )}
              <span className="text-xs text-gray-500">{file?.name}</span>
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary flex items-center gap-2 self-end"
            disabled={!file || !prescriptionName.trim()}
          >
            <Save className="w-5 h-5" />
            Save Prescription
          </button>
        </form>
      </div>

      {/* List of saved prescriptions */}
      <div className="w-full max-w-xl mx-4 mt-10">
        <h2 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Your Prescriptions
        </h2>
        {prescriptions.length === 0 ? (
          <div className="text-gray-500 text-center">No prescriptions uploaded yet.</div>
        ) : (
          <ul className="space-y-4">
            {prescriptions.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-base-200 shadow"
              >
                {p.url.endsWith(".pdf") ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline flex items-center gap-1"
                  >
                    <Eye className="w-5 h-5" />
                    View PDF
                  </a>
                ) : (
                  <img
                    src={p.url}
                    alt={p.name}
                    className="w-16 h-16 object-cover rounded shadow"
                  />
                )}
                <div className="flex-1">
                  <div className="font-medium">{p.displayName || p.name}</div>
                  <div className="text-xs text-gray-500">{p.date}</div>
                </div>
                <button
                  className="btn btn-error btn-sm flex items-center gap-1"
                  title="Delete"
                  onClick={() => handleDelete(p.id)}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default Prescription;