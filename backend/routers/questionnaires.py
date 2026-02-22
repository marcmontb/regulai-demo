from fastapi import APIRouter
from mock_ai.engine import simulate_ai_delay

router = APIRouter()


@router.get("/templates")
async def list_templates():
    return [
        {"id": "TPL001", "name": "Cosmetics Regulatory Questionnaire", "fields": 24},
        {"id": "TPL002", "name": "Food Contact Materials Questionnaire", "fields": 18},
        {"id": "TPL003", "name": "Fragrance Industry (IFRA) Compliance", "fields": 32},
    ]


@router.post("/generate/{template_id}/{material_id}")
async def generate_responses(template_id: str, material_id: str):
    await simulate_ai_delay(1500, 3000)
    return {"status": "completed", "template_id": template_id, "material_id": material_id}
