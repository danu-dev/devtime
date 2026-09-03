import { z } from "zod";

export const heartbeatSchema = z.object({
  entity: z.string().min(1),
  project: z.string().optional(),
  language: z.string().optional(),
  framework: z.string().optional(),
  editor: z.string().optional(),
  branch: z.string().optional(),
  operatingSystem: z.string().optional(),
  machine: z.string().optional(),
  isWrite: z.boolean().default(false),
  timestamp: z.number().int().positive(),
});

export const heartbeatsPayloadSchema = z.object({
  heartbeats: z.array(heartbeatSchema).min(1).max(5000),
});

export type HeartbeatInput = z.infer<typeof heartbeatSchema>;
export type HeartbeatsPayload = z.infer<typeof heartbeatsPayloadSchema>;

/**
 * Calculates coding duration from a list of sorted heartbeats.
 * @param heartbeats List of heartbeat objects with timestamp (in seconds or ms, as long as it's consistent. Here we assume seconds).
 * @param timeoutMinutes Gap threshold to split sessions.
 */
export function calculateCodingDuration(
  heartbeats: { timestamp: number }[],
  timeoutMinutes: number = 5
): number {
  if (heartbeats.length === 0) return 0;
  if (heartbeats.length === 1) return 0; // MVP simplistic: single heartbeat = 0 duration if no other context. Or 2 min default? PRD says last - first with gaps. Let's return 0 for a single point to be safe.

  // Ensure sorted
  const sorted = [...heartbeats].sort((a, b) => a.timestamp - b.timestamp);
  
  let totalSeconds = 0;
  const timeoutSeconds = timeoutMinutes * 60;

  for (let i = 1; i < sorted.length; i++) {
    const diff = sorted[i].timestamp - sorted[i - 1].timestamp;
    if (diff > 0 && diff <= timeoutSeconds) {
      totalSeconds += diff;
    }
  }

  return totalSeconds;
}

export interface Session {
  start: number;
  end: number;
  duration: number;
}

export function groupHeartbeatsIntoSessions(
  heartbeats: { timestamp: number }[],
  timeoutMinutes: number = 5
): Session[] {
  if (heartbeats.length === 0) return [];
  
  const sorted = [...heartbeats].sort((a, b) => a.timestamp - b.timestamp);
  const timeoutSeconds = timeoutMinutes * 60;
  
  const sessions: Session[] = [];
  let currentSession: Session | null = null;

  for (const hb of sorted) {
    if (!currentSession) {
      currentSession = { start: hb.timestamp, end: hb.timestamp, duration: 0 };
    } else {
      const diff = hb.timestamp - currentSession.end;
      if (diff <= timeoutSeconds) {
        currentSession.end = hb.timestamp;
        currentSession.duration += diff;
      } else {
        sessions.push(currentSession);
        currentSession = { start: hb.timestamp, end: hb.timestamp, duration: 0 };
      }
    }
  }
  
  if (currentSession) {
    sessions.push(currentSession);
  }

  return sessions;
}
