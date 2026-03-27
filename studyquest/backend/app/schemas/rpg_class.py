from pydantic import BaseModel


class RpgClassResponse(BaseModel):
    key: str
    name: str
    icon: str
    description: str
    xp_multiplier: float
    unlock_level: int
    bonus_description: str
    available: bool  # whether current user level allows this class


class ChooseClassRequest(BaseModel):
    rpg_class: str