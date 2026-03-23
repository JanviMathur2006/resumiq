import React, { useState } from "react";
import "../styles/FlipCard.css";

const FlipCard = ({ title, tag, preview }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`flip-card ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="flip-card-inner">

        {/* FRONT */}
        <div className="flip-card-front">
          <div className="badge">Recommended</div>
          <h2>{title}</h2>
          <span className="tag">{tag}</span>
        </div>

        {/* BACK */}
        <div className="flip-card-back">
          <img src={preview} alt="preview" />
          <button className="use-btn">Use Template</button>
        </div>

      </div>
    </div>
  );
};

export default FlipCard;