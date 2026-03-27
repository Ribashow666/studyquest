from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.schemas.achievement import AchievementResponse
from app.services.achievement_service import get_user_achievements
from app.dependencies import get_current_user

router = APIRouter(prefix="/achievements", tags=["Achievements"])


@router.get("", response_model=list[AchievementResponse])
def list_achievements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_achievements(db, current_user.id)
