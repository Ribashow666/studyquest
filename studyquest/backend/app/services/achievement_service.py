from sqlalchemy.orm import Session

from app.models.user import User
from app.models.task import Task
from app.models.achievement import Achievement, UserAchievement


# ── Achievement definitions ───────────────────────────────────────────────────

ACHIEVEMENT_DEFINITIONS = [
    {
        "key": "first_task",
        "title": "Primeira Conquista",
        "description": "Complete sua primeira tarefa de estudo.",
        "icon": "🎯",
        "xp_bonus": 25,
    },
    {
        "key": "streak_7",
        "title": "Semana Perfeita",
        "description": "Mantenha um streak de 7 dias consecutivos.",
        "icon": "🔥",
        "xp_bonus": 100,
    },
    {
        "key": "xp_1000",
        "title": "Mestre do Conhecimento",
        "description": "Acumule 1000 XP no total.",
        "icon": "⭐",
        "xp_bonus": 150,
    },
    {
        "key": "level_5",
        "title": "Estudante Dedicado",
        "description": "Alcance o nível 5.",
        "icon": "🚀",
        "xp_bonus": 200,
    },
    {
        "key": "tasks_10",
        "title": "Estudante Prolífico",
        "description": "Complete 10 tarefas de estudo.",
        "icon": "📚",
        "xp_bonus": 75,
    },
]


def seed_achievements(db: Session) -> None:
    """Seed default achievements if they don't exist."""
    for defn in ACHIEVEMENT_DEFINITIONS:
        existing = db.query(Achievement).filter(Achievement.key == defn["key"]).first()
        if not existing:
            db.add(Achievement(**defn))
    db.commit()


def _already_unlocked(db: Session, user_id: int, achievement_id: int) -> bool:
    return (
        db.query(UserAchievement)
        .filter(
            UserAchievement.user_id == user_id,
            UserAchievement.achievement_id == achievement_id,
        )
        .first()
        is not None
    )


def _unlock(db: Session, user: User, achievement: Achievement) -> float:
    """Grant an achievement and return its XP bonus."""
    ua = UserAchievement(user_id=user.id, achievement_id=achievement.id)
    db.add(ua)
    return achievement.xp_bonus


def check_and_unlock_achievements(db: Session, user: User) -> list[str]:
    """
    Evaluate all achievement rules against the user's current state.
    Returns list of newly unlocked achievement titles.
    """
    completed_count = (
        db.query(Task)
        .filter(Task.user_id == user.id, Task.completed == True)
        .count()
    )

    all_achievements = db.query(Achievement).all()
    newly_unlocked: list[str] = []
    bonus_xp: float = 0.0

    for ach in all_achievements:
        if _already_unlocked(db, user.id, ach.id):
            continue

        unlocked = False

        if ach.key == "first_task" and completed_count >= 1:
            unlocked = True
        elif ach.key == "streak_7" and user.streak >= 7:
            unlocked = True
        elif ach.key == "xp_1000" and user.total_xp >= 1000:
            unlocked = True
        elif ach.key == "level_5" and user.level >= 5:
            unlocked = True
        elif ach.key == "tasks_10" and completed_count >= 10:
            unlocked = True

        if unlocked:
            bonus = _unlock(db, user, ach)
            bonus_xp += bonus
            newly_unlocked.append(ach.title)

    if bonus_xp > 0:
        # Apply bonus XP from achievements (without recursive achievement checks)
        from app.services.xp_service import apply_xp_gain
        result = apply_xp_gain(user.level, user.xp, bonus_xp)
        user.level = result.new_level
        user.xp = result.remaining_xp
        user.total_xp += bonus_xp

    db.commit()
    db.refresh(user)
    return newly_unlocked


def get_user_achievements(db: Session, user_id: int) -> list[dict]:
    all_achievements = db.query(Achievement).all()
    user_unlocked = {
        ua.achievement_id: ua.unlocked_at
        for ua in db.query(UserAchievement).filter(UserAchievement.user_id == user_id).all()
    }

    result = []
    for ach in all_achievements:
        result.append(
            {
                "id": ach.id,
                "key": ach.key,
                "title": ach.title,
                "description": ach.description,
                "icon": ach.icon,
                "xp_bonus": ach.xp_bonus,
                "unlocked": ach.id in user_unlocked,
                "unlocked_at": user_unlocked.get(ach.id),
            }
        )

    return result
