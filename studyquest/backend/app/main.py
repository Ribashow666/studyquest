from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.core.database import engine, Base
from app.core.config import settings
from app.routers import (
    auth_router, users_router, tasks_router,
    achievements_router, ranking_router, notifications_router, classes_router,
)

import app.models  # noqa: F401

limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)

    # Migrations manuais para colunas novas
    from sqlalchemy import text
    with engine.connect() as conn:
        conn.execute(text("""
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT FALSE
        """))
        conn.execute(text("""
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255)
        """))
        # Marca usuários existentes como verificados
        conn.execute(text("""
            UPDATE users SET is_verified = TRUE WHERE is_verified = FALSE AND verification_token IS NULL
        """))
        conn.commit()

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
    description="Gamified study platform",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

if not settings.DEBUG:
    app.add_middleware(HTTPSRedirectMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://studyquest-backend.onrender.com",
        "https://studyquest-rho.vercel.app",
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
    return {"status": "ok", "message": "StudyQuest API is running", "version": "2.0.0"}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}