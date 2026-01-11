import "../styles/home.css";

export default function ResumeSlider() {
  return (
    <div className="slider-container">
      <div className="slider">
        
        {/* Slide 1 */}
        <div className="slide">
          <div className="plus">+</div>
          <h2>Create New Resume</h2>
          <p>Build a professional resume in minutes.</p>
          <button>Create Resume →</button>
        </div>

        {/* Slide 2 */}
        <div className="slide">
          <h2>My Resumes</h2>
          <p>View and manage your saved resumes.</p>
          <button>View →</button>
        </div>

      </div>
    </div>
  );
}
