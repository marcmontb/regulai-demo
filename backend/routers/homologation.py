from fastapi import APIRouter
from mock_ai.engine import simulate_ai_delay

router = APIRouter()


@router.get("/materials")
async def list_materials():
    import json
    from pathlib import Path
    data = json.loads((Path(__file__).parent.parent / "data" / "products.json").read_text())
    return data["materials"]


@router.post("/compare/{material_id}")
async def compare_questionnaire(material_id: str):
    await simulate_ai_delay(1000, 2500)
    return {"status": "completed", "material_id": material_id, "message": "Comparison analysis complete"}
