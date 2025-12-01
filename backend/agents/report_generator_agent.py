# backend/agents/report_generator_agent.py

from config import client

def run_report_generator(data: str, macro: str, sectors: str, portfolio: str, risk: str):
    prompt = f"""
    Create a professional Markdown report with sections:
    1. Global Market Summary
    2. Macro Interpretation
    3. Sector Forecast
    4. Portfolio Recommendation
    5. Risk Evaluation
    6. Final Takeaways

    Keep it clean and structured.

    DATA:
    {data}

    MACRO:
    {macro}

    SECTORS:
    {sectors}

    PORTFOLIO:
    {portfolio}

    RISK:
    {risk}
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[prompt],
        config={
            "temperature": 0.5,
            "max_output_tokens": 2048,
        },
    )

    return getattr(response, "text", "") or ""