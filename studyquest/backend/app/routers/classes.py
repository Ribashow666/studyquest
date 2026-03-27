from fastapi import APIRouter
from app.models.user import CLASS_META, CLASS_XP_MULTIPLIER, CharacterClass
from app.schemas.user import CharacterClassInfo

router = APIRouter(prefix="/classes", tags=["Classes"])


@router.get("", response_model=list[CharacterClassInfo])
def list_classes():
    """Return all available character classes with their bonuses."""
    result = []
    for cls in CharacterClass:
        meta = CLASS_META[cls]
        result.append(CharacterClassInfo(
            key=cls.value,
            label=meta["label"],
            icon=meta["icon"],
            description=meta["description"],
            xp_multiplier=CLASS_XP_MULTIPLIER[cls],
        ))
    return result