import os
from dotenv import load_dotenv
from google.genai import Client

# Load .env file
load_dotenv()

# Read API key
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise ValueError("GOOGLE_API_KEY missing! Check your .env file.")

# Initialize the Gemini client
client = Client(api_key=api_key)