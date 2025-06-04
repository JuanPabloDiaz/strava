// Test suite for formatUtils.ts
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  formatRelativeTime,
  formatDuration,
  formatDistance,
  formatPace,
  formatWorkoutDateTime, // Added this import
} from "./formatUtils"; // Assuming formatUtils.ts is in the same directory for now

// Mocking Date for formatRelativeTime tests
// const T_NOW = new Date("2024-07-15T12:00:00.000Z"); // A fixed point in time

// beforeEach(() => {
//   vi.useFakeTimers();
//   vi.setSystemTime(T_NOW);
// });

// afterEach(() => {
//   vi.useRealTimers();
// });

// describe("formatRelativeTime", () => {
//   it('should return "just now" for times less than a minute ago', () => {
//     const date = new Date(T_NOW.getTime() - 30 * 1000); // 30 seconds ago
//     expect(formatRelativeTime(date)).toBe("just now");
//   });

//   it("should return minutes for times less than an hour ago", () => {
//     const date = new Date(T_NOW.getTime() - 5 * 60 * 1000); // 5 minutes ago
//     expect(formatRelativeTime(date)).toBe("5min ago");
//   });

//   it("should return only minutes if time is exactly X minutes ago", () => {
//     const date = new Date(T_NOW.getTime() - 15 * 60 * 1000); // 15 minutes ago
//     expect(formatRelativeTime(date)).toBe("15min ago");
//   });

//   it("should return hours and minutes for times less than a day ago", () => {
//     const date = new Date(
//       T_NOW.getTime() - (2 * 60 * 60 * 1000 + 30 * 60 * 1000),
//     ); // 2 hours 30 minutes ago
//     expect(formatRelativeTime(date)).toBe("2hr 30min ago");
//   });

//   it("should return only hours if time is exactly X hours ago", () => {
//     const date = new Date(T_NOW.getTime() - 3 * 60 * 60 * 1000); // 3 hours ago
//     expect(formatRelativeTime(date)).toBe("3hr 0min ago"); // Current function returns 3hr 0min ago
//   });

//   it("should return days and hours for times more than a day ago", () => {
//     const date = new Date(
//       T_NOW.getTime() - (3 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000),
//     ); // 3 days 5 hours ago
//     expect(formatRelativeTime(date)).toBe("3 days 5hr ago");
//   });

//   it('should return singular "day" for 1 day ago', () => {
//     const date = new Date(
//       T_NOW.getTime() - (1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
//     ); // 1 day 2 hours ago
//     expect(formatRelativeTime(date)).toBe("1 day 2hr ago");
//   });

//   it('should return "just now" for current time or future time (or very small difference)', () => {
//     expect(formatRelativeTime(T_NOW)).toBe("just now");
//     const futureDate = new Date(T_NOW.getTime() + 5 * 1000); // 5 seconds in future
//     expect(formatRelativeTime(futureDate)).toBe("just now");
//   });
// });

describe("formatWorkoutDateTime", () => {
  // Note: These tests might be sensitive to the locale of the environment they run in,
  // as formatWorkoutDateTime uses `undefined` for locale in toLocaleDateString/toLocaleTimeString.
  // For consistency, 'en-US' is assumed for defining expected values.

  it("should format a date in AM correctly", () => {
    const date = new Date("2024-07-15T09:32:00.000Z"); // Monday, 9:32 AM UTC
    // Assuming a locale that outputs 'Monday' and '9:32 AM'
    // To make it more robust, we should ideally pass a locale to the main function
    // or make the test itself locale-aware if possible.
    // For now, we test against a common 'en-US' like output.
    // Example: In en-US on a system set to UTC, this might be "Monday at 9:32 AM"
    // If system is EST (UTC-5), 9:32 AM UTC is 5:32 AM EST.
    // The key is that `toLocaleDateString` and `toLocaleTimeString` use the system's local timezone.
    // Let's construct a date that is Monday 9:32 AM *local system time* for the test.
    const localDate = new Date(2024, 6, 15, 9, 32, 0); // July 15, 2024, 9:32:00 AM (local)
    // Day of week depends on this date in the local system.
    // If July 15, 2024 is a Monday in the system's locale:
    const expectedWeekday = localDate.toLocaleDateString("en-US", {
      weekday: "long",
    }); // Force en-US for test string
    const expectedTime = localDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    expect(formatWorkoutDateTime(localDate)).toBe(
      `${expectedWeekday} at ${expectedTime}`,
    );
    // Example: If system is US-based, this might be "Monday at 9:32 AM"
  });

  it("should format a date in PM correctly", () => {
    const localDate = new Date(2024, 6, 15, 18, 55, 0); // July 15, 2024, 6:55:00 PM (local)
    const expectedWeekday = localDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const expectedTime = localDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    expect(formatWorkoutDateTime(localDate)).toBe(
      `${expectedWeekday} at ${expectedTime}`,
    );
    // Example: If system is US-based, this might be "Monday at 6:55 PM"
  });

  it("should format noon correctly", () => {
    const localDate = new Date(2024, 6, 15, 12, 0, 0); // July 15, 2024, 12:00:00 PM (local)
    const expectedWeekday = localDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const expectedTime = localDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    expect(formatWorkoutDateTime(localDate)).toBe(
      `${expectedWeekday} at ${expectedTime}`,
    );
    // Example: "Monday at 12:00 PM"
  });

  it("should format midnight correctly", () => {
    const localDate = new Date(2024, 6, 15, 0, 0, 0); // July 15, 2024, 12:00:00 AM (local)
    const expectedWeekday = localDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const expectedTime = localDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    expect(formatWorkoutDateTime(localDate)).toBe(
      `${expectedWeekday} at ${expectedTime}`,
    );
    // Example: "Monday at 12:00 AM"
  });

  it("should handle single digit minutes correctly (e.g., 4:05 PM)", () => {
    const localDate = new Date(2024, 6, 15, 16, 5, 0); // July 15, 2024, 4:05:00 PM (local)
    const expectedWeekday = localDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const expectedTime = localDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }); // Should be "4:05 PM"
    expect(formatWorkoutDateTime(localDate)).toBe(
      `${expectedWeekday} at ${expectedTime}`,
    );
    // Example: "Monday at 4:05 PM"
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
