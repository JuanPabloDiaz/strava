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
export async function getRecentActivities(
  perPage: number = 10
): Promise<StravaActivity[]> {
  try {
    const bearer = await getBearerToken();
    const url = `https://www.strava.com/api/v3/athlete/activities?per_page=${perPage}&page=1`;
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

    const activities = await getRecentActivities(20); // Obtener más actividades para encontrar el tipo específico

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

    // Convertir a EST como en tu código existente
    const utcDate = new Date(Date.parse(targetActivity.start_date));
    const estDate = new Date(utcDate.getTime() - 5 * 60 * 60 * 1000);

    console.log(`Last ${activityType || "activity"} date:`, estDate);
    return estDate;
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

    const activities = await getRecentActivities(20);

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

    const utcDate = new Date(Date.parse(targetActivity.start_date));
    const estDate = new Date(utcDate.getTime() - 5 * 60 * 60 * 1000);

    return {
      date: estDate,
      activity: targetActivity,
    };
  } catch (error) {
    console.error("Error getting last activity info:", error);
    return null;
  }
}

export async function fetchMileage(): Promise<MileageData> {
  let mileage: MileageData = {};

  // Initialize all days in the last 365 days
  for (let i = 0; i < 365; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
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
        const utcDate = new Date(Date.parse(data.start_date));
        const estDate = new Date(utcDate.getTime() - 5 * 60 * 60 * 1000); // EST (UTC - 5 hours)
        const key = `${estDate.getFullYear()}-${
          estDate.getMonth() + 1
        }-${estDate.getDate()}`;

        if (key in mileage) {
          mileage[key] += data.distance;
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
  console.log(
    "Mileage map keys with nonzero values:",
    Object.entries(mileageMap).filter(([_, v]) => v > 0)
  );

  let mileage: [number, number][] = Object.entries(mileageMap).map(
    ([key, value]) => [new Date(key).getTime(), value]
  );

  mileage.sort((a, b) => a[0] - b[0]); // sort mileage by date

  // prepend days to mileage until first day is Sunday
  while (new Date(mileage[0][0]).getDay() !== 0) {
    const previousDate: Date = new Date(mileage[0][0]);
    previousDate.setDate(previousDate.getDate() - 1);
    mileage.unshift([previousDate.getTime(), -1]);
  }

  return mileage;
}
