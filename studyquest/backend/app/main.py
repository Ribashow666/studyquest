from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import engine, Base
from app.routers import (
    auth_router, users_router, tasks_router,
    achievements_router, ranking_router, notifications_router, classes_router,
)

import app.models  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    from app.core.database import SessionLocal
    from app.services.achievement_service import seed_achievements
    db = SessionLocal()
    try:
        seed_achievements(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="StudyQuest API",
    description="🎮 Gamified study platform — level up your knowledge",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://studyquest-backend.onrender.com",
        # Adicione aqui a URL do Vercel quando tiver, ex:
        # "https://studyquest.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(tasks_router)
app.include_router(achievements_router)
app.include_router(ranking_router)
app.include_router(notifications_router)
app.include_router(classes_router)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "StudyQuest API is running 🚀", "version": "2.0.0"}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}