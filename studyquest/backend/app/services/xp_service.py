from dataclasses import dataclass
from typing import Optional


@dataclass
class LevelUpResult:
    new_level: int
    remaining_xp: float
    leveled_up: bool
    actual_xp_gained: float
    levels_gained: int = 0


def xp_required_for_level(level: int) -> float:
    """XP needed to advance from `level` to `level + 1`."""
    return 100.0 * level


# Multiplicadores por classe
_CLASS_MULTIPLIERS = {
    "sage":     1.15,
    "executor": 1.10,
    "warrior":  1.05,
    "mage":     1.20,
    "explorer": 1.10,
}


def apply_xp_gain(
    current_level: int,
    current_xp: float,
    xp_gained: float,
    character_class: Optional[str] = None,
) -> LevelUpResult:
    """
    Apply XP to a user and compute level-ups.
    Applies class multiplier if character_class is provided.
    Supports multiple level-ups in a single gain.
    """
    multiplier = _CLASS_MULTIPLIERS.get(str(character_class).lower(), 1.0) if character_class else 1.0
    actual_xp = round(xp_gained * multiplier, 2)

    new_xp = current_xp + actual_xp
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
        actual_xp_gained=actual_xp,
        levels_gained=levels_gained,
    )