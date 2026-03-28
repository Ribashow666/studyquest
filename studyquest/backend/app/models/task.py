from datetime import datetime, timezone
from enum import Enum as PyEnum
from sqlalchemy import String, Integer, Float, Boolean, ForeignKey, DateTime, Text, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class TaskDifficulty(str, PyEnum):
    EASY      = "easy"
    MEDIUM    = "medium"
    HARD      = "hard"
    LEGENDARY = "legendary"


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    difficulty: Mapped[TaskDifficulty] = mapped_column(
        Enum(TaskDifficulty), default=TaskDifficulty.MEDIUM, nullable=False
    )
    xp_reward: Mapped[float] = mapped_column(Float, default=50.0, nullable=False)
    completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user: Mapped["User"] = relationship("User", back_populates="tasks")