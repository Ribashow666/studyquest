"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Plus, Loader2, X, ChevronDown, ChevronUp } from "lucide-react";
import type { Task, TaskCompleteResponse, CreateTaskPayload, TaskDifficulty } from "@/types";
import { createTask, completeTask } from "@/lib/api";

interface TaskListProps {
  tasks: Task[];
  onTaskComplete: (result: TaskCompleteResponse) => void;
  onTaskCreated: (task: Task) => void;
}

const DIFFICULTIES: { key: TaskDifficulty; label: string; icon: string; xp: number; description: string }[] = [
  { key: "easy",      label: "Fácil",    icon: "🟢", xp: 25,  description: "Revisão rápida, leitura leve" },
  { key: "medium",    label: "Médio",    icon: "🟡", xp: 50,  description: "Estudo focado, exercícios" },
  { key: "hard",      label: "Difícil",  icon: "🔴", xp: 100, description: "Problema complexo, projeto" },
  { key: "legendary", label: "Lendário", icon: "💀", xp: 200, description: "Desafio épico, maratona" },
];

export function TaskList({ tasks, onTaskComplete, onTaskCreated }: TaskListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const pending = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  async function handleComplete(taskId: number) {
    setCompletingId(taskId);
    try {
      const result = await completeTask(taskId);
      onTaskComplete(result);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCompletingId(null);
    }
  }

  return (
    <div className="quest-card p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-quest-text">Tarefas de Estudo</h3>
        <button
          onClick={() => setShowCreateForm((v) => !v)}
          className="flex items-center gap-1.5 text-sm font-body font-semibold
                     text-quest-gold hover:text-quest-amber transition-colors"
        >
          {showCreateForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showCreateForm ? "Cancelar" : "Nova tarefa"}
        </button>
      </div>

      {/* Create form */}
      {showCreateForm && (
        <CreateTaskForm
          onCreated={(t) => {
            onTaskCreated(t);
            setShowCreateForm(false);
          }}
        />
      )}

      {/* Pending tasks */}
      {pending.length === 0 && !showCreateForm && (
        <div className="text-center py-10 text-quest-muted font-body">
          <div className="text-4xl mb-3">📚</div>
          <p>Nenhuma tarefa pendente.</p>
          <p className="text-sm mt-1">Crie uma para começar a ganhar XP!</p>
        </div>
      )}

      <div className="space-y-2">
        {pending.map((task, i) => (
          <TaskItem
            key={task.id}
            task={task}
            onComplete={handleComplete}
            completing={completingId === task.id}
            style={{ animationDelay: `${i * 60}ms` }}
          />
        ))}
      </div>

      {/* Completed section */}
      {completed.length > 0 && (
        <div>
          <button
            onClick={() => setShowCompleted((v) => !v)}
            className="flex items-center gap-2 text-quest-muted text-sm font-body hover:text-quest-text transition-colors"
          >
            {showCompleted ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Concluídas ({completed.length})
          </button>

          {showCompleted && (
            <div className="space-y-2 mt-3 opacity-60">
              {completed.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onComplete={handleComplete}
                  completing={false}
                  disabled
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── TaskItem ──────────────────────────────────────────────────────────────────

function difficultyColor(difficulty: string) {
  switch (difficulty) {
    case "easy":      return "text-quest-green";
    case "medium":    return "text-quest-gold";
    case "hard":      return "text-quest-red";
    case "legendary": return "text-quest-purple";
    default:          return "text-quest-muted";
  }
}

function TaskItem({
  task,
  onComplete,
  completing,
  disabled,
  style,
}: {
  task: Task;
  onComplete: (id: number) => void;
  completing: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  const icon = task.difficulty_icon ?? "🟡";
  const xpColor = difficultyColor(task.difficulty);

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 animate-slide-in
        ${task.completed
          ? "border-quest-border bg-quest-bg/50"
          : "border-quest-border bg-quest-bg hover:border-quest-gold/30 hover:bg-quest-card"
        }`}
      style={style}
    >
      <button
        onClick={() => !task.completed && !disabled && onComplete(task.id)}
        disabled={task.completed || disabled || completing}
        className="flex-shrink-0 transition-all duration-200 hover:scale-110 disabled:cursor-default"
      >
        {completing ? (
          <Loader2 className="w-5 h-5 text-quest-gold animate-spin" />
        ) : task.completed ? (
          <CheckCircle2 className="w-5 h-5 text-quest-green" />
        ) : (
          <Circle className="w-5 h-5 text-quest-muted hover:text-quest-gold" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`font-body font-semibold truncate ${
            task.completed ? "line-through text-quest-muted" : "text-quest-text"
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-quest-muted truncate mt-0.5">{task.description}</p>
        )}
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="text-base">{icon}</span>
        <span className={`font-mono text-sm font-bold ${xpColor}`}>+{task.xp_reward} XP</span>
      </div>
    </div>
  );
}

// ── CreateTaskForm ────────────────────────────────────────────────────────────

function CreateTaskForm({ onCreated }: { onCreated: (t: Task) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<TaskDifficulty>("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    if (!title.trim()) return;
    setLoading(true);
    setError("");
    try {
      const payload: CreateTaskPayload = {
        title: title.trim(),
        description: description.trim() || undefined,
        difficulty,
      };
      const task = await createTask(payload);
      onCreated(task);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-quest-bg border border-quest-gold/20 rounded-xl p-4 space-y-4 animate-slide-in">
      <div>
        <label className="quest-label">Título *</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Estudar capítulo 3 de Algoritmos"
          className="quest-input"
          maxLength={200}
        />
      </div>

      <div>
        <label className="quest-label">Descrição</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Opcional"
          className="quest-input"
          maxLength={1000}
        />
      </div>

      <div>
        <label className="quest-label">Dificuldade</label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => setDifficulty(d.key)}
              className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all duration-200
                ${difficulty === d.key
                  ? "border-quest-gold/60 bg-quest-gold/8"
                  : "border-quest-border bg-quest-card hover:border-quest-border/80"
                }`}
            >
              <span className="text-xl">{d.icon}</span>
              <div>
                <p className={`font-body font-bold text-sm ${difficulty === d.key ? "text-quest-gold" : "text-quest-text"}`}>
                  {d.label}
                </p>
                <p className="text-xs text-quest-muted font-mono">+{d.xp} XP</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-quest-red text-sm">{error}</p>
      )}

      <button
        onClick={handleCreate}
        disabled={loading || !title.trim()}
        className="quest-btn-primary w-full flex items-center justify-center gap-2"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
        Criar tarefa
      </button>
    </div>
  );
}