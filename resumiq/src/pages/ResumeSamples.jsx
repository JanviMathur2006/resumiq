import { useState } from "react";
import { resumeTypeSamples } from "../data/resumeTypeSamples";

/* =======================
   FILTER TABS
======================= */
const TABS = [
  { id: "all", label: "All" },
  { id: "fresher", label: "Fresher / Student" },
  { id: "professional", label: "Professional" },
  { id: "internship", label: "Internship" },
  { id: "careerSwitch", label: "Career Switch" },
];

export default function ResumeSamples() {
  const [activeTab, setActiveTab] = useState("all");

  const samplesToShow =
    activeTab === "all"
      ? Object.values(resumeTypeSamples)
      : resumeTypeSamples[activeTab]
      ? [resumeTypeSamples[activeTab]]
      : [];

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* HEADER */}
        <h1 className="text-3xl font-semibold text-gray-900 text-center mb-2">
          Resume Samples
        </h1>
        <p className="text-gray-600 text-center mb-10">
          Explore professionally written resume samples for different career stages.
        </p>

        {/* FILTER TABS */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition
                ${
                  activeTab === tab.id
                    ? "bg-black text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SAMPLE CARDS */}
        <div className="space-y-12">
          {samplesToShow.map((sample, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                {sample.title}
              </h2>

              <SampleBlock title="Summary" items={sample.summary} />
              <SampleBlock title="Experience" items={sample.experience} />
              <SampleBlock title="Projects" items={sample.projects} />
              <SampleBlock title="Skills" items={sample.skills} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

/* =======================
   SAMPLE SECTION BLOCK
======================= */
function SampleBlock({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        {title}
      </h3>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
