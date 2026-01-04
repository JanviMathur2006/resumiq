import { useLocation, Navigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";

export default function ResumeBuilder() {
  const location = useLocation();
  const resumeType = location.state?.resumeType;

  if (!resumeType) return <Navigate to="/app/create" />;

  return (
    <PageTransition>
      <div className="flex h-screen">
        {/* Editor */}
        <div className="w-1/2 p-6 overflow-y-auto border-r">
          <h2 className="text-xl font-semibold mb-4">
            {resumeType.name}
          </h2>

          {resumeType.sections.map((section) => (
            <div
              key={section}
              className="mb-4 p-4 rounded-lg border bg-white"
            >
              <h3 className="font-medium capitalize mb-2">
                {section.replace("-", " ")}
              </h3>
              <input
                placeholder={`Enter ${section} details`}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="w-1/2 p-6 bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">Live Preview</h2>
          <div className="bg-white h-full rounded-xl shadow-inner" />
        </div>
      </div>
    </PageTransition>
  );
}
