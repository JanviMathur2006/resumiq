import { useState } from "react";
import { resumeTypeSamples } from "../data/resumeTypeSamples";

/* =======================
   MAP TYPES FOR TABS
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
      : [resumeTypeSamples[activeTab]];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-2 text-center">
        Resume Samples
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Explore professionally written resume samples.
      </p>

      {/* FILTER TABS */}
      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium
              ${
                activeTab === tab.id
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
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
            className="bg-white border rounded-2xl p-8"
          >
            <h2 className="text-2xl font-semibold mb-6">
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
  );
}

/* =======================
   SAMPLE BLOCK
======================= */
function SampleBlock({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">
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
