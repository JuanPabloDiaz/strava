export const SITE_TITLE = "Fit";
export const SITE_DESCRIPTION = "";
export const SITE_AUTHOR = "Juan Diaz";
export const SITE_URL = "https://fit.jpdiaz.dev";
export const SITE_PORTFOLIO = "https://jpdiaz.dev";
export const SITE_GITHUB = "https://github.com/juanpablodiaz";
export const SITE_LINKEDIN = "https://linkedin.com/in/1diazdev";

export interface PageMeta {
  title: string;
  description: string;
  keywords: string[];
}

export const PAGE_METADATA: Record<string, PageMeta> = {
  index: {
    title: `Fitness Matrix | ${SITE_AUTHOR}`,
    description:
      "Visualize and analyze your sports activities with the Strava Matrix Tracker by Juan Diaz.",
    keywords: ["strava", "matrix", "tracker", "fitness", "activity", "sports"],
  },
  about: {
    title: `About | ${SITE_AUTHOR}`,
    description:
      "Learn about Juan Pablo Diaz, creator of the Fitness Matrix and technology professional.",
    keywords: ["about", "fitness matrix", "bio", "technology", "health"],
  },
  hevy: {
    title: `Hevy Workout | ${SITE_AUTHOR}`,
    description: "View and track your Hevy workouts on Juan Diaz's platform.",
    keywords: ["hevy", "workout", "training", "fitness"],
  },
  last: {
    title: `Latest Activities | ${SITE_AUTHOR}`,
    description:
      "Check your latest sports activities and stats with the Matrix Tracker by Juan Diaz.",
    keywords: ["latest activities", "strava", "matrix", "stats"],
  },
  map: {
    title: `Activity Map | ${SITE_AUTHOR}`,
    description:
      "See the map of your sports activities with the Matrix interface by Juan Diaz.",
    keywords: ["map", "activity", "matrix", "strava", "gps"],
  },
};
