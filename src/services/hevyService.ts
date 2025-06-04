// TypeScript interfaces for Hevy workout data
interface Set {
  set_id: string;
  exercise_id: string;
  workout_id: string;
  set_order: number;
  weight_kg: number;
  reps: number;
  distance_km: number | null;
  duration_seconds: number | null;
  rpe: number | null;
  notes: string | null;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
}

interface Exercise {
  exercise_id: string;
  workout_id: string;
  exercise_order: number;
  title: string;
  exercise_type_id: string;
  notes: string | null;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  sets: Set[];
}

interface Workout {
  id: string;
  user_id?: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
  exercises: Exercise[];
}

// Function to get API key from environment
const getApiKey = (): string | undefined => {
  // For SvelteKit/Vite environment
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env.HEVY_API_KEY;
  }

  // For Node.js environment
  if (typeof process !== "undefined" && process.env) {
    return process.env.HEVY_API_KEY;
  }

  return undefined;
};

// Function to fetch data from the Hevy API
const fetchHevyData = async (apiKey?: string): Promise<Workout[]> => {
  // Get API key from parameter or environment
  const key = apiKey || getApiKey();

  if (!key) {
    console.error("API key is required to fetch Hevy data.");
    console.error(
      "Make sure HEVY_API_KEY or VITE_HEVY_API_KEY is set in your .env file",
    );
    throw new Error("Hevy API key not provided.");
  }

  // Verificar que la API key tenga el formato correcto (opcional)
  if (!key.startsWith("hvy_")) {
    console.warn(
      "Warning: Hevy API keys usually start with 'hvy_'. Please verify your API key.",
    );
  }

  const apiUrl = "https://api.hevyapp.com/v1/workouts";

  console.log(`Fetching data from ${apiUrl}`);
  console.log(
    `Using API key: ${key.substring(0, 8)}...${key.substring(key.length - 4)}`,
  ); // Solo mostrar parte de la key por seguridad

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "api-key": key,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `API request failed with status ${response.status}: ${response.statusText}`,
      );
      console.error("Error body:", errorBody);

      if (response.status === 401) {
        throw new Error(
          `Authentication failed. Please verify your Hevy API key is correct and active. Status: ${response.status}`,
        );
      }

      throw new Error(
        `Failed to fetch workout data from Hevy API. Status: ${response.status}, Body: ${errorBody}`,
      );
    }

    const data = await response.json();
    if (!data || !Array.isArray(data.workouts)) {
      // Check if data.workouts is an array
      throw new Error(
        "Unexpected data structure from Hevy API: No workouts found or data.workouts is not an array.",
      );
    }
    // Sort workouts by start_time in descending order (newest first)
    const sortedWorkouts: Workout[] = data.workouts.sort(
      (a: Workout, b: Workout) => {
        return (
          new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
        );
      },
    );
    return sortedWorkouts;
  } catch (error) {
    console.error("Error during fetchHevyData execution:", error);
    throw error;
  }
};

// Alternative function with different endpoint (in case the main one doesn't work)
const fetchHevyWorkouts = async (
  apiKey?: string,
  limit: number = 1,
): Promise<any> => {
  const key = apiKey || getApiKey();

  if (!key) {
    throw new Error("Hevy API key not provided.");
  }

  const apiUrl = `https://api.hevyapp.com/v1/user/workouts?limit=${limit}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "api-key": key,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Failed to fetch workouts. Status: ${response.status}, Body: ${errorBody}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching workouts:", error);
    throw error;
  }
};

// Function to fetch the total number of workouts
const fetchWorkoutCount = async (apiKey?: string): Promise<number> => {
  const key = apiKey || getApiKey();

  if (!key) {
    throw new Error("Hevy API key not provided.");
  }

  const apiUrl = "https://api.hevyapp.com/v1/workouts/count";

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "api-key": key,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Failed to fetch workout count. Status: ${response.status}, Body: ${errorBody}`,
      );
    }

    const data = await response.json();
    console.log("Workout count API response:", data);

    // Handle different possible response structures
    if (typeof data === "number") {
      return data;
    } else if (data && typeof data.workout_count === "number") {
      // Fixed: Added support for workout_count key
      return data.workout_count;
    } else if (data && typeof data.count === "number") {
      return data.count;
    } else if (data && typeof data.total === "number") {
      return data.total;
    } else {
      console.warn("Unexpected response structure for workout count:", data);
      return 0;
    }
  } catch (error) {
    console.error("Error fetching workout count:", error);
    throw error;
  }
};

// Example usage and testing
const main = async () => {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.error("❌ HEVY_API_KEY environment variable not set.");
    console.log("📝 Please add your API key to your .env file:");
    console.log("   HEVY_API_KEY=hvy_your_actual_api_key_here");
    return;
  }

  console.log("✅ API key found, attempting to fetch Hevy data...");

  try {
    // Try the main endpoint first
    console.log("🔄 Trying main endpoint...");
    const workoutsData = await fetchHevyData();
    console.log("✅ Successfully fetched data from main endpoint!");
    console.log("Data:", JSON.stringify(workoutsData, null, 2));
  } catch (error) {
    console.log("❌ Main endpoint failed, trying alternative...");

    try {
      // Try alternative endpoint
      const alternativeData = await fetchHevyWorkouts();
      console.log("✅ Successfully fetched data from alternative endpoint!");
      console.log("Data:", JSON.stringify(alternativeData, null, 2));
    } catch (altError) {
      console.error("❌ Both endpoints failed:");
      console.error("Main error:", (error as Error).message);
      console.error("Alternative error:", (altError as Error).message);
    }
  }
};

// Check if running directly for testing
if (
  typeof process !== "undefined" &&
  typeof require !== "undefined" &&
  require.main === module
) {
  console.log("🧪 Running hevyService.ts directly for testing...");
  main();
}

// Export all functions and types - SINGLE EXPORT STATEMENT
export { fetchHevyData, fetchHevyWorkouts, getApiKey, fetchWorkoutCount };
export type { Workout, Exercise, Set };
