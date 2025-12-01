# EcoFin Navigator

EcoFin Navigator is an AI-powered **economist & financial educator** built by  
**Diwita Banerjee** as a capstone project using her GenAI wizardry.

It acts as a friendly macro/markets tutor that:
- Suggests example **investment plans** (not personalized financial advice)
- Explains **macro & sector outlooks**
- Breaks down **portfolio construction & risk**
- Adds light, dry **finance humor** and a playful origin story when asked who created it

Under the hood, EcoFin Navigator uses a **FastAPI + Gemini** backend with multiple "agents"  
and a **React + Vite** frontend that looks and feels like a modern chat interface.

---

# Folder Structure
<pre><code>
EcoFin-Navigator/
├── backend/                          # FastAPI + Gemini backend
│   ├── agents/                       # Individual agents in the analysis pipeline
│   │   ├── data_collector_agent.py       # Collects macro / market context
│   │   ├── macro_agent.py                # Analyzes macro environment
│   │   ├── sector_agent.py               # Rates sectors (Strong/Moderate/Weak)
│   │   ├── portfolio_agent.py            # Builds example ETF-style portfolios
│   │   ├── risk_agent.py                 # Evaluates risk & diversification
│   │   └── report_generator_agent.py     # Combines everything into a Markdown report
│   │
│   ├── routers/
│   │   ├── chat.py                   # /chat/stream → main chat endpoint (Gemini)
│   │   └── analysis.py               # /analysis/full → runs the full multi-agent pipeline
│   │
│   ├── tools/
│   │   ├── fred_api_tool.py          # Demo placeholders for CPI, unemployment, rates
│   │   ├── yahoo_finance_tool.py     # Simple Yahoo Finance quote fetcher
│   │   └── google_search_tool.py     # Gemini Tool configuration for Google Search
│   │
│   ├── utils/
│   │   ├── formatter.py              # Text cleaning helper
│   │   └── memory.py                 # (currently shares same cleaner)
│   │
│   ├── orchestrator.py               # Chains agents: data → macro → sectors → portfolio → risk → report
│   ├── config.py                     # Loads GOOGLE_API_KEY and creates Gemini client
│   └── main.py                       # FastAPI app, CORS setup, router registration, /health endpoint
│
├── frontend/                         # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBubble.jsx        # Chat bubbles (user right, bot left) + "thinking..." animation
│   │   │   ├── InputBar.jsx          # Prompt input & Send button
│   │   │   ├── Sidebar.jsx           # Chat threads, new chat, delete thread
│   │   │   └── Loader.jsx            # Simple loading state (optional)
│   │   │
│   │   ├── hooks/
│   │   │   └── useChatStream.js      # SSE hook using EventSource for /chat/stream
│   │   │
│   │   ├── App.jsx                   # Main app: layout + state (threads, theme, messages)
│   │   ├── main.jsx                  # React entry point
│   │   └── style.css                 # Chat UI, dark/light theme, layout
│   │
│   ├── index.html                    # Vite HTML shell
│   └── package.json                  # Frontend scripts & dependencies
│
└── README.md
</code></pre>

---

# Step1: Clone the Repository
<pre><code>
git clone https://github.com/Diwita19/EcoFin-Navigator.git
cd EcoFin-Navigator
</code></pre>

---

# Step2: Run the Frontend (React + Vite)
In one terminal, set up and start the **frontend**:

<pre><code>
cd frontend
npm install             # Install all frontend dependencies
npm run dev             # Starts Vite dev server (usually at http://localhost:5173)
</code></pre>

- Open the printed URL (e.g. `http://localhost:5173/`) in your browser.
- The frontend expects the backend to be running at `http://127.0.0.1:8000`.

---

# Step3: Run the Backend (FastAPI + Gemini)
In a **separate** terminal, set up and start the **backend**:

<pre><code>
cd backend
</code></pre>

## Create and activate a virtual environment (example: Windows PowerShell)
<pre><code>
python -m venv ecofin
ecofin\Scripts\activate
</code></pre>

On macOS/Linux:
<pre><code>
python3 -m venv ecofin
source ecofin/bin/activate
</code></pre>

## Install backend dependencies
The requirements.txt file should list all Python libraries this project depends on, and they will be installed using:
<pre><code>
pip install -r requirements.txt
</code></pre>

## Add your Gemini API key
Create a <code>.env</code> file inside the <code>backend/</code> folder:

<pre><code>
GOOGLE_API_KEY=your_real_gemini_api_key_here
</code></pre>

This is read by <code>config.py</code> and <code>routers/chat.py</code> to call Gemini models (e.g. <code>gemini-2.5-flash</code>).

## Start the FastAPI server
<pre><code>
uvicorn main:app --reload
</code></pre>

This will start the backend at:

- Base URL: <code>http://127.0.0.1:8000</code>  
- Health check: <code>GET /health</code>  
- Chat endpoint (used by the frontend): <code>GET /chat/stream</code>  
- Full analysis endpoint: <code>GET /analysis/full</code>  

---

# How It Works (High-Level)

- The **frontend** sends the user’s message + chat history to:
  - <code>GET /chat/stream</code> (Server-Sent Events)
- The **backend**:
  - Builds a conversation with a rich **system prompt**:
    - Acts like an economist & financial educator
    - Provides example portfolio plans (not personal advice)
    - Explains risk, returns, and macro context
    - Answers “who created you?” with a humorous line crediting **Diwita Banerjee**
    - Can tell light, harmless finance jokes if asked
  - Calls **Gemini** via <code>google.genai.Client</code>
  - Streams the final answer back to the frontend
- The **UI**:
  - Shows user messages on the right, bot messages on the left
  - Displays an animated **“EcoFin Navigator is thinking…”** indicator while waiting
  - Lets you create/delete multiple threads in a sidebar
  - Persists threads in <code>localStorage</code> so they survive refresh
  - Supports **light/dark mode** toggling

---

# Example Usage

Once both frontend and backend are running:

1. Open the frontend in your browser:
   <pre><code>http://localhost:5173/</code></pre>

2. Try questions like:
   - <code>I am a beginner in investment with $10,000 in the US. Give me some example portfolio plans.</code>  
   - <code>Explain inflation and interest rates like I'm new to economics.</code>  
   - <code>Tell me a few harmless finance or stock market jokes.</code>  

3. EcoFin Navigator will:
   - Assume or clarify time horizon and risk level
   - Propose multiple **example portfolios** with allocation ranges
   - Provide a qualitative risk / return explanation
   - End with an **educational-only disclaimer**

---

# Disclaimer

EcoFin Navigator is an **educational demo**.

It provides **general information only**, based on simplified assumptions and historical-style patterns.  
It is **not**:

- Personalized financial advice  
- A recommendation to buy or sell any specific investment  
- A substitute for licensed financial or investment advice  

For real-world decisions, users should consult:

- A qualified financial advisor or planner  
- Reputable education resources like investor.gov, FINRA, or CFP Board  

---
