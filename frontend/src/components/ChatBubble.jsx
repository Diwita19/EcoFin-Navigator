// src/components/ChatBubble.jsx
import React from "react";

export default function ChatBubble({ sender, text, thinking }) {
  const isUser = sender === "user";

  return (
    <div className={`message-row message-row-${sender}`}>
      <div className={`bubble ${sender} ${thinking ? "is-thinking" : ""}`}>
        {thinking && !isUser ? (
          <div className="thinking-container">
            <span className="thinking-label">Your Finance Expert is thinking</span>
            <span className="thinking-dots">
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </span>
          </div>
        ) : (
          <div className="text">{text}</div>
        )}
      </div>
    </div>
  );
}