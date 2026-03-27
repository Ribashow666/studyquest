from datetime import datetime, timezone, date


def update_streak(last_activity_date: datetime | None, current_streak: int) -> tuple[int, datetime]:
    """
    Returns (new_streak, new_last_activity_date).

    Rules:
    - Same day  → streak unchanged (already counted today)
    - Next day  → streak + 1
    - Skipped   → reset to 1
    """
    now = datetime.now(timezone.utc)
    today: date = now.date()

    if last_activity_date is None:
        return 1, now

    last_date: date = last_activity_date.date()

    if last_date == today:
        # Already studied today, don't double-count
        return current_streak, last_activity_date

    delta = (today - last_date).days

    if delta == 1:
        return current_streak + 1, now
    else:
        # Missed one or more days
        return 1, now
