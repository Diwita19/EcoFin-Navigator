# backend/agents/macro_agent.py

from config import client

def run_macro_agent(data: str):
    prompt = f"""
    Using this market data:

    {data}

    Analyze global macroeconomic outlook:
    - Inflation direction
    - Interest rate direction
    - Recession probability
    - Global market sentiment
    Return short structured analysis.
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[prompt],
        config={
            "temperature": 0.5,
            "max_output_tokens": 1024,
        },
    )

    return getattr(response, "text", "") or ""