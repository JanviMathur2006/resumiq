import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resumeTypes } from "../data/resumeTypes";

const TABS = [
  { id: "recommended", label: "Recommended" },
  { id: "students", label: "Students" },
  { id: "professionals", label: "Professionals" },
  { id: "specialized", label: "Specialized" },
];

export default function CreateResumes() {
  const [activeTab, setActiveTab] = useState("recommended");
  const [selectedType, setSelectedType] = useState(null);
  const navigate = useNavigate();

  const filteredTypes = resumeTypes.filter((type) =>
    type.category.includes(activeTab)
  );

  const handleContinue = () => {
    if (!selectedType) return;
    navigate("/app/builder", {
      state: {
        resumeType: selectedType.id,
        sections: selectedType.sections,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* HEADER */}
        <h1 className="text-3xl font-semibold text-gray-900">
          Choose Resume Type
        </h1>
        <p className="mt-2 text-gray-500">
          Select the resume format that best fits your profile
        </p>

        {/* TABS */}
        <div className="mt-8 flex gap-3 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition
                ${
                  activeTab === tab.id
                    ? "bg-black text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* RESUME TYPE CARDS */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTypes.map((type) => {
            const isActive = selectedType?.id === type.id;

            return (
              <div
                key={type.id}
                onClick={() => setSelectedType(type)}
                className={`
                  cursor-pointer rounded-2xl border bg-white p-6
                  transition-all duration-200
                  ${
                    isActive
                      ? "border-black shadow-lg"
                      : "border-gray-200 hover:shadow-md hover:-translate-y-1"
                  }
                `}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {type.name}
                </h3>

                <p className="text-sm text-gray-600 mb-3">
                  {type.description}
                </p>

                <p className="text-xs text-gray-400">
                  Best for: {type.bestFor}
                </p>
              </div>
            );
          })}
        </div>

        {/* CONTINUE BUTTON */}
        <div className="mt-12 flex justify-end">
          <button
            onClick={handleContinue}
            disabled={!selectedType}
            className={`
              rounded-xl px-6 py-3 text-sm font-medium transition
              ${
                selectedType
                  ? "bg-black text-white hover:bg-gray-900"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            Continue →
          </button>
        </div>

      </div>
    </div>
  );
}
