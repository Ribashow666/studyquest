"use client";

import { Sword, LogOut, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-quest-border bg-quest-bg/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-quest-card border border-quest-gold/30 flex items-center justify-center group-hover:border-quest-gold/60 transition-colors">
            <Sword className="w-4 h-4 text-quest-gold" />
          </div>
          <span className="font-display font-bold text-lg text-gold-gradient tracking-wide hidden sm:block">
            StudyQuest
          </span>
        </Link>

        {/* Right side */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 bg-quest-card border border-quest-gold/20 rounded-lg px-3 py-1.5 text-sm font-body">
              <span className="text-quest-gold font-display font-bold">Lv.{user.level}</span>
              <span className="text-quest-muted">·</span>
              <span className="text-quest-muted">{user.name}</span>
            </div>

            <Link
              href="/profile"
              title="Meu perfil"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-body transition-colors
                ${pathname === "/profile"
                  ? "bg-quest-gold/10 text-quest-gold border border-quest-gold/30"
                  : "text-quest-muted hover:text-quest-text"
                }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:block">Perfil</span>
            </Link>

            <button
              onClick={logout}
              title="Sair"
              className="flex items-center gap-1.5 text-quest-muted hover:text-quest-red transition-colors text-sm font-body"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Sair</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}