export interface MileageData {
  [key: string]: number;
}

export interface StravaActivity {
  id: number;
  name: string;
  type: string;
  start_date: string;
  distance: number;
  moving_time: number;
  sport_type: string;
  start_latlng?: [number, number];
  map_id?: string;
  summary_polyline?: string;
}

export function formatMileage(meters: number): number {
  return Math.round(((meters * 0.621371) / 1000) * 100) / 100;
}

export function getYearOldEpoch(): number {
  const now = new Date();
  const yearAgo = new Date(
    now.getFullYear() - 1,
    now.getMonth(),
    now.getDate()
  );
  return yearAgo.getTime() / 1000;
}

export async function getBearerToken(): Promise<string> {
  const clientID = import.meta.env.STRAVA_CLIENT_ID;
  const clientSecret = import.meta.env.STRAVA_CLIENT_SECRET;
  const refreshToken = import.meta.env.STRAVA_REFRESH_TOKEN;

  console.log("clientID:", clientID);
  console.log("clientSecret:", clientSecret ? "✓ present" : "✗ missing");
  console.log("refreshToken:", refreshToken ? "✓ present" : "✗ missing");

  const url = `https://www.strava.com/oauth/token?client_id=${clientID}&client_secret=${clientSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`;
  const response = await fetch(url, { method: "POST" });
  const data = await response.json();

  console.log("Strava token response:", data);
  return `Bearer ${data.access_token}`;
}

export async function getPage(page: number, bearer: string): Promise<any[]> {
  const epoch = getYearOldEpoch();
  const url = `https://www.strava.com/api/v3/athlete/activities?after=${epoch}&per_page=200&page=${page}`;
  const headers = { Authorization: bearer };
  const response = await fetch(url, { method: "GET", headers: headers });

  console.log("Strava URL:", url);
  const json = await response.json();
  console.log(`Fetched page ${page}:`, JSON.stringify(json, null, 2));

  return json;
}

// Nueva función para obtener actividades recientes (sin filtro de tiempo)
export async function fetchActivities(
  page: number = 1,
  perPage: number = 10
): Promise<StravaActivity[]> {
  try {
    const bearer = await getBearerToken();
    const url = `https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=${perPage}`;
    const headers = { Authorization: bearer };
    const response = await fetch(url, { method: "GET", headers: headers });

    if (!response.ok) {
      throw new Error(`Strava API error: ${response.status}`);
    }

    const activities: StravaActivity[] = await response.json();
    console.log("Recent activities fetched:", activities.length);
    return activities;
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return [];
  }
}

export interface ActivityTypeStats {
  count: number;
  distance: number;
  time: number;
  avgPace: number | null; // minutes per kilometer, or null if distance is 0
}

export interface ActivityStats {
  totalDistance: number;
  totalTime: number;
  byType: {
    [type: string]: ActivityTypeStats;
  };
}

export function getActivityStats(activities: StravaActivity[]): ActivityStats {
  const stats: ActivityStats = {
    totalDistance: 0,
    totalTime: 0,
    byType: {},
  };

  for (const activity of activities) {
    stats.totalDistance += activity.distance;
    stats.totalTime += activity.moving_time;

    const activityType = activity.type || activity.sport_type || "Unknown";

    if (!stats.byType[activityType]) {
      stats.byType[activityType] = {
        count: 0,
        distance: 0,
        time: 0,
        avgPace: null,
      };
    }

    stats.byType[activityType].count++;
    stats.byType[activityType].distance += activity.distance;
    stats.byType[activityType].time += activity.moving_time;
  }

  for (const type in stats.byType) {
    const typeStats = stats.byType[type];
    if (typeStats.distance > 0) {
      // Calculate pace as minutes per kilometer
      typeStats.avgPace = typeStats.time / 60 / (typeStats.distance / 1000);
    } else {
      typeStats.avgPace = null;
    }
  }

  return stats;
}

