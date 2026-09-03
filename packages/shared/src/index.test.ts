import { describe, it, expect } from "vitest";
import { calculateCodingDuration, groupHeartbeatsIntoSessions } from "./index";

describe("Duration calculation", () => {
  it("Case 1: normal interval", () => {
    // 10:00, 10:02, 10:04
    const heartbeats = [
      { timestamp: 1000 },
      { timestamp: 1120 },
      { timestamp: 1240 },
    ];
    // diffs: 120, 120 => 240 seconds (4 minutes)
    expect(calculateCodingDuration(heartbeats, 5)).toBe(240);
  });

  it("Case 2: timeout gap", () => {
    // 10:00, 10:02, 10:20
    const heartbeats = [
      { timestamp: 1000 },
      { timestamp: 1120 },
      { timestamp: 2200 },
    ];
    // diffs: 120, 1080 (ignored > 5m) => 120 seconds (2 minutes)
    expect(calculateCodingDuration(heartbeats, 5)).toBe(120);
  });

  it("Case 3: multiple sessions", () => {
    // 10:00, 10:02, 10:20, 10:22
    const heartbeats = [
      { timestamp: 1000 },
      { timestamp: 1120 }, // +120
      { timestamp: 2200 }, // ignored
      { timestamp: 2320 }, // +120
    ];
    // total: 240
    expect(calculateCodingDuration(heartbeats, 5)).toBe(240);
  });
});
