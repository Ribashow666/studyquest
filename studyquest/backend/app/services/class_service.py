"""
RPG Classes System
==================
Each class has a flavor description, icon, and a task-category XP bonus.
When a user completes a task, the bonus multiplier from their class is applied
to the base XP reward.

Classes:
  novato    — No bonus, starting class (unlocked at level 1)
  sabio     — Sábio: bonus on long/research tasks (unlocked at level 3)
  executor  — Executor: bonus on quick/practice tasks (unlocked at level 3)
  guardian  — Guardião: bonus on streak maintenance (unlocked at level 5)
  arcano    — Arcano: bonus on high-XP tasks (unlocked at level 8)
  lendario  — Lendário: all-round bonus (unlocked at level 15)
"""

from dataclasses import dataclass


@dataclass(frozen=True)
class RpgClass:
    key: str
    name: str
    icon: str
    description: str
    xp_multiplier: float   # global multiplier applied to all task XP
    unlock_level: int
    bonus_description: str


RPG_CLASSES: dict[str, RpgClass] = {
    "novato": RpgClass(
        key="novato",
        name="Novato",
        icon="🌱",
        description="Todo grande mestre já foi um iniciante. Sua jornada começa agora.",
        xp_multiplier=1.0,
        unlock_level=1,
        bonus_description="Sem bônus especial — você ainda está descobrindo seu caminho.",
    ),
    "sabio": RpgClass(
        key="sabio",
        name="Sábio",
        icon="📖",
        description="Conhecimento é poder. O Sábio absorve tudo como uma esponja.",
        xp_multiplier=1.15,
        unlock_level=3,
        bonus_description="+15% XP em todas as tarefas. Especialista em absorver conhecimento.",
    ),
    "executor": RpgClass(
        key="executor",
        name="Executor",
        icon="⚡",
        description="Ação acima de tudo. O Executor transforma planos em resultados.",
        xp_multiplier=1.10,
        unlock_level=3,
        bonus_description="+10% XP + bônus dobrado de streak.",
    ),
    "guardian": RpgClass(
        key="guardian",
        name="Guardião",
        icon="🛡️",
        description="Disciplina inabalável. O Guardião nunca quebra sua corrente.",
        xp_multiplier=1.05,
        unlock_level=5,
        bonus_description="+5% XP + streak nunca reseta por 1 dia perdido.",
    ),
    "arcano": RpgClass(
        key="arcano",
        name="Arcano",
        icon="🔮",
        description="Mestre das artes ocultas do conhecimento. Poder bruto, sem limites.",
        xp_multiplier=1.20,
        unlock_level=8,
        bonus_description="+20% XP em todas as tarefas.",
    ),
    "lendario": RpgClass(
        key="lendario",
        name="Lendário",
        icon="👑",
        description="Poucos chegam aqui. Você não é apenas um estudante — é uma lenda.",
        xp_multiplier=1.30,
        unlock_level=15,
        bonus_description="+30% XP em tudo. A classe máxima do StudyQuest.",
    ),
}


def get_class(key: str) -> RpgClass:
    return RPG_CLASSES.get(key, RPG_CLASSES["novato"])


def get_all_classes() -> list[RpgClass]:
    return list(RPG_CLASSES.values())


def available_classes_for_level(level: int) -> list[RpgClass]:
    return [c for c in RPG_CLASSES.values() if c.unlock_level <= level]


def apply_class_multiplier(base_xp: float, rpg_class_key: str) -> float:
    cls = get_class(rpg_class_key)
    return round(base_xp * cls.xp_multiplier, 2)