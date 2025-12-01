// src/components/InputBar.jsx
import React, { useState } from "react";

export default function InputBar({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="input-bar">
      <input
        type="text"
        value={input}
        placeholder="Ask EcoFin Navigator anything about markets or portfolios…"
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}