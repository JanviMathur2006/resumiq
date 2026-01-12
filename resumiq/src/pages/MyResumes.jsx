import { useEffect, useState } from "react";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function MyResumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      if (!auth.currentUser) return;

      const q = query(
        collection(db, "resumes"),
        where("userId", "==", auth.currentUser.uid)
      );

      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setResumes(list);
      setLoading(false);
    };

    fetchResumes();
  }, []);

  if (loading) {
    return <p className="text-center mt-20 text-gray-500">Loading resumes…</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8">My Resumes</h1>

      {resumes.length === 0 ? (
        <p className="text-gray-500">
          You haven’t created any resumes yet.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="bg-white border rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold mb-1">
                {resume.title}
              </h2>

              <p className="text-sm text-gray-500 mb-4">
                Last updated:{" "}
                {resume.updatedAt?.toDate().toLocaleDateString()}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/app/builder/${resume.id}`)}
                  className="text-sm px-4 py-2 bg-black text-white rounded-lg"
                >
                  View / Edit
                </button>

                <button
                  onClick={async () => {
                    await deleteDoc(doc(db, "resumes", resume.id));
                    setResumes(resumes.filter(r => r.id !== resume.id));
                  }}
                  className="text-sm px-4 py-2 bg-red-100 text-red-600 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
