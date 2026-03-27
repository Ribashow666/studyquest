"use client";

import { useEffect, useRef } from "react";
import type { User } from "@/types";

interface XpBarProps {
  user: User;
}

export function XpBar({ user }: XpBarProps) {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fillRef.current) {
      fillRef.current.style.setProperty("--xp-width", `${user.xp_progress_percent}%`);
      fillRef.current.style.width = `${user.xp_progress_percent}%`;
    }
  }, [user.xp_progress_percent]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-quest-muted">XP</span>
        <span className="text-quest-purple">
          {Math.round(user.xp)} / {Math.round(user.xp_for_next_level)}
        </span>
      </div>
      <div className="xp-bar-track">
        <div
          ref={fillRef}
          className="xp-bar-fill"
          style={{ width: `${user.xp_progress_percent}%` }}
        />
      </div>
      <div className="text-right text-xs text-quest-muted font-mono">
        {user.xp_progress_percent.toFixed(1)}%
      </div>
    </div>
  );
}
