from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.schemas.ranking import RankingEntry
from app.services.ranking_service import get_ranking
from app.dependencies import get_current_user

router = APIRouter(prefix="/ranking", tags=["Ranking"])


@router.get("", response_model=list[RankingEntry])
def leaderboard(
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_ranking(db, current_user.id, limit)