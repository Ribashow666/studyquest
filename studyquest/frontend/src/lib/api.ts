import type {
  TokenResponse,
  User,
  Task,
  TaskCompleteResponse,
  CreateTaskPayload,
  Achievement,
} from "@/types";

const BASE_URL = "/api";
// ── Helpers ───────────────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("studyquest_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function register(
  name: string,
  email: string,
  password: string
): Promise<User> {
  return request<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function login(
  email: string,
  password: string
): Promise<TokenResponse> {
  return request<TokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ── User ──────────────────────────────────────────────────────────────────────

export async function getMe(): Promise<User> {
  return request<User>("/users/me", {}, true);
}

// ── Tasks ─────────────────────────────────────────────────────────────────────

export async function getTasks(): Promise<Task[]> {
  return request<Task[]>("/tasks", {}, true);
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  return request<Task>("/tasks", { method: "POST", body: JSON.stringify(payload) }, true);
}

export async function completeTask(taskId: number): Promise<TaskCompleteResponse> {
  return request<TaskCompleteResponse>(`/tasks/${taskId}/complete`, { method: "PATCH" }, true);
}

// ── Achievements ──────────────────────────────────────────────────────────────

export async function getAchievements(): Promise<Achievement[]> {
  return request<Achievement[]>("/achievements", {}, true);
}

// ── Local storage helpers ─────────────────────────────────────────────────────

export function saveToken(token: string) {
  localStorage.setItem("studyquest_token", token);
}

export function clearToken() {
  localStorage.removeItem("studyquest_token");
}

export function hasToken(): boolean {
  return !!getToken();
}
