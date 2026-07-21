import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function UploadResume() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(selectedFile.type)) {
      alert("Please upload a PDF or DOCX file.");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please choose a resume first.");
      return;
    }

    // Firebase upload & parsing will be added later
    alert("Resume uploaded successfully!");

    navigate("/app/builder");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-8">

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-12"
      >

        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Upload Existing Resume
        </h1>

        <p className="text-center text-gray-500 mb-10">
          Upload your PDF or DOCX resume and continue editing it inside
          Resumiq.
        </p>

        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFile(e.dataTransfer.files[0]);
          }}
          className={`border-2 border-dashed rounded-3xl p-16 flex flex-col items-center justify-center cursor-pointer transition-all ${
            dragging
              ? "border-blue-600 bg-blue-50"
              : "border-gray-300 hover:border-blue-500"
          }`}
        >
          <div className="text-7xl mb-6">📄</div>

          <h2 className="text-2xl font-semibold mb-2">
            Drag & Drop Resume
          </h2>

          <p className="text-gray-500 mb-5">
            or click to browse your files
          </p>

          <input
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />

          <span className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium">
            Choose File
          </span>
        </label>

        {file && (
          <div className="mt-8 rounded-2xl bg-green-50 border border-green-200 p-5">

            <h3 className="font-semibold text-green-700">
              Selected Resume
            </h3>

            <p className="mt-2 text-gray-700">
              {file.name}
            </p>

            <p className="text-sm text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>

          </div>
        )}

        <div className="mt-10 flex justify-between">

          <button
            onClick={() => navigate("/app")}
            className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
          >
            Back
          </button>

          <button
            onClick={handleUpload}
            className="px-8 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Upload Resume
          </button>

        </div>

      </motion.div>

    </div>
  );
}