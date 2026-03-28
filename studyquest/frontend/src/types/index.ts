// ── Auth ──────────────────────────────────────────────────────────────────────
export interface TokenResponse {
  access_token: string;
  token_type: string;
}

// ── User ──────────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  level: number;
  xp: number;
  total_xp: number;
  streak: number;
  created_at: string;
  character_class: string;
  class_label: string;
  class_icon: string;
  xp_for_next_level: number;
  xp_progress_percent: number;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  character_class?: string;
}

export interface UpdatePasswordPayload {
  current_password: string;
  new_password: string;
}

export interface CharacterClass {
  key: string;
  label: string;
  icon: string;
  description: string;
  xp_multiplier: number;
}

// ── Tasks ─────────────────────────────────────────────────────────────────────
export type TaskDifficulty = "easy" | "medium" | "hard" | "legendary";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  difficulty: TaskDifficulty;
  difficulty_label: string;
  difficulty_icon: string;
  xp_reward: number;
  completed: boolean;
  completed_at: string | null;
  user_id: number;
  created_at: string;
}

export interface TaskCompleteResponse {
  task: Task;
  xp_gained: number;
  level_up: boolean;
  new_level: number;
  new_xp: number;
  new_streak: number;
  achievements_unlocked: string[];
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  difficulty: TaskDifficulty;
}

// ── Achievements ──────────────────────────────────────────────────────────────
export interface Achievement {
  id: number;
  key: string;
  title: string;
  description: string;
  icon: string;
  xp_bonus: number;
  unlocked: boolean;
  unlocked_at: string | null;
}

// ── API errors ────────────────────────────────────────────────────────────────
export interface ApiError {
  detail: string;
}