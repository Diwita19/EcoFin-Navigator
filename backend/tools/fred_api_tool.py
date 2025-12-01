# src/tools/fred_api_tool.py

import requests

API_BASE = "https://api.stlouisfed.org/fred/series/observations"
# No API key needed for demo values (we'll use static fallback)

def get_cpi():
    return 3.10  # fallback demo value

def get_unemployment():
    return 3.80  # fallback demo value

def get_interest_rate():
    return 5.50  # fallback demo value