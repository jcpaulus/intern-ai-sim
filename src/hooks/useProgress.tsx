import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface ProgressEntry {
  step_id: string;
  status: "in_progress" | "completed";
  metadata: Record<string, any>;
  updated_at: string;
}

export const STEPS = {
  ONBOARDING: "onboarding",
  ROLE_SELECTION: "role_selection",
  SIMULATION_SETUP: "simulation_setup",
  ORIENTATION: "orientation",
  SIMULATION: "simulation",
  FEEDBACK: "feedback",
} as const;

export type StepId = (typeof STEPS)[keyof typeof STEPS];

export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<string, ProgressEntry>>({});
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    const { data, error } = await supabase
      .from("user_progress")
      .select("step_id, status, metadata, updated_at")
      .eq("user_id", user.id);

    if (error) {
      console.error("[useProgress] fetch error:", error);
    } else if (data) {
      const map: Record<string, ProgressEntry> = {};
      for (const row of data) {
        map[row.step_id] = {
          step_id: row.step_id,
          status: row.status as "in_progress" | "completed",
          metadata: (row.metadata as Record<string, any>) || {},
          updated_at: row.updated_at,
        };
      }
      setProgress(map);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchProgress(); }, [fetchProgress]);

  const saveProgress = useCallback(
    async (stepId: string, status: "in_progress" | "completed", metadata: Record<string, any> = {}) => {
      if (!user) return;

      // Merge with existing metadata
      const existing = progress[stepId]?.metadata || {};
      const merged = { ...existing, ...metadata };

      const { error } = await supabase
        .from("user_progress")
        .upsert(
          {
            user_id: user.id,
            step_id: stepId,
            status,
            metadata: merged,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,step_id" }
        );

      if (error) {
        console.error("[useProgress] save error:", error);
      } else {
        setProgress((prev) => ({
          ...prev,
          [stepId]: { step_id: stepId, status, metadata: merged, updated_at: new Date().toISOString() },
        }));
      }
    },
    [user, progress]
  );

  const getStep = useCallback(
    (stepId: string): ProgressEntry | null => progress[stepId] || null,
    [progress]
  );

  const isCompleted = useCallback(
    (stepId: string): boolean => progress[stepId]?.status === "completed",
    [progress]
  );

  return { progress, loading, saveProgress, getStep, isCompleted, fetchProgress };
}
