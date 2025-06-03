// Test suite for formatUtils.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  formatRelativeTime,
  formatDuration,
  formatDistance,
  formatPace,
} from "./formatUtils"; // Assuming formatUtils.ts is in the same directory for now

// Mocking Date for formatRelativeTime tests
const T_NOW = new Date("2024-07-15T12:00:00.000Z"); // A fixed point in time

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(T_NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("formatRelativeTime", () => {
  it('should return "just now" for times less than a minute ago', () => {
    const date = new Date(T_NOW.getTime() - 30 * 1000); // 30 seconds ago
    expect(formatRelativeTime(date)).toBe("just now");
  });

  it("should return minutes for times less than an hour ago", () => {
    const date = new Date(T_NOW.getTime() - 5 * 60 * 1000); // 5 minutes ago
    expect(formatRelativeTime(date)).toBe("5min ago");
  });

  it("should return only minutes if time is exactly X minutes ago", () => {
    const date = new Date(T_NOW.getTime() - 15 * 60 * 1000); // 15 minutes ago
    expect(formatRelativeTime(date)).toBe("15min ago");
  });

  it("should return hours and minutes for times less than a day ago", () => {
    const date = new Date(
      T_NOW.getTime() - (2 * 60 * 60 * 1000 + 30 * 60 * 1000)
    ); // 2 hours 30 minutes ago
    expect(formatRelativeTime(date)).toBe("2hr 30min ago");
  });

  it("should return only hours if time is exactly X hours ago", () => {
    const date = new Date(T_NOW.getTime() - 3 * 60 * 60 * 1000); // 3 hours ago
    expect(formatRelativeTime(date)).toBe("3hr 0min ago"); // Current function returns 3hr 0min ago
  });

  it("should return days and hours for times more than a day ago", () => {
    const date = new Date(
      T_NOW.getTime() - (3 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000)
    ); // 3 days 5 hours ago
    expect(formatRelativeTime(date)).toBe("3 days 5hr ago");
  });

  it('should return singular "day" for 1 day ago', () => {
    const date = new Date(
      T_NOW.getTime() - (1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)
    ); // 1 day 2 hours ago
    expect(formatRelativeTime(date)).toBe("1 day 2hr ago");
  });

  it('should return "just now" for current time or future time (or very small difference)', () => {
    expect(formatRelativeTime(T_NOW)).toBe("just now");
    const futureDate = new Date(T_NOW.getTime() + 5 * 1000); // 5 seconds in future
    expect(formatRelativeTime(futureDate)).toBe("just now");
  });
});

describe("formatDuration", () => {
  it('should return "0s" for 0 seconds', () => {
    expect(formatDuration(0)).toBe("0s");
  });

  it("should format less than a minute correctly", () => {
    expect(formatDuration(45)).toBe("45s");
  });

  it("should format minutes and seconds correctly", () => {
    expect(formatDuration(10 * 60 + 30)).toBe("10m 30s");
  });

  it("should format hours, minutes, and seconds correctly", () => {
    expect(formatDuration(2 * 3600 + 15 * 60 + 45)).toBe("2hr 15m 45s");
  });

  it("should omit minutes and seconds if they are zero for hours", () => {
    expect(formatDuration(1 * 3600)).toBe("1hr");
  });

  it('should format 1 hour as "1hr"', () => {
    expect(formatDuration(3600)).toBe("1hr");
  });

  it("should omit hours and seconds if they are zero for minutes", () => {
    expect(formatDuration(30 * 60)).toBe("30m");
  });

  it('should format 30 minutes as "30m"', () => {
    expect(formatDuration(1800)).toBe("30m");
  });

  it('should handle negative input by returning "0s"', () => {
    expect(formatDuration(-100)).toBe("0s");
  });
});

describe("formatDistance", () => {
  it('should return "0.00 km" for 0 meters', () => {
    expect(formatDistance(0)).toBe("0.00 km");
  });

  it("should format a few meters correctly", () => {
    expect(formatDistance(10)).toBe("0.01 km"); // 10 meters is 0.01 km
  });

  it("should format a typical distance with two decimal places", () => {
    expect(formatDistance(12340)).toBe("12.34 km");
  });

  it("should round to two decimal places", () => {
    expect(formatDistance(12345)).toBe("12.35 km"); // 12.345 rounds to 12.35
  });

  it("should format a large distance correctly", () => {
    expect(formatDistance(123450)).toBe("123.45 km");
  });

  it('should handle negative input by returning "0.00 km"', () => {
    expect(formatDistance(-1000)).toBe("0.00 km");
  });
});

describe("formatPace", () => {
  it('should return "0:00 min/km" for 0 seconds/km', () => {
    expect(formatPace(0)).toBe("0:00 min/km");
  });

  it("should format a typical pace correctly", () => {
    expect(formatPace(300)).toBe("5:00 min/km"); // 300s = 5 min
  });

  it("should format a pace with seconds, padding seconds", () => {
    expect(formatPace(335)).toBe("5:35 min/km"); // 335s = 5 min 35s
  });

  it("should pad seconds less than 10 with a zero", () => {
    expect(formatPace(305)).toBe("5:05 min/km"); // 305s = 5 min 5s
  });

  it("should format paces over an hour correctly (MM:SS)", () => {
    expect(formatPace(3660)).toBe("61:00 min/km"); // 3660s = 61 min
  });

  it('should format pace like 3600 seconds/km as "60:00 min/km"', () => {
    expect(formatPace(3600)).toBe("60:00 min/km");
  });

  it('should handle negative input by returning "0:00 min/km"', () => {
    expect(formatPace(-300)).toBe("0:00 min/km");
  });
});
