// src/App.jsx
import React, { useState, useEffect } from "react";
import InputBar from "./components/InputBar";
import ChatBubble from "./components/ChatBubble";
import Sidebar from "./components/Sidebar";
import useChatStream from "./hooks/useChatStream";

const STORAGE_THREADS = "ecofin_threads_v1";
const STORAGE_ACTIVE_ID = "ecofin_active_thread_v1";

function createThread(title = "New chat") {
  return {
    id: Date.now().toString() + Math.random().toString(16).slice(2),
    title,
    messages: [],
  };
}

export default function App() {
  const chatStream = useChatStream();

  /* ---------------------------
     INITIAL STATE (load from localStorage)
     --------------------------- */

  const [threads, setThreads] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_THREADS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore parse/storage issues
    }
    // fallback: one empty thread
    return [createThread()];
  });

  const [activeThreadId, setActiveThreadId] = useState(() => {
    try {
      const storedId = localStorage.getItem(STORAGE_ACTIVE_ID);
      const storedThreads = localStorage.getItem(STORAGE_THREADS);
      if (storedId && storedThreads) {
        const parsed = JSON.parse(storedThreads);
        if (
          Array.isArray(parsed) &&
          parsed.some((t) => t.id === storedId)
        ) {
          return storedId;
        }
      }
    } catch {
      // ignore
    }
    // we'll set a default after mount when we know threads
    return null;
  });

  const [theme, setTheme] = useState("light");

  // ensure we always have some active thread id
  useEffect(() => {
    if (!activeThreadId && threads.length > 0) {
      setActiveThreadId(threads[0].id);
    }
  }, [threads, activeThreadId]);

  const activeThread =
    threads.find((t) => t.id === activeThreadId) || threads[0];

  /* ---------------------------
     SAVE to localStorage when things change
     --------------------------- */

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_THREADS, JSON.stringify(threads));
      if (activeThreadId) {
        localStorage.setItem(STORAGE_ACTIVE_ID, activeThreadId);
      }
    } catch {
      // best-effort only
    }
  }, [threads, activeThreadId]);

  /* ---------------------------
     Thread management
     --------------------------- */

  const handleNewChat = () => {
    const newThread = createThread();
    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
  };

  const handleSelectThread = (id) => {
    setActiveThreadId(id);
  };

  const handleDeleteThread = (id) => {
    setThreads((prev) => {
      const remaining = prev.filter((t) => t.id !== id);

      if (remaining.length === 0) {
        const t = createThread();
        setActiveThreadId(t.id);
        return [t];
      }

      if (id === activeThreadId) {
        setActiveThreadId(remaining[0].id);
      }

      return remaining;
    });
  };

  /* ---------------------------
     Sending messages
     --------------------------- */

  const handleSend = (msg) => {
    if (!msg.trim() || !activeThread) return;

    const threadId = activeThread.id;

    // 1) add user message + assistant placeholder
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== threadId) return t;

        const newMessages = [
          ...t.messages,
          { sender: "user", text: msg },
          { sender: "assistant", text: "", thinking: true },
        ];

        const newTitle =
          t.title === "New chat" && msg
            ? msg.slice(0, 40) + (msg.length > 40 ? "…" : "")
            : t.title;

        return { ...t, messages: newMessages, title: newTitle };
      })
    );

    // 2) build history (we include past messages + this user message)
    const historyForBackend = [
      ...(activeThread.messages || []),
      { sender: "user", text: msg },
    ].map((m) => ({
      user: m.sender === "user" ? m.text : "",
      assistant: m.sender === "assistant" ? m.text : "",
    }));

    // 3) stream from backend
    chatStream(
      "http://127.0.0.1:8000/chat/stream",
      {
        message: msg,
        history: historyForBackend,
      },
      // thinking callback
      (step) => {
        setThreads((prev) =>
          prev.map((t) => {
            if (t.id !== threadId) return t;
            const msgs = [...t.messages];
            if (!msgs.length) return t;
            const last = msgs[msgs.length - 1];
            if (last.sender !== "assistant") return t;
            msgs[msgs.length - 1] = {
              ...last,
              text: (last.text || "") + "\n" + step,
            };
            return { ...t, messages: msgs };
          })
        );
      },
      // final callback
      (finalAnswer) => {
        setThreads((prev) =>
          prev.map((t) => {
            if (t.id !== threadId) return t;
            const msgs = [...t.messages];
            if (!msgs.length) return t;
            const last = msgs[msgs.length - 1];
            if (last.sender !== "assistant") return t;
            msgs[msgs.length - 1] = {
              sender: "assistant",
              text:
                finalAnswer ||
                "EcoFin Navigator couldn’t generate a response for that request.",
              thinking: false,
            };
            return { ...t, messages: msgs };
          })
        );
      }
    );
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  /* ---------------------------
     Render
     --------------------------- */

  return (
    <div className={`app-shell theme-${theme}`}>
      <Sidebar
        threads={threads}
        activeThreadId={activeThreadId}
        onNewChat={handleNewChat}
        onSelectThread={handleSelectThread}
        onDeleteThread={handleDeleteThread}
      />

      <main className="chat-pane">
        <header className="chat-header">
          <div>
            <div className="chat-title">EcoFin Navigator</div>
            <div className="chat-subtitle">
              Multi-agent macro, sector & portfolio explainer
            </div>
          </div>

          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? "☀️ Light mode" : "🌙 Dark mode"}
          </button>
        </header>

        <div className="chat-window">
          {activeThread && activeThread.messages.length === 0 && (
            <div className="chat-empty">
              <h2>Welcome to EcoFin Navigator</h2>
              <p>
                Ask about inflation, interest rates, sector outlooks, ETFs, or
                how a sample investor might structure a portfolio.
              </p>
              <p className="chat-hint">
                Example: “I have $10,000 to invest for 10+ years — show me
                example portfolio plans and explain the risk.”
              </p>
            </div>
          )}

          {activeThread &&
            activeThread.messages.map((m, idx) => (
              <ChatBubble
                key={idx}
                sender={m.sender}
                text={m.text}
                thinking={m.thinking}
              />
            ))}
        </div>

        <footer className="chat-footer">
          <InputBar onSend={handleSend} />
          <div className="disclaimer-line">
            EcoFin Navigator provides general, educational information only, not
            personalized financial advice.
          </div>
        </footer>
      </main>
    </div>
  );
}