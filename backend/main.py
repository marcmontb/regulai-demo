import asyncio
import json
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import homologation, questionnaires, flowcharts, reach, changes

app = FastAPI(
    title="Quimidroga AI API",
    description="Backend API for the Quimidroga AI regulatory affairs demo platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(homologation.router, prefix="/api/homologation", tags=["Homologation"])
app.include_router(questionnaires.router, prefix="/api/questionnaires", tags=["Questionnaires"])
app.include_router(flowcharts.router, prefix="/api/flowcharts", tags=["Flowcharts"])
app.include_router(reach.router, prefix="/api/reach", tags=["REACH"])
app.include_router(changes.router, prefix="/api/changes", tags=["Changes"])


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "Quimidroga AI API"}


@app.get("/api/dashboard")
async def dashboard():
    data_dir = Path(__file__).parent / "data"
    with open(data_dir / "products.json") as f:
        products = json.load(f)
    return {
        "kpi": {
            "pendingHomologations": 12,
            "openQuestionnaires": 8,
            "reachAlerts": 3,
            "pendingChanges": 5,
        },
        "totalProducts": len(products.get("materials", [])),
        "totalSuppliers": len(products.get("suppliers", [])),
    }
