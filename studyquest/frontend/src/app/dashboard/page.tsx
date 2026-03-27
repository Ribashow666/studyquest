"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getTasks, getAchievements } from "@/lib/api";
import type { Task, Achievement, TaskCompleteResponse } from "@/types";
import { Navbar } from "@/components/Navbar";
import { UserStats } from "@/components/UserStats";
import { TaskList } from "@/components/TaskList";
import { Achievements } from "@/components/Achievements";
import { ProgressChart } from "@/components/ProgressChart";
import { LevelUpToast, XpToast } from "@/components/Toasts";
import { hasToken } from "@/lib/api";

interface ToastState {
  type: "xp" | "levelup";
  xp: number;
  level: number;
  achievements: string[];
}

export default function DashboardPage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !hasToken()) {
      router.replace("/login");
    }
  }, [loading, router]);

  const loadData = useCallback(async () => {
    try {
      const [tasksData, achievementsData] = await Promise.all([
        getTasks(),
        getAchievements(),
      ]);
      setTasks(tasksData);
      setAchievements(achievementsData);
    } catch {
      // Token might be invalid
      router.replace("/login");
    } finally {
      setDataLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!loading && user) {
      loadData();
    }
  }, [loading, user, loadData]);

  async function handleTaskComplete(result: TaskCompleteResponse) {
    // Optimistically update tasks
    setTasks((prev) =>
      prev.map((t) => (t.id === result.task.id ? result.task : t))
    );

    // Refresh user data from server (XP, level, streak updated)
    await refreshUser();
    await getAchievements().then(setAchievements);

    // Show toast
    setToast({
      type: result.level_up ? "levelup" : "xp",
      xp: result.xp_gained,
      level: result.new_level,
      achievements: result.achievements_unlocked,
    });
  }

  function handleTaskCreated(task: Task) {
    setTasks((prev) => [task, ...prev]);
  }

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl animate-float">⚔️</div>
          <p className="font-display text-quest-gold animate-pulse">Carregando aventura...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Page title */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-2xl font-bold text-quest-text">
            Bem-vindo de volta,{" "}
            <span className="text-gold-gradient">{user.name.split(" ")[0]}</span>! 🗡️
          </h1>
          <p className="text-quest-muted font-body mt-1">
            Continue sua jornada de conhecimento. Cada tarefa te aproxima da maestria.
          </p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="animate-slide-in" style={{ animationDelay: "0ms" }}>
              <UserStats user={user} />
            </div>
            <div className="animate-slide-in" style={{ animationDelay: "80ms" }}>
              <Achievements achievements={achievements} />
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-slide-in" style={{ animationDelay: "120ms" }}>
              <ProgressChart tasks={tasks} />
            </div>
            <div className="animate-slide-in" style={{ animationDelay: "160ms" }}>
              <TaskList
                tasks={tasks}
                onTaskComplete={handleTaskComplete}
                onTaskCreated={handleTaskCreated}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Toasts */}
      {toast?.type === "levelup" && (
        <LevelUpToast
          level={toast.level}
          achievements={toast.achievements}
          onClose={() => setToast(null)}
        />
      )}
      {toast?.type === "xp" && (
        <XpToast
          xp={toast.xp}
          achievements={toast.achievements}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
