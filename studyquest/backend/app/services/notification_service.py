from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.user import User, CLASS_META, CLASS_XP_MULTIPLIER
from app.models.task import Task
from app.schemas.notification import Notification, NotificationType


def get_notifications(db: Session, user: User) -> list[Notification]:
    notifications: list[Notification] = []
    now = datetime.now(timezone.utc)

    # ── 1. Streak em risco ────────────────────────────────────────────────────
    if user.last_activity_date and user.streak > 0:
        last = user.last_activity_date
        delta_hours = (now - last).total_seconds() / 3600
        # If more than 20h without activity, warn
        if delta_hours >= 20:
            notifications.append(Notification(
                type=NotificationType.STREAK_RISK,
                title="🔥 Seu streak está em risco!",
                message=f"Você tem um streak de {user.streak} dia(s). Complete uma tarefa hoje para não perder!",
                icon="🔥",
                priority=1,
            ))

    # ── 2. Perto de subir de nível ────────────────────────────────────────────
    xp_needed = 100.0 * user.level
    progress = user.xp / xp_needed if xp_needed > 0 else 0
    if progress >= 0.80:
        remaining = round(xp_needed - user.xp, 1)
        notifications.append(Notification(
            type=NotificationType.LEVEL_CLOSE,
            title="⚡ Quase lá!",
            message=f"Faltam apenas {remaining} XP para você alcançar o nível {user.level + 1}!",
            icon="⚡",
            priority=1,
        ))

    # ── 3. Conquista próxima ──────────────────────────────────────────────────
    completed_count = db.query(Task).filter(
        Task.user_id == user.id, Task.completed == True
    ).count()

    if completed_count >= 7 and completed_count < 10:
        notifications.append(Notification(
            type=NotificationType.ACHIEVEMENT,
            title="📚 Conquista próxima!",
            message=f"Complete mais {10 - completed_count} tarefa(s) para desbloquear 'Estudante Prolífico'!",
            icon="📚",
            priority=2,
        ))

    if user.streak >= 5 and user.streak < 7:
        notifications.append(Notification(
            type=NotificationType.ACHIEVEMENT,
            title="🏆 Semana Perfeita chegando!",
            message=f"Mais {7 - user.streak} dia(s) de streak para desbloquear 'Semana Perfeita'!",
            icon="🏆",
            priority=2,
        ))

    if user.total_xp >= 800 and user.total_xp < 1000:
        remaining_xp = round(1000 - user.total_xp, 1)
        notifications.append(Notification(
            type=NotificationType.ACHIEVEMENT,
            title="⭐ Mestre chegando!",
            message=f"Faltam {remaining_xp} XP para conquistar 'Mestre do Conhecimento'!",
            icon="⭐",
            priority=2,
        ))

    # ── 4. Bônus de classe ────────────────────────────────────────────────────
    meta = CLASS_META[user.character_class]
    multiplier = CLASS_XP_MULTIPLIER[user.character_class]
    bonus_pct = round((multiplier - 1) * 100)
    notifications.append(Notification(
        type=NotificationType.CLASS_BONUS,
        title=f"{meta['icon']} Bônus de {meta['label']}",
        message=f"Como {meta['label']}, você ganha +{bonus_pct}% de XP em todas as tarefas. Use isso a seu favor!",
        icon=meta["icon"],
        priority=3,
    ))

    # ── 5. Motivacional ───────────────────────────────────────────────────────
    pending_count = db.query(Task).filter(
        Task.user_id == user.id, Task.completed == False
    ).count()

    if pending_count == 0:
        notifications.append(Notification(
            type=NotificationType.MOTIVATIONAL,
            title="🎯 Sem tarefas pendentes!",
            message="Você zerou a lista! Crie novas tarefas para continuar evoluindo.",
            icon="🎯",
            priority=3,
        ))
    elif pending_count >= 5:
        notifications.append(Notification(
            type=NotificationType.MOTIVATIONAL,
            title="💪 Muitas missões te aguardam!",
            message=f"Você tem {pending_count} tarefas pendentes. Comece pela de maior XP!",
            icon="💪",
            priority=3,
        ))

    return sorted(notifications, key=lambda n: n.priority)