import { useParams } from "react-router-dom";
import EditorPanel from "../components/EditorPanel";
import ResumePreview from "../components/ResumePreview";

export default function ResumeBuilder() {
  const { type } = useParams();

  return (
    <div className="flex h-screen">
      {/* Left Editor */}
      <div className="w-1/2 border-r p-6 overflow-y-auto">
        <EditorPanel />
      </div>

      {/* Right Preview */}
      <div className="w-1/2 bg-gray-100 p-6 overflow-y-auto">
        <ResumePreview type={type} />
      </div>
    </div>
  );
}
