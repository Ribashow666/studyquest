from datetime import datetime, timezone
from enum import Enum as PyEnum
from sqlalchemy import String, Integer, Float, DateTime, Enum, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class CharacterClass(str, PyEnum):
    SAGE      = "sage"
    EXECUTOR  = "executor"
    WARRIOR   = "warrior"
    MAGE      = "mage"
    EXPLORER  = "explorer"


CLASS_XP_MULTIPLIER: dict[CharacterClass, float] = {
    CharacterClass.SAGE:     1.15,
    CharacterClass.EXECUTOR: 1.10,
    CharacterClass.WARRIOR:  1.05,
    CharacterClass.MAGE:     1.20,
    CharacterClass.EXPLORER: 1.10,
}

CLASS_META = {
    CharacterClass.SAGE: {
        "label": "Sábio",
        "icon": "🧙",
        "description": "Mestre do conhecimento teórico. +15% XP em todas as tarefas.",
    },
    CharacterClass.EXECUTOR: {
        "label": "Executor",
        "icon": "⚔️",
        "description": "Age com precisão. +10% XP e bônus em tarefas práticas.",
    },
    CharacterClass.WARRIOR: {
        "label": "Guerreiro",
        "icon": "🛡️",
        "description": "Disciplina acima de tudo. Streaks valem mais XP.",
    },
    CharacterClass.MAGE: {
        "label": "Mago",
        "icon": "✨",
        "description": "Poder arcano do estudo. +20% XP em todas as tarefas.",
    },
    CharacterClass.EXPLORER: {
        "label": "Explorador",
        "icon": "🗺️",
        "description": "Curioso por natureza. +10% XP e bônus em diversidade.",
    },
}


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    character_class: Mapped[CharacterClass] = mapped_column(
        Enum(CharacterClass), default=CharacterClass.SAGE, nullable=False
    )
    level: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    xp: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    total_xp: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    streak: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_activity_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Email verification
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    verification_token: Mapped[str | None] = mapped_column(String(255), nullable=True)

    tasks: Mapped[list["Task"]] = relationship("Task", back_populates="user", cascade="all, delete-orphan")
    user_achievements: Mapped[list["UserAchievement"]] = relationship(
        "UserAchievement", back_populates="user", cascade="all, delete-orphan"
    )
    notifications: Mapped[list["Notification"]] = relationship(
        "Notification", back_populates="user", cascade="all, delete-orphan"
    )