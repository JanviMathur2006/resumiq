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
  const [flipped, setFlipped] = useState(null);
  const navigate = useNavigate();

  const filtered =
    activeTab === "Recommended"
      ? RESUMES
      : RESUMES.filter(r => r.tab === activeTab);

  return (
    <div className="min-h-screen bg-[#F7F9FC] px-12 py-10">
      
      {/* Header */}
      <h1 className="text-3xl font-semibold text-[#0A1A33]">
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
            className={`px-5 py-2 rounded-full text-sm
              ${
                activeTab === tab
                  ? "bg-black text-white"
                  : "bg-white border text-gray-600"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="flex flex-wrap gap-6 mt-10">
        {filtered.map(card => (
          <div
            key={card.id}
            onClick={() => setFlipped(flipped === card.id ? null : card.id)}
            style={{
              width: "280px",
              height: "200px",
              perspective: "1000px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                transformStyle: "preserve-3d",
                transition: "transform 0.6s",
                transform:
                  flipped === card.id ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >

              {/* FRONT */}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  background: "white",
                  borderRadius: "16px",
                  border: "1px solid #e5e7eb",
                  padding: "20px",
                  backfaceVisibility: "hidden",
                }}
              >
                <h2 style={{ fontWeight: "600" }}>{card.title}</h2>
                <p style={{ fontSize: "13px", color: "#6b7280" }}>
                  {card.description}
                </p>
              </div>

              {/* BACK */}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  background: "#0A1A33",
                  color: "white",
                  borderRadius: "16px",
                  padding: "20px",
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                <img
                  src={card.preview}
                  alt=""
                  style={{
                    width: "100%",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                />
                <p style={{ fontSize: "12px" }}>
                  Best for: {card.bestFor}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/app/builder", {
                      state: { resumeType: card.id },
                    });
                  }}
                  style={{
                    marginTop: "10px",
                    padding: "6px 12px",
                    background: "white",
                    color: "#0A1A33",
                    borderRadius: "6px",
                    border: "none",
                  }}
                >
                  Use Template
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}