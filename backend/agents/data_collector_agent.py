# backend/agents/data_collector_agent.py

from config import client

def run_data_collector():
    prompt = """
    Collect current global economic indicators:
    - Inflation (CPI)
    - Unemployment rate
    - Interest rates
    - Oil, Gold trend
    - USD index trend
    - Market sentiment summary

    Return structured JSON.
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[prompt],
        config={
            "temperature": 0.4,
            "max_output_tokens": 1024,
        },
    )

    return getattr(response, "text", "") or ""