import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resumeTypes } from "../data/resumeTypes";

const tabs = [
  { id: "recommended", label: "Recommended" },
  { id: "students", label: "Students" },
  { id: "professionals", label: "Professionals" },
  { id: "specialized", label: "Specialized" },
];

export default function CreateResumes() {
  const [activeTab, setActiveTab] = useState("recommended");
  const [selectedType, setSelectedType] = useState(null);
  const navigate = useNavigate();

  const filteredResumes = resumeTypes.filter((r) =>
    r.category.includes(activeTab)
  );

  const handleContinue = () => {
    if (!selectedType) return;
    navigate("/resume-builder", {
      state: { resumeType: selectedType },
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Choose Resume Type</h1>
      <p className="text-gray-500 mb-6">
        Select the resume format that best matches your profile
      </p>

      {/* Tabs */}
      <div className="flex gap-3 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeTab === tab.id
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Resume Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResumes.map((type) => {
          const selected = selectedType?.id === type.id;

          return (
            <div
              key={type.id}
              tabIndex={0}
              onClick={() => setSelectedType(type)}
              onKeyDown={(e) => e.key === "Enter" && setSelectedType(type)}
              className={`rounded-2xl border p-6 cursor-pointer transition-all
                ${
                  selected
                    ? "border-black shadow-lg scale-[1.02]"
                    : "border-gray-200 hover:shadow-md"
                }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold">{type.name}</h3>
                {type.recommended && (
                  <span className="text-xs bg-black text-white px-2 py-1 rounded-full">
                    ⭐ Popular
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-3">
                {type.description}
              </p>

              <p className="text-xs text-gray-500">
                Best for: <span className="font-medium">{type.bestFor}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="mt-10 flex justify-end">
        <button
          disabled={!selectedType}
          onClick={handleContinue}
          className={`px-6 py-3 rounded-lg font-medium transition
            ${
              selectedType
                ? "bg-black text-white hover:opacity-90"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
