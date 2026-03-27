"use client";

import type { Achievement } from "@/types";

interface AchievementsProps {
  achievements: Achievement[];
}

export function Achievements({ achievements }: AchievementsProps) {
  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  return (
    <div className="quest-card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-quest-text">Conquistas</h3>
        <span className="text-xs font-mono text-quest-muted bg-quest-bg border border-quest-border px-2 py-1 rounded-lg">
          {unlocked.length}/{achievements.length}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {unlocked.map((ach) => (
          <AchievementCard key={ach.id} achievement={ach} />
        ))}
        {locked.map((ach) => (
          <AchievementCard key={ach.id} achievement={ach} />
        ))}
      </div>
    </div>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const { unlocked } = achievement;

  return (
    <div
      className={`flex items-center gap-4 p-3.5 rounded-xl border transition-all duration-200
        ${unlocked
          ? "border-quest-gold/30 bg-quest-gold/5 hover:border-quest-gold/50"
          : "border-quest-border bg-quest-bg opacity-50"
        }`}
    >
      <div
        className={`text-2xl w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0
          ${unlocked ? "bg-quest-gold/10" : "bg-quest-border/50 grayscale"}`}
      >
        {achievement.icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`font-body font-bold text-sm ${unlocked ? "text-quest-text" : "text-quest-muted"}`}>
          {achievement.title}
        </p>
        <p className="text-xs text-quest-muted truncate">{achievement.description}</p>
      </div>

      <div className="flex-shrink-0 text-right">
        <span className="text-xs font-mono text-quest-purple">+{achievement.xp_bonus} XP</span>
        {unlocked && achievement.unlocked_at && (
          <p className="text-xs text-quest-muted mt-0.5">
            {new Date(achievement.unlocked_at).toLocaleDateString("pt-BR")}
          </p>
        )}
        {!unlocked && (
          <span className="text-xs text-quest-muted">🔒</span>
        )}
      </div>
    </div>
  );
}
