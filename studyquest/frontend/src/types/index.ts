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
  xp_for_next_level: number;
  xp_progress_percent: number;
}

// ── Tasks ─────────────────────────────────────────────────────────────────────
export interface Task {
  id: number;
  title: string;
  description: string | null;
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
  xp_reward: number;
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
