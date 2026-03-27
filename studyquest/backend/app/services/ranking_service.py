from sqlalchemy.orm import Session
from app.models.user import User, CLASS_META
from app.schemas.ranking import RankingEntry


def get_ranking(db: Session, current_user_id: int, limit: int = 20) -> list[RankingEntry]:
    users = (
        db.query(User)
        .order_by(User.total_xp.desc(), User.level.desc())
        .limit(limit)
        .all()
    )

    result = []
    for position, user in enumerate(users, start=1):
        meta = CLASS_META[user.character_class]
        result.append(
            RankingEntry(
                position=position,
                user_id=user.id,
                name=user.name,
                character_class=user.character_class.value,
                class_icon=meta["icon"],
                level=user.level,
                total_xp=user.total_xp,
                streak=user.streak,
                is_me=(user.id == current_user_id),
            )
        )
    return result