// Nueva función para obtener la última actividad de un tipo específico
export async function getLastActivityDate(
  activityType?: string
): Promise<Date | null> {
  try {
    // En modo desarrollo, retorna una fecha de ejemplo
    if (import.meta.env.MODE !== "production") {
      const daysAgo = Math.floor(Math.random() * 5); // 0-4 días atrás para testing
      const testDate = new Date();
      testDate.setDate(testDate.getDate() - daysAgo);
      return testDate;
    }

    const activities = await fetchActivities(1, 50); // Obtener más actividades para encontrar el tipo específico

    if (activities.length === 0) {
      return null;
    }

    let targetActivity: StravaActivity | undefined;

    if (activityType) {
      // Buscar la actividad más reciente del tipo especificado
      targetActivity = activities.find((activity) => {
        const type = activity.type || activity.sport_type || "";
        return (
          type.toLowerCase() === activityType.toLowerCase() ||
          activity.name.toLowerCase().includes(activityType.toLowerCase())
        );
      });
    } else {
      // Si no se especifica tipo, tomar la más reciente
      targetActivity = activities[0];
    }

    if (!targetActivity) {
      console.log(
        `No ${activityType || "activity"} found in recent activities`
      );
      return null;
    }

    // Convertir a EST/EDT (America/New_York)
    const activityDate = new Date(targetActivity.start_date);
    // Create a new Date object that represents the equivalent local time in New York
    const newYorkDate = new Date(
      activityDate.toLocaleString("en-US", { timeZone: "America/New_York" })
    );

    console.log(
      `Last ${activityType || "activity"} date (New York):`,
      newYorkDate
    );
    return newYorkDate;
  } catch (error) {
    console.error("Error getting last activity date:", error);
    return null;
  }
}

// Nueva función para obtener información detallada de la última actividad
export async function getLastActivityInfo(activityType?: string): Promise<{
  date: Date | null;
  activity: StravaActivity | null;
} | null> {
  try {
    // En modo desarrollo, retorna datos de ejemplo
    if (import.meta.env.MODE !== "production") {
      const daysAgo = Math.floor(Math.random() * 5);
      const testDate = new Date();
      testDate.setDate(testDate.getDate() - daysAgo);

      return {
        date: testDate,
        activity: {
          id: 12345,
          name: `Morning ${activityType || "Run"}`,
          type: activityType || "Run",
          start_date: testDate.toISOString(),
          distance: 5000,
          moving_time: 1800,
          sport_type: activityType || "Run",
        },
      };
    }

    const activities = await fetchActivities(1, 50);

    if (activities.length === 0) {
      return null;
    }

    let targetActivity: StravaActivity | undefined;

    if (activityType) {
      targetActivity = activities.find((activity) => {
        const type = activity.type || activity.sport_type || "";
        return (
          type.toLowerCase() === activityType.toLowerCase() ||
          activity.name.toLowerCase().includes(activityType.toLowerCase())
        );
      });
    } else {
      targetActivity = activities[0];
    }

    if (!targetActivity) {
      return null;
    }

    const activityDate = new Date(targetActivity.start_date);
    // Create a new Date object that represents the equivalent local time in New York
    const newYorkDate = new Date(
      activityDate.toLocaleString("en-US", { timeZone: "America/New_York" })
    );

    return {
      date: newYorkDate,
      activity: targetActivity,
    };
  } catch (error) {
    console.error("Error getting last activity info:", error);
    return null;
  }
}

