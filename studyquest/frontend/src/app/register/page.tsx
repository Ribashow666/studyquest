"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register, login } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Shield, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      const tokenData = await login(email, password);
      await setToken(tokenData.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-quest-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-quest-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-quest-card border border-quest-purple/30 mb-4 glow-purple animate-float">
            <Shield className="w-8 h-8 text-quest-purple" />
          </div>
          <h1 className="font-display text-3xl font-bold text-gold-gradient tracking-wide">
            StudyQuest
          </h1>
          <p className="text-quest-muted font-body mt-2 text-sm tracking-widest uppercase">
            Inicie sua jornada
          </p>
        </div>

        {/* Card */}
        <div className="quest-card p-8">
          <h2 className="font-display text-lg font-semibold text-quest-text mb-6 text-center">
            Criar personagem
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="quest-label">Nome do herói</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome de aventureiro"
                required
                minLength={2}
                maxLength={100}
                className="quest-input"
              />
            </div>

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
                placeholder="Mínimo 8 caracteres (maiúscula, minúscula e número)"
                required
                minLength={6}
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
                <span className="animate-pulse">Criando herói...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Iniciar aventura
                </>
              )}
            </button>
          </form>

          <p className="text-center text-quest-muted text-sm mt-6 font-body">
            Já tem conta?{" "}
            <Link href="/login" className="text-quest-gold hover:text-quest-amber transition-colors font-semibold">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
