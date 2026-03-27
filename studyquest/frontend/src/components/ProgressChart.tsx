"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Task } from "@/types";

interface ProgressChartProps {
  tasks: Task[];
}

export function ProgressChart({ tasks }: ProgressChartProps) {
  const data = useMemo(() => {
    const completed = tasks
      .filter((t) => t.completed && t.completed_at)
      .sort((a, b) => new Date(a.completed_at!).getTime() - new Date(b.completed_at!).getTime());

    let cumulative = 0;
    const points: { date: string; xp: number; tasks: number }[] = [];
    const byDay: Record<string, { xp: number; count: number }> = {};

    for (const t of completed) {
      const day = new Date(t.completed_at!).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
      if (!byDay[day]) byDay[day] = { xp: 0, count: 0 };
      byDay[day].xp += t.xp_reward;
      byDay[day].count += 1;
    }

    for (const [date, stats] of Object.entries(byDay)) {
      cumulative += stats.xp;
      points.push({ date, xp: Math.round(cumulative), tasks: stats.count });
    }

    return points;
  }, [tasks]);

  if (data.length === 0) {
    return (
      <div className="quest-card p-6">
        <h3 className="font-display text-lg font-bold text-quest-text mb-4">Progresso de XP</h3>
        <div className="flex items-center justify-center h-40 text-quest-muted font-body text-sm">
          <p>Complete tarefas para ver seu progresso 📈</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quest-card p-6">
      <h3 className="font-display text-lg font-bold text-quest-text mb-6">Progresso de XP</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2130" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono" }}
            axisLine={{ stroke: "#1e2130" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono" }}
            axisLine={false}
            tickLine={false}
            width={45}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111318",
              border: "1px solid #1e2130",
              borderRadius: "10px",
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "13px",
              color: "#e2e8f0",
            }}
            labelStyle={{ color: "#f5c842", fontFamily: "Cinzel, serif", fontSize: "11px" }}
            formatter={(value: number, name: string) => [
              name === "xp" ? `${value} XP` : `${value} tarefas`,
              name === "xp" ? "XP Acumulado" : "Tarefas",
            ]}
          />
          <Area
            type="monotone"
            dataKey="xp"
            stroke="#8b5cf6"
            strokeWidth={2.5}
            fill="url(#xpGradient)"
            dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, fill: "#f5c842", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
