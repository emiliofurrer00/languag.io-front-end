export const AI_GENERATION_DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'] as const;

export type AiGenerationDifficulty = (typeof AI_GENERATION_DIFFICULTIES)[number];
export type AiGenerationPhase = 'idle' | 'pending' | 'completed' | 'failed';

export function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
}
