export function getColor(n: number, min: number, max: number): string {
  if (n === -1) return "transparent";
  if (n === 0) return "rgba(0, 0, 0, 0.8)"; // Dark matrix background

  // Matrix-style green gradient from dark to bright neon
  const colors = [
    [0, 20, 0], // Very dark green
    [0, 40, 0], // Dark green
    [0, 80, 0], // Medium green
    [0, 255, 0], // Bright matrix green
    [50, 255, 50], // Neon green
  ];

  const weightFactor = 1.2;
  const ratio = Math.pow((n - min) / (max - min), weightFactor);

  // Map ratio to color segments
  const segmentSize = 1 / (colors.length - 1);
  const segmentIndex = Math.min(
    Math.floor(ratio / segmentSize),
    colors.length - 2,
  );
  const localRatio = (ratio - segmentIndex * segmentSize) / segmentSize;

  const startColor = colors[segmentIndex];
  const endColor = colors[segmentIndex + 1];

  const r = Math.round(
    startColor[0] + localRatio * (endColor[0] - startColor[0]),
  );
  const g = Math.round(
    startColor[1] + localRatio * (endColor[1] - startColor[1]),
  );
  const b = Math.round(
    startColor[2] + localRatio * (endColor[2] - startColor[2]),
  );

  return `rgb(${r}, ${g}, ${b})`;
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getTooltipContent(
  data: [number, number],
  formatActivityValueFn: (meters: number) => number,
): string {
  return data[1] === -1
    ? ""
    : `${formatActivityValueFn(data[1])} KM_EXECUTED >> ${formatTimestamp(
        data[0],
      )}`;
}

export interface AnimationStyle {
  animation: string;
  animationDelay: string;
}

export function getAnimationStyle(index: number): AnimationStyle {
  const animationStyles = [
    (index: number) => ({
      animation:
        "matrixFade 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
      animationDelay: `${(index % 31) * 0.02}s`,
    }),
    (index: number) => ({
      animation:
        "digitalGlitch 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
      animationDelay: `${(index % 7) * 0.03}s`,
    }),
    (index: number) => ({
      animation: "matrixRain 1.2s ease-out forwards",
      animationDelay: `${(index % 53) * 0.015}s`,
    }),
  ];

  const styleIndex = Math.floor(Math.random() * animationStyles.length);
  const animationStyle = animationStyles[styleIndex];
  return animationStyle(index);
}
