"use client";

import { Flame, Star, Zap, Trophy } from "lucide-react";
import type { User } from "@/types";
import { XpBar } from "./XpBar";

interface UserStatsProps {
  user: User;
}

export function UserStats({ user }: UserStatsProps) {
  return (
    <div className="quest-card p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-quest-text">{user.name}</h2>
          <p className="text-quest-muted text-sm font-body mt-0.5">{user.email}</p>
        </div>
        <div className="flex flex-col items-center bg-quest-bg border border-quest-gold/30 rounded-xl px-4 py-2 glow-gold">
          <span className="text-xs text-quest-gold font-display uppercase tracking-widest">Nível</span>
          <span className="text-3xl font-display font-black text-gold-gradient leading-tight">
            {user.level}
          </span>
        </div>
      </div>

      {/* XP Bar */}
      <XpBar user={user} />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={<Flame className="w-4 h-4 text-quest-amber" />}
          label="Streak"
          value={`${user.streak}d`}
          color="amber"
        />
        <StatCard
          icon={<Star className="w-4 h-4 text-quest-gold" />}
          label="XP Total"
          value={formatXP(user.total_xp)}
          color="gold"
        />
        <StatCard
          icon={<Zap className="w-4 h-4 text-quest-purple" />}
          label="XP Atual"
          value={formatXP(user.xp)}
          color="purple"
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "gold" | "amber" | "purple";
}) {
  const border = {
    gold: "border-quest-gold/20 hover:border-quest-gold/40",
    amber: "border-quest-amber/20 hover:border-quest-amber/40",
    purple: "border-quest-purple/20 hover:border-quest-purple/40",
  }[color];

  return (
    <div
      className={`bg-quest-bg border ${border} rounded-xl p-3 flex flex-col items-center gap-1.5 transition-colors`}
    >
      {icon}
      <span className="font-mono text-lg font-bold text-quest-text leading-none">{value}</span>
      <span className="text-quest-muted text-xs font-body uppercase tracking-wide">{label}</span>
    </div>
  );
}

function formatXP(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return Math.round(xp).toString();
}
