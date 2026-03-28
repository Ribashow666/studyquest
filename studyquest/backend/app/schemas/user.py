from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator
from app.models.user import CharacterClass, CLASS_META


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    character_class: CharacterClass = CharacterClass.SAGE

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if not any(c.isupper() for c in v):
            raise ValueError("A senha deve conter ao menos uma letra maiúscula")
        if not any(c.islower() for c in v):
            raise ValueError("A senha deve conter ao menos uma letra minúscula")
        if not any(c.isdigit() for c in v):
            raise ValueError("A senha deve conter ao menos um número")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class CharacterClassInfo(BaseModel):
    key: str
    label: str
    icon: str
    description: str
    xp_multiplier: float


class UpdateProfileRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    character_class: Optional[CharacterClass] = None


class UpdatePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6, max_length=128)


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    level: int
    xp: float
    total_xp: float
    streak: int
    created_at: datetime
    character_class: str
    class_label: str
    class_icon: str
    xp_for_next_level: float
    xp_progress_percent: float

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_with_computed(cls, user) -> "UserResponse":
        xp_needed = 100.0 * user.level
        progress = round((user.xp / xp_needed) * 100, 1) if xp_needed > 0 else 0.0
        meta = CLASS_META[user.character_class]
        return cls(
            id=user.id,
            name=user.name,
            email=user.email,
            level=user.level,
            xp=user.xp,
            total_xp=user.total_xp,
            streak=user.streak,
            created_at=user.created_at,
            character_class=user.character_class.value,
            class_label=meta["label"],
            class_icon=meta["icon"],
            xp_for_next_level=xp_needed,
            xp_progress_percent=min(progress, 100.0),
        )