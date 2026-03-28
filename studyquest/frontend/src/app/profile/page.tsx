"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { updateProfile, updatePassword, getClasses, hasToken } from "@/lib/api";
import type { CharacterClass } from "@/types";
import { Navbar } from "@/components/Navbar";
import {
  User, Mail, Lock, Shield, CheckCircle2,
  Loader2, AlertCircle, ArrowLeft, Sparkles
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();

  const [classes, setClasses] = useState<CharacterClass[]>([]);

  // ── Form states ───────────────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ── UI states ─────────────────────────────────────────────────────────────
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (!loading && !hasToken()) {
      router.replace("/login");
    }
  }, [loading, router]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setSelectedClass(user.character_class);
    }
  }, [user]);

  useEffect(() => {
    getClasses().then(setClasses).catch(() => {});
  }, []);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess(false);
    setProfileLoading(true);

    try {
      await updateProfile({
        name: name !== user?.name ? name : undefined,
        email: email !== user?.email ? email : undefined,
        character_class: selectedClass !== user?.character_class ? selectedClass : undefined,
      });
      await refreshUser();
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      setProfileError(err.message || "Erro ao atualizar perfil");
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas não coincidem");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Nova senha deve ter ao menos 6 caracteres");
      return;
    }

    setPasswordLoading(true);
    try {
      await updatePassword({ current_password: currentPassword, new_password: newPassword });
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(err.message || "Erro ao atualizar senha");
    } finally {
      setPasswordLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl animate-float">⚔️</div>
          <p className="font-display text-quest-gold animate-pulse">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 animate-fade-in">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-quest-muted hover:text-quest-text transition-colors text-sm font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-quest-text">
              Meu <span className="text-gold-gradient">Perfil</span>
            </h1>
            <p className="text-quest-muted font-body text-sm mt-0.5">
              Gerencie suas informações e personagem
            </p>
          </div>
        </div>

        {/* User summary card */}
        <div className="quest-card p-6 flex items-center gap-5 animate-slide-in">
          <div className="w-16 h-16 rounded-2xl bg-quest-bg border border-quest-gold/30 flex items-center justify-center text-3xl glow-gold flex-shrink-0">
            {user.class_icon}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-xl font-bold text-quest-text">{user.name}</h2>
            <p className="text-quest-muted font-body text-sm">{user.email}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs font-mono bg-quest-bg border border-quest-gold/30 text-quest-gold px-2 py-0.5 rounded-lg">
                Lv. {user.level}
              </span>
              <span className="text-xs font-body text-quest-muted">
                {user.class_icon} {user.class_label}
              </span>
              <span className="text-xs font-mono text-quest-purple">
                {Math.round(user.total_xp)} XP total
              </span>
            </div>
          </div>
        </div>

        {/* Profile info form */}
        <div className="quest-card p-6 animate-slide-in" style={{ animationDelay: "60ms" }}>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-quest-gold/10 border border-quest-gold/20 flex items-center justify-center">
              <User className="w-4 h-4 text-quest-gold" />
            </div>
            <h3 className="font-display text-base font-bold text-quest-text">Informações Pessoais</h3>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div>
              <label className="quest-label">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="quest-input"
                minLength={2}
                maxLength={100}
                required
              />
            </div>

            <div>
              <label className="quest-label">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="quest-input"
                required
              />
            </div>

            {/* Character class picker */}
            <div>
              <label className="quest-label">Classe do Personagem</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {classes.map((cls) => (
                  <button
                    key={cls.key}
                    type="button"
                    onClick={() => setSelectedClass(cls.key)}
                    className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200
                      ${selectedClass === cls.key
                        ? "border-quest-gold/60 bg-quest-gold/8 glow-gold"
                        : "border-quest-border bg-quest-bg hover:border-quest-gold/30"
                      }`}
                  >
                    <span className="text-2xl flex-shrink-0 mt-0.5">{cls.icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`font-display text-sm font-bold ${selectedClass === cls.key ? "text-quest-gold" : "text-quest-text"}`}>
                          {cls.label}
                        </p>
                        <span className="text-xs font-mono text-quest-purple">+{Math.round((cls.xp_multiplier - 1) * 100)}% XP</span>
                      </div>
                      <p className="text-xs text-quest-muted font-body mt-0.5 leading-relaxed">
                        {cls.description}
                      </p>
                    </div>
                    {selectedClass === cls.key && (
                      <CheckCircle2 className="w-4 h-4 text-quest-gold flex-shrink-0 mt-0.5 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {profileError && (
              <div className="flex items-center gap-2 bg-quest-red/10 border border-quest-red/30 rounded-lg px-4 py-3 text-quest-red text-sm font-body">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {profileError}
              </div>
            )}

            {profileSuccess && (
              <div className="flex items-center gap-2 bg-quest-green/10 border border-quest-green/30 rounded-lg px-4 py-3 text-quest-green text-sm font-body">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                Perfil atualizado com sucesso!
              </div>
            )}

            <button
              type="submit"
              disabled={profileLoading}
              className="quest-btn-primary flex items-center gap-2"
            >
              {profileLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Salvar alterações
            </button>
          </form>
        </div>

        {/* Password form */}
        <div className="quest-card p-6 animate-slide-in" style={{ animationDelay: "120ms" }}>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-quest-purple/10 border border-quest-purple/20 flex items-center justify-center">
              <Lock className="w-4 h-4 text-quest-purple" />
            </div>
            <h3 className="font-display text-base font-bold text-quest-text">Alterar Senha</h3>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div>
              <label className="quest-label">Senha atual</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="quest-input"
                required
              />
            </div>

            <div>
              <label className="quest-label">Nova senha</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres (maiúscula, minúscula e número)"
                className="quest-input"
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="quest-label">Confirmar nova senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                className={`quest-input ${
                  confirmPassword && newPassword !== confirmPassword
                    ? "border-quest-red/50 focus:border-quest-red/70"
                    : ""
                }`}
                required
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-quest-red text-xs mt-1 font-body">As senhas não coincidem</p>
              )}
            </div>

            {passwordError && (
              <div className="flex items-center gap-2 bg-quest-red/10 border border-quest-red/30 rounded-lg px-4 py-3 text-quest-red text-sm font-body">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="flex items-center gap-2 bg-quest-green/10 border border-quest-green/30 rounded-lg px-4 py-3 text-quest-green text-sm font-body">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                Senha alterada com sucesso!
              </div>
            )}

            <button
              type="submit"
              disabled={passwordLoading || (!!confirmPassword && newPassword !== confirmPassword)}
              className="quest-btn-secondary flex items-center gap-2"
            >
              {passwordLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              Alterar senha
            </button>
          </form>
        </div>

        {/* Stats card (read-only) */}
        <div className="quest-card p-6 animate-slide-in" style={{ animationDelay: "180ms" }}>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-quest-blue/10 border border-quest-blue/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-quest-blue" />
            </div>
            <h3 className="font-display text-base font-bold text-quest-text">Estatísticas</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Nível", value: user.level, icon: "⚔️" },
              { label: "XP Total", value: `${Math.round(user.total_xp)}`, icon: "⭐" },
              { label: "Streak", value: `${user.streak}d`, icon: "🔥" },
              { label: "Membro desde", value: new Date(user.created_at).toLocaleDateString("pt-BR", { month: "short", year: "numeric" }), icon: "📅" },
            ].map((stat) => (
              <div key={stat.label} className="bg-quest-bg border border-quest-border rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="font-mono text-lg font-bold text-quest-text">{stat.value}</div>
                <div className="text-xs text-quest-muted font-body uppercase tracking-wide mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}