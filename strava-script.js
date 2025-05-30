const strava = require("strava-v3");
const jsonfile = require("jsonfile");
const outputFilename = "website/public/last-activities.json";
const targetActivityTypes = ["Run", "Ride", "Swim"];

require("dotenv").config({ path: __dirname + "/.env" });

if (!process.env.STRAVA_CLIENT_ID) {
  console.error("no strava env");
  return;
}

strava.config({
  access_token: "blank",
  client_id: process.env.STRAVA_CLIENT_ID,
  client_secret: process.env.STRAVA_CLIENT_SECRET,
  redirect_uri: "http://localhost",
});

const refreshToken = process.env.STRAVA_REFRESH_TOKEN;

const fetchActivities = async () => {
  console.log("Fetching activities from Strava...");
  try {
    const newToken = await strava.oauth.refreshToken(refreshToken);
    console.log("Successfully refreshed token.");
    const activities = await strava.athlete.listActivities({
      access_token: newToken.access_token,
      per_page: 50, // Fetch latest 50 activities
      page: 1,
    });
    console.log(`Fetched ${activities.length} activities.`);
    return activities;
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return []; // Return empty array on error
  }
};

(async function () {
  const rawActivities = await fetchActivities();

  if (!rawActivities || rawActivities.length === 0) {
    console.warn("No activities returned from Strava. Exiting.");
    return;
  }

  // Filter for public activities and select relevant fields
  const publicActivities = rawActivities
    .filter((act) => act.visibility === "everyone")
    .map(
      ({
        id,
        type,
        name,
        start_date,
        start_date_local,
        distance,
        moving_time,
        elapsed_time,
        total_elevation_gain,
        sport_type,
        kudos_count,
        average_speed,
        max_speed,
        map,
      }) => ({
        id,
        type,
        name,
        start_date,
        start_date_local,
        distance,
        moving_time,
        elapsed_time,
        total_elevation_gain,
        sport_type,
        kudos_count,
        average_speed,
        max_speed,
        map: { summary_polyline: map.summary_polyline },
      })
    );

  if (publicActivities.length === 0) {
    console.warn("No public activities found. Exiting.");
    return;
  }

  console.log(`Found ${publicActivities.length} public activities.`);

  const latestByType = {};
  for (const type of targetActivityTypes) {
    // Find the first activity of the specified type (already sorted by date by Strava)
    const latest = publicActivities.find(
      (act) => act.type === type || act.sport_type === type
    );
    if (latest) {
      latestByType[type] = latest;
      console.log(`Latest ${type}: ${latest.id} - ${latest.name}`);
    } else {
      console.log(
        `No public ${type} activity found in the last 50 activities.`
      );
    }
  }

  const recentActivities = publicActivities.slice(0, 30);
  console.log(
    `Selected ${recentActivities.length} recent activities for the list.`
  );

  const newData = {
    latest_by_type: latestByType,
    recent_activities: recentActivities,
  };

  let existingData = {};
  try {
    existingData = await jsonfile.readFile(outputFilename);
    console.log("Successfully read existing data file.");
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("No existing data file found. A new one will be created.");
    } else {
      console.error("Error reading existing data file:", error);
      // Decide if we should proceed or exit. For now, let's proceed to write a new file.
    }
  }

  // Basic comparison: check if stringified versions are different.
  // For more robust comparison, a deep-equal check would be better,
  // but this is often sufficient for activity data.
  if (JSON.stringify(existingData) === JSON.stringify(newData)) {
    console.log("No changes in activity data. File will not be updated.");
    return;
  }

  console.log("Activity data has changed. Writing updates to JSON...");
  try {
    await jsonfile.writeFile(outputFilename, newData, { spaces: 2 });
    console.log(`Successfully wrote updated data to ${outputFilename}`);
  } catch (error) {
    console.error(`Error writing data to ${outputFilename}:`, error);
  }
})();
