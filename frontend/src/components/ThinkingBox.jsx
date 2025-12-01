import React from "react";
import "../thinking.css";

export default function ThinkingBox({ steps }) {
  return (
    <div className="thinking-box">
      <div className="thinking-title">EcoFin Navigator is thinking…</div>

      <ul className="thinking-list">
        {steps.map((line, i) => (
          <li key={i} className="thinking-line">
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}