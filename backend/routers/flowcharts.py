from fastapi import APIRouter
from mock_ai.engine import simulate_ai_delay

router = APIRouter()


@router.get("/materials")
async def list_flowchart_materials():
    return [
        {"id": "MAT001", "name": "Linalool", "cas": "78-70-6", "hasFlowchart": True},
        {"id": "MAT002", "name": "Limonene", "cas": "5989-27-5", "hasFlowchart": True},
        {"id": "MAT004", "name": "Vanillin", "cas": "121-33-5", "hasFlowchart": True},
    ]


@router.post("/generate/{material_id}")
async def generate_flowchart(material_id: str):
    await simulate_ai_delay(2000, 4000)
    return {"status": "completed", "material_id": material_id}
