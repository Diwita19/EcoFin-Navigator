from fastapi import APIRouter
from orchestrator import run_all

router = APIRouter(prefix="/analysis", tags=["Analysis"])

@router.get("/full")
def run_full():
    return run_all()