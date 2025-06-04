import { writeFile } from "fs/promises";

const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN } =
  process.env;

if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET || !STRAVA_REFRESH_TOKEN) {
  console.error("❌ Missing STRAVA credentials in environment variables");
  process.exit(1);
}

const getBearerToken = async () => {
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

  const data = await response.json();
  if (!data.access_token) {
    throw new Error(`Strava auth failed: ${JSON.stringify(data)}`);
  }

  return `Bearer ${data.access_token}`;
};

const getAllActivities = async (bearer) => {
  const oneYearAgo = Math.floor(Date.now() / 1000) - 365 * 24 * 60 * 60;
  let page = 1;
  let all = [];

  while (true) {
    const url = `https://www.strava.com/api/v3/athlete/activities?after=${oneYearAgo}&per_page=200&page=${page}`;
    const res = await fetch(url, {
      headers: { Authorization: bearer },
    });

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;

    all = all.concat(data);
    page++;
  }

  return all;
};

const summarizeDistance = (activities) => {
  const distance = {};

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

const main = async () => {
  try {
    const bearer = await getBearerToken();
    const activities = await getAllActivities(bearer);
    const distanceMap = summarizeDistance(activities);

    await writeFile(
      "public/last-activities.json",
      JSON.stringify(distanceMap, null, 2)
    );
    console.log("✅ Distance data saved to public/last-activities.json");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

main();
