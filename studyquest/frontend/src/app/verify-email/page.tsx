"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, Sword } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token de verificação não encontrado.");
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    fetch(`${apiUrl}/auth/verify-email?token=${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(data.message);
          setTimeout(() => router.push("/login"), 3000);
        } else {
          setStatus("error");
          setMessage(data.detail || "Erro ao verificar email.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Erro de conexão. Tente novamente.");
      });
  }, [token, router]);

  return (
    <div className="quest-card p-8 text-center space-y-5">
      {status === "loading" && (
        <>
          <Loader2 className="w-12 h-12 text-quest-gold animate-spin mx-auto" />
          <p className="font-display text-lg text-quest-text">Verificando seu email...</p>
        </>
      )}
      {status === "success" && (
        <>
          <CheckCircle2 className="w-12 h-12 text-quest-green mx-auto" />
          <h2 className="font-display text-xl font-bold text-quest-green">Email verificado!</h2>
          <p className="font-body text-quest-muted">{message}</p>
          <p className="font-body text-quest-muted text-sm">Redirecionando em 3 segundos...</p>
          <Link href="/login" className="quest-btn-primary inline-flex items-center gap-2">
            Ir para o login
          </Link>
        </>
      )}
      {status === "error" && (
        <>
          <XCircle className="w-12 h-12 text-quest-red mx-auto" />
          <h2 className="font-display text-xl font-bold text-quest-red">Ops!</h2>
          <p className="font-body text-quest-muted">{message}</p>
          <Link href="/register" className="quest-btn-secondary inline-flex items-center gap-2">
            Criar nova conta
          </Link>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-quest-purple/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-quest-gold/5 rounded-full blur-3xl" />
      </div>
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-quest-card border border-quest-gold/30 mb-4 glow-gold animate-float">
            <Sword className="w-8 h-8 text-quest-gold" />
          </div>
          <h1 className="font-display text-3xl font-bold text-gold-gradient tracking-wide">
            StudyQuest
          </h1>
        </div>
        <Suspense fallback={
          <div className="quest-card p-8 text-center">
            <Loader2 className="w-12 h-12 text-quest-gold animate-spin mx-auto" />
          </div>
        }>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}