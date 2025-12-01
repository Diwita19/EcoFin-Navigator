# EcoFin Navigator

EcoFin Navigator is an AI-powered **economist & financial educator** built by  
**Diwita Banerjee using her GenAI wizardry** as a capstone project.

It acts like a friendly macro/markets tutor that:

- Suggests example **investment plans** (not personalized advice)
- Explains **macro & sector outlooks**
- Breaks down **portfolio construction & risk**
- Adds light, dry **finance humor** to make markets less scary

Under the hood:

- A **FastAPI** backend with multi-step "agents" powered by **Google Gemini**
- A **React + Vite** frontend with a ChatGPT-style UI, multi-thread chat, and dark/light theme

---

## Features

### Chat-style experience

Ask questions like:

- “I’m a beginner with \$10,000 in the US, give me example portfolio plans.”
- “Explain inflation and interest rates like I’m new to investing.”
- “Tell me some harmless finance / market jokes.”

The bot:

- Frames assumptions (time horizon, risk tolerance, etc.)
- Proposes **3–4 example portfolios** with allocation ranges
- Explains **risk, return, and drawdowns** in plain language
- Ends with a clear **disclaimer** (educational only)

---

### Multi-agent backend pipeline

The backend is organized into simple “agents”, orchestrated in sequence:

- `data_collector_agent.py`  
  Collects macro context (inflation, unemployment, rates, commodities, USD index, sentiment).

- `macro_agent.py`  
  Interprets the global macro environment:
  - Inflation direction
  - Likely rate moves
  - Recession probability
  - Global sentiment

- `sector_agent.py`  
  Rates sectors (Strong / Moderate / Weak) for:
  - Tech, Energy, Financials, Industrials, Utilities, Consumer, EM, etc.

- `portfolio_agent.py`  
  Builds **example ETF-style allocations** based on sector outlooks.

- `risk_agent.py`  
  Evaluates:
  - Volatility exposure  
  - Diversification score  
  - Concentration risk  
  - A **0–100 numeric risk score**

- `report_generator_agent.py`  
  Generates a clean **Markdown report** summarizing:
  1. Global Market Summary  
  2. Macro Interpretation  
  3. Sector Forecast  
  4. Portfolio Recommendation  
  5. Risk Evaluation  
  6. Final Takeaways  

The whole flow is wired together in `backend/orchestrator.py`.

---

### Chat UX

- Multiple **threads** (like ChatGPT’s “New chat” sidebar)
- Threads are saved in **`localStorage`** and persist across refresh
- Threads can be **deleted**
- **Dark/Light mode toggle**
- Animated **“EcoFin Navigator is thinking…”** loader with cycling dots while Gemini responds
- User messages on the **right**, assistant messages on the **left**

---

### Fun origin & humor

- If asked “who created you?”, EcoFin answers with a playful line crediting  
  **Diwita Banerjee** (and jokingly blaming the training data for any silly answers).
- If users ask for **finance / economics / market / investment jokes**, it returns a few
  short, harmless, witty jokes to lighten their day.

---

## Tech Stack

**Backend**

- Python
- FastAPI
- Uvicorn
- `google-genai` (Gemini API client)
- Simple multi-agent orchestration

**Frontend**

- React (Vite)
- Axios (for HTTP calls & analysis endpoint)
- Native `EventSource` + custom hook for **SSE streaming**
- Vanilla CSS for a custom ChatGPT-style layout
- `localStorage` for thread persistence

---

## Architecture Overview

```text
            ┌───────────────────────┐
            │      React UI         │
            │  (chat, threads, UI)  │
            └─────────┬─────────────┘
                      │
        SSE / HTTP    │  "message", "history"
                      ▼
            ┌───────────────────────┐
            │ FastAPI backend       │
            │  /chat/stream         │
            │  /analysis/full       │
            └─────────┬─────────────┘
                      │
                      ▼
             ┌────────────────┐
             │ Gemini (LLMs)  │
             └────────────────┘

Multi-agent pipeline on /analysis/full:
  data_collector_agent → macro_agent → sector_agent
                       → portfolio_agent → risk_agent
                       → report_generator_agent
