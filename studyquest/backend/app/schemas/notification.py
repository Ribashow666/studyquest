from pydantic import BaseModel
from enum import Enum


class NotificationType(str, Enum):
    STREAK_RISK   = "streak_risk"
    LEVEL_CLOSE   = "level_close"
    ACHIEVEMENT   = "achievement_close"
    MOTIVATIONAL  = "motivational"
    CLASS_BONUS   = "class_bonus"


class Notification(BaseModel):
    type: NotificationType
    title: str
    message: str
    icon: str
    priority: int  # 1=high, 2=medium, 3=low