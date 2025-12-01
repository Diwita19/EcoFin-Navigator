# backend/agents/risk_agent.py

from config import client

def run_risk_agent(portfolio: str):
    prompt = f"""
    Evaluate the risk of this portfolio:

    {portfolio}

    Provide:
    - Volatility exposure
    - Diversification score
    - Concentration risk
    - Final numeric risk score (0-100)
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