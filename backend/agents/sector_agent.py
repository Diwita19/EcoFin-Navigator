# backend/agents/sector_agent.py

from config import client

def run_sector_agent(macro: str):
    prompt = f"""
    Based on macroeconomic analysis:

    {macro}

    Predict near-term performance for:
    - Technology
    - Energy
    - Financials
    - Industrials
    - Utilities
    - Consumer discretionary
    - Emerging markets

    Output a simple JSON rating (Strong/Moderate/Weak).
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