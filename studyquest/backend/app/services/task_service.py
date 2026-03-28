from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.task import Task, TaskDifficulty
from app.models.user import User
from app.schemas.task import TaskCreate, TaskCompleteResponse, TaskResponse, DIFFICULTY_XP
from app.services.xp_service import apply_xp_gain
from app.services.streak_service import update_streak
from app.services.achievement_service import check_and_unlock_achievements


def create_task(db: Session, user_id: int, data: TaskCreate) -> Task:
    xp_reward = DIFFICULTY_XP[data.difficulty]
    task = Task(
        title=data.title,
        description=data.description,
        difficulty=data.difficulty,
        xp_reward=xp_reward,
        user_id=user_id,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def list_tasks(db: Session, user_id: int) -> list[Task]:
    return (
        db.query(Task)
        .filter(Task.user_id == user_id)
        .order_by(Task.created_at.desc())
        .all()
    )


def complete_task(db: Session, task_id: int, user: User) -> TaskCompleteResponse:
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == user.id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if task.completed:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Task already completed")

    task.completed = True
    task.completed_at = datetime.now(timezone.utc)

    # Apply XP with class multiplier
    xp_result = apply_xp_gain(user.level, user.xp, task.xp_reward, user.character_class)
    user.level = xp_result.new_level
    user.xp = xp_result.remaining_xp
    user.total_xp += xp_result.actual_xp_gained

    # Update streak
    new_streak, new_last_activity = update_streak(user.last_activity_date, user.streak)
    user.streak = new_streak
    user.last_activity_date = new_last_activity

    db.commit()
    db.refresh(user)
    db.refresh(task)

    newly_unlocked = check_and_unlock_achievements(db, user)

    return TaskCompleteResponse(
        task=TaskResponse.from_orm(task),
        xp_gained=xp_result.actual_xp_gained,
        level_up=xp_result.leveled_up,
        new_level=user.level,
        new_xp=user.xp,
        new_streak=user.streak,
        achievements_unlocked=newly_unlocked,
    )