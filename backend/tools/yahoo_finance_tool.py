# src/tools/yahoo_finance_tool.py

import requests

BASE_URL = "https://query1.finance.yahoo.com/v7/finance/quote"

def get_quote(ticker: str):
    """Fetch price for stocks, indices, ETFs, currency indexes."""
    try:
        url = f"{BASE_URL}?symbols={ticker}"
        data = requests.get(url).json()
        result = data["quoteResponse"]["result"][0]
        return {
            "symbol": ticker,
            "price": result.get("regularMarketPrice"),
            "change": result.get("regularMarketChangePercent")
        }
    except Exception as e:
        return {"symbol": ticker, "error": str(e)}