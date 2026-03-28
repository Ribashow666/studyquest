from datetime import datetime
from typing import Optional
from enum import Enum
from pydantic import BaseModel, Field


class TaskDifficulty(str, Enum):
    EASY   = "easy"
    MEDIUM = "medium"
    HARD   = "hard"
    LEGENDARY = "legendary"


DIFFICULTY_XP = {
    TaskDifficulty.EASY:      25.0,
    TaskDifficulty.MEDIUM:    50.0,
    TaskDifficulty.HARD:     100.0,
    TaskDifficulty.LEGENDARY: 200.0,
}

DIFFICULTY_META = {
    TaskDifficulty.EASY:      {"label": "Fácil",    "icon": "🟢", "color": "green"},
    TaskDifficulty.MEDIUM:    {"label": "Médio",    "icon": "🟡", "color": "yellow"},
    TaskDifficulty.HARD:      {"label": "Difícil",  "icon": "🔴", "color": "red"},
    TaskDifficulty.LEGENDARY: {"label": "Lendário", "icon": "💀", "color": "purple"},
}


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    difficulty: TaskDifficulty = TaskDifficulty.MEDIUM


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    difficulty: str
    difficulty_label: str
    difficulty_icon: str
    xp_reward: float
    completed: bool
    completed_at: Optional[datetime]
    user_id: int
    created_at: datetime

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm(cls, task) -> "TaskResponse":
        meta = DIFFICULTY_META.get(TaskDifficulty(task.difficulty), DIFFICULTY_META[TaskDifficulty.MEDIUM])
        return cls(
            id=task.id,
            title=task.title,
            description=task.description,
            difficulty=task.difficulty,
            difficulty_label=meta["label"],
            difficulty_icon=meta["icon"],
            xp_reward=task.xp_reward,
            completed=task.completed,
            completed_at=task.completed_at,
            user_id=task.user_id,
            created_at=task.created_at,
        )


class TaskCompleteResponse(BaseModel):
    task: TaskResponse
    xp_gained: float
    level_up: bool
    new_level: int
    new_xp: float
    new_streak: int
    achievements_unlocked: list[str]