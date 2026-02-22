from fastapi import APIRouter

router = APIRouter()


@router.get("/substances")
async def list_substances():
    return {"message": "REACH substance data available via frontend mock data"}


@router.get("/alerts")
async def list_alerts():
    return [
        {"substance": "Citral", "cas": "5392-40-5", "level": "critical", "consumed_pct": 95.2},
        {"substance": "Limonene", "cas": "5989-27-5", "level": "warning", "consumed_pct": 78.5},
        {"substance": "Cinnamaldehyde", "cas": "104-55-2", "level": "warning", "consumed_pct": 74.7},
    ]
