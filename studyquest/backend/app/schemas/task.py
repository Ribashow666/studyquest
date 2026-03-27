from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    xp_reward: float = Field(default=50.0, ge=1.0, le=500.0)


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    xp_reward: float
    completed: bool
    completed_at: Optional[datetime]
    user_id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class TaskCompleteResponse(BaseModel):
    task: TaskResponse
    xp_gained: float
    level_up: bool
    new_level: int
    new_xp: float
    new_streak: int
    achievements_unlocked: list[str]
