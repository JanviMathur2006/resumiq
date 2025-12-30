import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const [showButtons, setShowButtons] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page" style={{ textAlign: "center" }}>
      {!showButtons ? (
        <>
          <h1>Resumiq</h1>
          <p>Create, manage and showcase your resume.</p>
        </>
      ) : (
        <>
          <h2>Welcome to Resumiq</h2>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/signup")} style={{ marginLeft: "10px" }}>
            Sign Up
          </button>
        </>
      )}
    </div>
  );
}
