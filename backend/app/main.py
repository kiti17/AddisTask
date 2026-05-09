from app.api.routes_auth import router as auth_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.database import Base, engine

from app.models.user import User
from app.models.task import Task
from app.models.provider import ProviderProfile

from app.api.routes_tasks import router as tasks_router
from app.api.routes_providers import router as providers_router
from app.models.application import Application
from app.api.routes_applications import router as applications_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
)


origins = [
    "http://localhost:5173",
    "https://addistask-1.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks_router)
app.include_router(providers_router)

app.include_router(auth_router)
app.include_router(applications_router)

@app.get("/")
def root():
    return {
        "app": "AddisTask API",
        "status": "running",
        "message": "FastAPI backend is working",
    }


@app.get("/api/health")
def health():
    return {"status": "ok"}