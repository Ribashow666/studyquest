"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Sword, BookOpen } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);
      await setToken(data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-quest-purple/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-quest-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-quest-card border border-quest-gold/30 mb-4 glow-gold animate-float">
            <Sword className="w-8 h-8 text-quest-gold" />
          </div>
          <h1 className="font-display text-3xl font-bold text-gold-gradient tracking-wide">
            StudyQuest
          </h1>
          <p className="text-quest-muted font-body mt-2 text-sm tracking-widest uppercase">
            Level up your knowledge
          </p>
        </div>

        {/* Card */}
        <div className="quest-card p-8">
          <h2 className="font-display text-lg font-semibold text-quest-text mb-6 text-center">
            Entrar na aventura
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="quest-label">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="quest-input"
              />
            </div>

            <div>
              <label className="quest-label">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="quest-input"
              />
            </div>

            {error && (
              <div className="bg-quest-red/10 border border-quest-red/30 rounded-lg px-4 py-3 text-quest-red text-sm font-body">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="quest-btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">Entrando...</span>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  Começar a estudar
                </>
              )}
            </button>
          </form>

          <p className="text-center text-quest-muted text-sm mt-6 font-body">
            Novo herói?{" "}
            <Link href="/register" className="text-quest-gold hover:text-quest-amber transition-colors font-semibold">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
