import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FlipCard from "../components/FlipCard";

const TABS = ["Recommended", "Students", "Professionals", "Specialized"];

const RESUMES = [
  {
    id: "student",
    title: "Fresher / Student Resume",
    description: "Best for students and fresh graduates",
    bestFor: "Students, freshers",
    tab: "Students",
    preview: "/templates/fresher.png",
  },
  {
    id: "professional",
    title: "Experienced Professional Resume",
    description: "For professionals with work experience",
    bestFor: "1–15 years experience",
    tab: "Professionals",
    preview: "/templates/pro.png",
  },
  {
    id: "internship",
    title: "Internship Resume",
    description: "Apply confidently for internships",
    bestFor: "Internships",
    tab: "Students",
    preview: "/templates/intern.png",
  },
  {
    id: "career",
    title: "Career Switch Resume",
    description: "Transition into a new career path",
    bestFor: "Career changers",
    tab: "Specialized",
    preview: "/templates/switch.png",
  },
];

export default function ChooseResumeType() {
  const [activeTab, setActiveTab] = useState("Recommended");
  const navigate = useNavigate();

  const filtered =
    activeTab === "Recommended"
      ? RESUMES
      : RESUMES.filter((r) => r.tab === activeTab);

  // 🔥 FIX: central handler (prevents inline bugs)
  const handleSelect = (id) => {
    console.log("Navigating with:", id);

    navigate("/app/builder", {
      state: { resumeType: id },
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] px-12 py-10">

      {/* HEADER */}
      <h1 className="text-3xl font-semibold text-[#0A1A33]">
        Choose Resume Type
      </h1>
      <p className="text-gray-500 mt-1">
        Select the resume format that best fits your profile
      </p>

      {/* TABS */}
      <div className="flex gap-3 mt-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"  // ✅ prevents accidental form submit
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm transition
              ${
                activeTab === tab
                  ? "bg-black text-white"
                  : "bg-white border text-gray-600 hover:bg-gray-100"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CARDS */}
      <div className="flex flex-wrap gap-6 mt-10">
        {filtered.map((card) => (
          <FlipCard
            key={card.id}
            title={card.title}
            tag={card.bestFor}
            preview={card.preview}
            onSelect={() => handleSelect(card.id)} // ✅ FIXED
          />
        ))}
      </div>

      {/* CONTINUE BUTTON */}
      <div className="flex justify-end mt-16">
        <button
          type="button"
          className="px-6 py-3 bg-gray-300 rounded-lg text-gray-600"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}