# src/tools/google_search_tool.py

from google.genai.types import Tool

def get_google_search_tool():
    """Returns Google Search tool for agents."""
    return Tool(
        google_search={}
    )