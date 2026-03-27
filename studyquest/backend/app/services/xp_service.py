from dataclasses import dataclass, field


@dataclass
class LevelUpResult:
    new_level: int
    remaining_xp: float
    leveled_up: bool
    levels_gained: int = 0


def xp_required_for_level(level: int) -> float:
    """XP needed to advance from `level` to `level + 1`."""
    return 100.0 * level


def apply_xp_gain(current_level: int, current_xp: float, xp_gained: float) -> LevelUpResult:
    """
    Apply XP to a user and compute level-ups.
    Supports multiple level-ups in a single gain (e.g. large XP rewards).
    """
    new_xp = current_xp + xp_gained
    new_level = current_level
    leveled_up = False
    levels_gained = 0

    while True:
        threshold = xp_required_for_level(new_level)
        if new_xp >= threshold:
            new_xp -= threshold
            new_level += 1
            leveled_up = True
            levels_gained += 1
        else:
            break

    return LevelUpResult(
        new_level=new_level,
        remaining_xp=new_xp,
        leveled_up=leveled_up,
        levels_gained=levels_gained,
    )
