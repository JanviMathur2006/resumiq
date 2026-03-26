import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
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
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setResumes(list);
      setLoading(false);
    };

    fetchResumes();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-20 text-gray-500">
        Loading resumes…
      </p>
    );
  }

  return (
    <div className="dashboard-main">
      
      {/* 🔥 HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome back 👋</h1>
          <p>Continue building your professional resume.</p>
        </div>

        <button
          onClick={() => navigate("/app/create")}
          className="primary-btn"
        >
          + New Resume
        </button>
      </div>

      {/* 🔥 CONTENT */}
      {resumes.length === 0 ? (
        <div className="empty-state">
          <p>You haven’t created any resumes yet.</p>
        </div>
      ) : (
        <div className="dashboard-content">
          {resumes.map((resume) => (
            <div key={resume.id} className="resume-card">
              
              <h2>{resume.title}</h2>

              <p className="resume-date">
                Last updated:{" "}
                {resume.updatedAt?.toDate().toLocaleDateString()}
              </p>

              <div className="card-actions">
                <button
                  onClick={() =>
                    navigate(`/app/builder/${resume.id}`)
                  }
                  className="primary-btn"
                >
                  View / Edit
                </button>

                <button
                  onClick={async () => {
                    await deleteDoc(doc(db, "resumes", resume.id));
                    setResumes(
                      resumes.filter((r) => r.id !== resume.id)
                    );
                  }}
                  className="danger-btn"
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