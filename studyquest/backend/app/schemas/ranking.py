from pydantic import BaseModel


class RankingEntry(BaseModel):
    position: int
    user_id: int
    name: str
    character_class: str
    class_icon: str
    level: int
    total_xp: float
    streak: int
    is_me: bool

    model_config = {"from_attributes": True}