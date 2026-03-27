from app.services.auth_service import register_user, login_user, get_user_by_id
from app.services.xp_service import apply_xp_gain, xp_required_for_level
from app.services.streak_service import update_streak
from app.services.task_service import create_task, list_tasks, complete_task
from app.services.achievement_service import (
    seed_achievements,
    check_and_unlock_achievements,
    get_user_achievements,
)

__all__ = [
    "register_user",
    "login_user",
    "get_user_by_id",
    "apply_xp_gain",
    "xp_required_for_level",
    "update_streak",
    "create_task",
    "list_tasks",
    "complete_task",
    "seed_achievements",
    "check_and_unlock_achievements",
    "get_user_achievements",
]
