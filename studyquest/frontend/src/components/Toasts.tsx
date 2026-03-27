"use client";

import { useEffect } from "react";
import { Sparkles, X } from "lucide-react";

interface LevelUpToastProps {
  level: number;
  achievements: string[];
  onClose: () => void;
}

export function LevelUpToast({ level, achievements, onClose }: LevelUpToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-50 animate-level-up max-w-sm">
      <div className="quest-card border-quest-gold/50 glow-gold p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-4xl animate-float">⚡</div>
            <div>
              <p className="font-display font-bold text-quest-gold text-lg leading-tight">
                LEVEL UP!
              </p>
              <p className="font-body text-quest-text text-sm">
                Você alcançou o <span className="text-quest-gold font-bold">Nível {level}</span>!
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-quest-muted hover:text-quest-text transition-colors mt-0.5">
            <X className="w-4 h-4" />
          </button>
        </div>

        {achievements.length > 0 && (
          <div className="border-t border-quest-border pt-3 space-y-1">
            <p className="text-xs text-quest-muted font-body uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Conquistas desbloqueadas
            </p>
            {achievements.map((a, i) => (
              <p key={i} className="text-sm font-body text-quest-text font-semibold">
                🏆 {a}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface XpToastProps {
  xp: number;
  achievements: string[];
  onClose: () => void;
}

export function XpToast({ xp, achievements, onClose }: XpToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in">
      <div className="quest-card border-quest-purple/40 glow-purple p-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">⭐</div>
          <div>
            <p className="font-display font-bold text-xp-gradient text-base">+{xp} XP</p>
            {achievements.length > 0 && (
              <p className="text-xs text-quest-gold font-body mt-0.5">
                🏆 {achievements.join(", ")}
              </p>
            )}
          </div>
          <button onClick={onClose} className="ml-2 text-quest-muted hover:text-quest-text transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
