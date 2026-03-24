import React, { useState } from "react";
import "../styles/FlipCard.css";

const FlipCard = ({
  title,
  tag,
  preview,
  badge = "Recommended",
  onSelect,
}) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped((prev) => !prev);
  };

  const handleSelect = (e) => {
    e.stopPropagation(); // 🔥 prevents flip when clicking button
    if (onSelect) onSelect(title);
  };

  return (
    <div
      className={`flip-card ${flipped ? "flipped" : ""}`}
      onClick={handleFlip}
    >
      <div className="flip-card-inner">

        {/* FRONT */}
        <div className="flip-card-front">
          {badge && <div className="badge">{badge}</div>}

          <h2 className="title">{title}</h2>

          {tag && <span className="tag">{tag}</span>}
        </div>

        {/* BACK */}
        <div className="flip-card-back">
          {preview ? (
            <img src={preview} alt="preview" className="preview-img" />
          ) : (
            <div className="placeholder">Preview</div>
          )}

          <button className="use-btn" onClick={handleSelect}>
            Use Template
          </button>
        </div>

      </div>
    </div>
  );
};

export default FlipCard;