import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TABS = ["Recommended", "Students", "Professionals", "Specialized"];

const RESUMES = [
  {
    id: "student",
    title: "Fresher / Student Resume",
    description: "Best for students and fresh graduates",
    bestFor: "Students, freshers",
    tab: "Students",
    recommended: true,
  },
  {
    id: "professional",
    title: "Experienced Professional Resume",
    description: "For professionals with work experience",
    bestFor: "1–15 years experience",
    tab: "Professionals",
  },
  {
    id: "internship",
    title: "Internship Resume",
    description: "Apply confidently for internships",
    bestFor: "Internships",
    tab: "Students",
  },
  {
    id: "career",
    title: "Career Switch Resume",
    description: "Transition into a new career path",
    bestFor: "Career changers",
    tab: "Specialized",
  },
];

export default function ChooseResumeType() {
  const [activeTab, setActiveTab] = useState("Recommended");
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const filteredResumes =
    activeTab === "Recommended"
      ? RESUMES
      : RESUMES.filter(r => r.tab === activeTab);

  return (
    <div className="min-h-screen bg-[#f6f8fb] px-12 py-10">
      {/* Header */}
      <h1 className="text-3xl font-semibold text-gray-900">
        Choose Resume Type
      </h1>
      <p className="text-gray-500 mt-1">
        Select the resume format that best fits your profile
      </p>

      {/* Tabs */}
      <div className="flex gap-3 mt-8">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition
              ${
                activeTab === tab
                  ? "bg-black text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-6xl">
        {filteredResumes.map(card => {
          const isSelected = selected === card.id;

          return (
            <div
              key={card.id}
              onClick={() => setSelected(card.id)}
              className={`cursor-pointer rounded-2xl p-6 transition bg-white
                ${
                  isSelected
                    ? "border-2 border-black shadow-lg"
                    : "border border-gray-200 hover:shadow-md"
                }`}
            >
              {/* Best Match */}
              {card.recommended && (
                <span className="inline-block text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full mb-4">
                  ✓ Best Match
                </span>
              )}

              <h3 className="text-lg font-semibold text-gray-900">
                {card.title}
              </h3>

              <p className="text-gray-600 mt-2 text-sm">
                {card.description}
              </p>

              <p className="text-gray-400 text-sm mt-6">
                Best for: {card.bestFor}
              </p>
            </div>
          );
        })}
      </div>

      {/* Continue */}
      <div className="flex justify-end mt-16">
        <button
          disabled={!selected}
          onClick={() =>
            navigate("/app/builder", {
              state: { resumeType: selected },
            })
          }
          className={`px-8 py-3 rounded-xl font-medium transition
            ${
              selected
                ? "bg-black text-white hover:opacity-90"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
