from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.tasks import router as tasks_router
from app.routers.achievements import router as achievements_router
from app.routers.ranking import router as ranking_router
from app.routers.notifications import router as notifications_router
from app.routers.classes import router as classes_router

__all__ = [
    "auth_router",
    "users_router",
    "tasks_router",
    "achievements_router",
    "ranking_router",
    "notifications_router",
    "classes_router",
]