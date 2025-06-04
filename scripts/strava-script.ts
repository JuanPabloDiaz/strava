import { writeFile } from "fs/promises";

// Define interfaces for Strava API responses
interface StravaTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  token_type: string;
  // Add other properties if available and needed
}

interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  start_date: string; // ISO 8601 date string
  type: string;
  // Add other relevant activity properties
  // e.g., moving_time, elapsed_time, total_elevation_gain, etc.
}

const STRAVA_CLIENT_ID: string = process.env.STRAVA_CLIENT_ID!;
const STRAVA_CLIENT_SECRET: string = process.env.STRAVA_CLIENT_SECRET!;
const STRAVA_REFRESH_TOKEN: string = process.env.STRAVA_REFRESH_TOKEN!;

if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET || !STRAVA_REFRESH_TOKEN) {
  console.error("❌ Missing STRAVA credentials in environment variables");
  process.exit(1);
}

const getBearerToken = async (): Promise<string> => {
  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      refresh_token: STRAVA_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });

  const data: StravaTokenResponse = await response.json();
  if (!data.access_token) {
    throw new Error(`Strava auth failed: ${JSON.stringify(data)}`);
  }

  return `Bearer ${data.access_token}`;
};

const getAllActivities = async (bearer: string): Promise<StravaActivity[]> => {
  const oneYearAgo = Math.floor(Date.now() / 1000) - 365 * 24 * 60 * 60;
  let page = 1;
  let all: StravaActivity[] = [];

  while (true) {
    const url = `https://www.strava.com/api/v3/athlete/activities?after=${oneYearAgo}&per_page=200&page=${page}`;
    const res = await fetch(url, {
      headers: { Authorization: bearer },
    });

    const data: StravaActivity[] | { message?: string; errors?: any[] } =
      await res.json();

    // Check for Strava API error response
    if (!Array.isArray(data)) {
      if ("message" in data && data.message === "Rate Limit Exceeded") {
        console.warn("Strava API rate limit exceeded. Please try again later.");
      } else {
        console.error("Failed to fetch activities:", data);
      }
      break;
    }

    if (data.length === 0) break;

    all = all.concat(data);
    page++;
  }

  return all;
};

interface DistanceMap {
  [key: string]: number;
}

const summarizeDistance = (activities: StravaActivity[]): DistanceMap => {
  const distance: DistanceMap = {};

  for (const activity of activities) {
    const date = new Date(activity.start_date);
    const estDate = new Date(date.getTime() - 5 * 60 * 60 * 1000); // UTC-5
    const key = `${estDate.getFullYear()}-${
      estDate.getMonth() + 1
    }-${estDate.getDate()}`;

    distance[key] = (distance[key] || 0) + activity.distance;
  }

  return distance;
};

const main = async (): Promise<void> => {
  try {
    const bearer = await getBearerToken();
    const activities = await getAllActivities(bearer);
    const distanceMap = summarizeDistance(activities);

    await writeFile(
      "public/last-activities.json",
      JSON.stringify(distanceMap, null, 2)
    );
    console.log("✅ Distance data saved to public/last-activities.json");
  } catch (err: any) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

main();
