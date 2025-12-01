# ------------------------------------------------------
# Load .env BEFORE importing anything else
# ------------------------------------------------------
import os
from dotenv import load_dotenv
load_dotenv()   # <-- loads the GOOGLE_API_KEY

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Now safe to import routers
from routers.chat import router as chat_router
from routers.analysis import router as analysis_router

app = FastAPI(
    title="EcoFin Navigator API",
    version="1.0.0",
    description="Multi-Agent Financial Reasoning API"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROUTES
app.include_router(chat_router)
app.include_router(analysis_router)

@app.get("/health")
def health_check():
    return {"status": "healthy"}