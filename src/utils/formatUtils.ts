// Formatting data.

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();

  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    const remainingHours = diffInHours % 24;
    return `${diffInDays} day${
      diffInDays > 1 ? "s" : ""
    } ${remainingHours}hr ago`;
  } else if (diffInHours > 0) {
    const remainingMinutes = diffInMinutes % 60;
    return `${diffInHours}hr ${remainingMinutes}min ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes}min ago`;
  } else {
    return "just now";
  }
}

export function formatDuration(seconds: number): string {
  if (seconds < 0) {
    return "0s"; // Or handle negative duration as an error
  }

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  let result = "";

  if (h > 0) {
    result += `${h}hr `;
  }
  if (m > 0) {
    result += `${m}m `;
  }
  if (s > 0 || result === "") {
    // Always show seconds if hours and minutes are zero, or if it's the only unit
    result += `${s}s`;
  }

  return result.trim(); // Trim potential trailing space if only hours or minutes are present
}

export function formatDistance(meters: number): string {
  if (meters < 0) {
    return "0.00 km"; // Or handle negative distance as an error
  }
  const kilometers = meters / 1000;
  return `${kilometers.toFixed(2)} km`;
}

export function formatPace(secondsPerKilometer: number): string {
  if (secondsPerKilometer < 0) {
    return "0:00 min/km"; // Or handle negative pace as an error
  }
  const minutes = Math.floor(secondsPerKilometer / 60);
  const seconds = Math.floor(secondsPerKilometer % 60);
  const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${paddedSeconds} min/km`;
}

export function formatWorkoutDateTime(date: Date): string {
  const weekday = date.toLocaleDateString(undefined, { weekday: 'long' });
  const time = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${weekday} at ${time}`;
}
