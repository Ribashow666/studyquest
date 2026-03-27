from datetime import datetime
from pydantic import BaseModel


class AchievementResponse(BaseModel):
    id: int
    key: str
    title: str
    description: str
    icon: str
    xp_bonus: float
    unlocked: bool
    unlocked_at: datetime | None

    model_config = {"from_attributes": True}
