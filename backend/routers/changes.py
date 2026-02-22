from fastapi import APIRouter
from mock_ai.engine import simulate_ai_delay

router = APIRouter()


@router.get("/records")
async def list_changes():
    return {"message": "Change records available via frontend mock data"}


@router.post("/notify/{change_id}")
async def send_notification(change_id: str):
    await simulate_ai_delay(500, 1500)
    return {"status": "sent", "change_id": change_id}
