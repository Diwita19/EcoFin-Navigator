# backend/agents/portfolio_agent.py

from config import client

def run_portfolio_agent(sectors: str):
    prompt = f"""
    Using these sector forecasts:

    {sectors}

    Recommend a diversified ETF portfolio.
    Include:
    - % allocation
    - Brief justification
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[prompt],
        config={
            "temperature": 0.6,
            "max_output_tokens": 1024,
        },
    )

    return getattr(response, "text", "") or ""