export async function fetchMileage(): Promise<MileageData> {
  let mileage: MileageData = {};

  // Initialize all days in the last 365 days for 'America/New_York'
  const todayInNewYork = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  for (let i = 0; i < 365; i++) {
    const date = new Date(todayInNewYork);
    date.setDate(todayInNewYork.getDate() - i);
    // Use YYYY-MM-DD format for consistency and to avoid issues with single digit month/day
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
    mileage[key] = 0;
  }

  // Uncomment for development mode bypass
  // if (import.meta.env.MODE !== "production") return mileage;

  try {
    const bearer = await getBearerToken();
    let i = 1;
    let pagedMileage = await getPage(i, bearer);

    while (pagedMileage.length > 0) {
      for (let data of pagedMileage) {
        const activityDate = new Date(data.start_date);
        // Convert activity date to 'America/New_York' to get the correct day
        const newYorkActivityDateStr = activityDate.toLocaleString("en-US", {
          timeZone: "America/New_York",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        // newYorkActivityDateStr will be in "MM/DD/YYYY" format, need to reformat for key
        const parts = newYorkActivityDateStr.split("/"); // MM/DD/YYYY
        const key = `${parts[2]}-${parts[0]}-${parts[1]}`; // YYYY-MM-DD

        if (key in mileage) {
          mileage[key] += data.distance;
        } else {
          // This case might happen if an activity's date falls outside the initialized 365-day window
          // after timezone conversion. For simplicity, we can log it or initialize it.
          // console.warn(`Activity date ${key} not found in initialized mileage map. Activity time: ${data.start_date}`);
          mileage[key] = data.distance; // Initialize if not present
        }
      }
      pagedMileage = await getPage(++i, bearer);
    }
  } catch (error) {
    console.error("Error fetching Strava data:", error);
  }

  return mileage;
}

export function processMileageData(
  mileageMap: MileageData
): [number, number][] {
  // console.log(
  //   "Mileage map keys with nonzero values:",
  //   Object.entries(mileageMap).filter(([_, v]) => v > 0)
  // );

  // When converting to [timestamp, value] array, ensure the key is parsed correctly as a New York date
  // to get a timestamp that aligns with the intended day.
  let mileageArray: [number, number][] = Object.entries(mileageMap).map(
    ([key, value]) => {
      // Key is YYYY-MM-DD. Ensure it's treated as a local date in New York then get timestamp.
      // new Date("YYYY-MM-DD") will parse it as UTC.
      // new Date("YYYY/MM/DD") or "MM/DD/YYYY" is often parsed as local.
      // To be safe, construct from parts in a way that new Date() interprets as local to the system,
      // then we know the date parts are for New York.
      const [year, month, day] = key.split("-").map(Number);
      // The timestamp should represent the beginning of that day in New York.
      // However, the heatmap might expect UTC midnight timestamps if not handled carefully.
      // For now, let's assume the key "YYYY-MM-DD" is for a NY day, and we want its timestamp.
      // new Date(year, month -1, day) will create a date local to the system.
      // If the system is not NY, this is not quite right for "midnight in NY".
      // A robust way:
      const newYorkDateString = `${year}-${month
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")}T00:00:00`;
      // Create a date object that is definitely midnight in New York for that day.
      const dateInNewYork = new Date(
        new Date(newYorkDateString).toLocaleString("en-US", {
          timeZone: "America/New_York",
        })
      );
      return [dateInNewYork.getTime(), value];
    }
  );

  mileageArray.sort((a, b) => a[0] - b[0]); // sort mileage by date

  // prepend days to mileage until first day is Sunday (0 index for getDay()) in New York time
  if (mileageArray.length > 0) {
    let firstDate = new Date(mileageArray[0][0]);
    // Ensure we interpret this timestamp as a New York date to check its day of the week
    let firstDateInNewYork = new Date(
      firstDate.toLocaleString("en-US", { timeZone: "America/New_York" })
    );

    while (firstDateInNewYork.getDay() !== 0) {
      const previousDate = new Date(firstDateInNewYork);
      previousDate.setDate(previousDate.getDate() - 1);
      mileageArray.unshift([previousDate.getTime(), -1]); // Store timestamp as is
      firstDateInNewYork = new Date(
        previousDate.toLocaleString("en-US", { timeZone: "America/New_York" })
      );
    }
  }

  return mileageArray;
}
