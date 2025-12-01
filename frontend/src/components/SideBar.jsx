// src/components/Sidebar.jsx
import React from "react";
import ecofinIcon from "../assets/Bull-n-Bear.png";

export default function Sidebar({
  threads,
  activeThreadId,
  onNewChat,
  onSelectThread,
  onDeleteThread,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <img
            src={ecofinIcon}
            alt="EcoFin Navigator"
            className="sidebar-logo"
          />
        </div>
      </div>

      <button className="new-chat-btn" onClick={onNewChat}>
        + New chat
      </button>

      <div className="thread-list">
        {threads.map((t) => {
          const isActive = t.id === activeThreadId;
          const previewSource =
            [...t.messages].reverse().find((m) => m.text?.trim()) || null;

          const previewText =
            previewSource?.text?.slice(0, 60).replace(/\s+/g, " ") ||
            "Ask about markets, ETFs, or risk…";

          return (
            <div
              key={t.id}
              className={`thread-item ${isActive ? "is-active" : ""}`}
              onClick={() => onSelectThread(t.id)}
            >
              <div className="thread-main">
                <div className="thread-title">
                  {t.title && t.title !== "New chat" ? t.title : "New chat"}
                </div>
                <div className="thread-preview">{previewText}</div>
              </div>

              <button
                className="thread-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteThread(t.id);
                }}
                aria-label="Delete chat"
                title="Delete chat"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
