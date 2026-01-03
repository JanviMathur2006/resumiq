import { useNavigate } from "react-router-dom";
import { resumeTypes } from "../data/resumeTypes";
import PageTransition from "../components/PageTransition";

export default function CreateResume() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Choose Resume Type</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resumeTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => navigate(`/builder/${type.id}`)}
              className="cursor-pointer border rounded-xl p-6 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2">{type.title}</h2>
              <p className="text-gray-600">{type.description}</p>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
