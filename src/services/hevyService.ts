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
  exercise_type_id: string; // Assuming there's a separate type for exercise types
  notes: string | null;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  sets: Set[];
}

interface Workout {
  workout_id: string;
  user_id: string;
  workout_template_id: string | null;
  name: string;
  notes: string | null;
  started_at: string; // ISO 8601 date string
  ended_at: string; // ISO 8601 date string
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  exercises: Exercise[];
}

// Function to fetch data from the Hevy API
// Note: HEVY_API_KEY should be sourced from import.meta.env.HEVY_API_KEY in a Vite/SvelteKit environment
const fetchHevyData = async (apiKey?: string): Promise<any> => {
  // Use a plausible endpoint, this is a guess and might need adjustment.
  const apiUrl = "https://api.hevyapp.com/v1/workouts/latest";
  // const apiUrl = "https://api.hevyapp.com/v1/user/workouts?limit=1"; // Alternative guess

  if (!apiKey) {
    console.error("API key is required to fetch Hevy data.");
    throw new Error("Hevy API key not provided.");
  }

  console.log(`Fetching data from ${apiUrl} using provided API key.`);

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Hevy might use Bearer token or a custom header like X-Api-Key
        Authorization: `Bearer ${apiKey}`,
        // "X-Api-Key": apiKey, // Alternative header
      },
    });

    if (!response.ok) {
      // Log more details for debugging
      const errorBody = await response.text();
      console.error(
        `API request failed with status ${response.status}: ${response.statusText}`,
      );
      console.error("Error body:", errorBody);
      throw new Error(
        `Failed to fetch workout data from Hevy API. Status: ${response.status}, Body: ${errorBody}`,
      );
    }

    const data = await response.json();
    console.log(
      "Successfully fetched Hevy data (raw):",
      JSON.stringify(data, null, 2),
    );
    return data; // Return raw data for now
  } catch (error) {
    console.error("Error during fetchHevyData execution:", error);
    // Re-throw the error so it can be caught by the caller
    throw error;
  }
};

// Example usage (optional, for testing purposes)
const main = async () => {
  // In a browser/Vite environment, you'd use import.meta.env.HEVY_API_KEY
  // For Node.js testing (as implied by require.main), process.env is used.
  // This service is likely intended for a frontend, so import.meta.env is preferred there.
  const apiKey =
    process.env.HEVY_API_KEY ||
    (typeof import.meta !== "undefined" && import.meta.env
      ? (import.meta.env as any).HEVY_API_KEY
      : undefined);

  if (!apiKey) {
    console.error("HEVY_API_KEY environment variable not set.");
    console.log("Please set HEVY_API_KEY in your environment or .env file.");
    console.log("For example: HEVY_API_KEY='your_actual_api_key_here'");
    return; // Exit if no API key
  }

  console.log("Attempting to fetch Hevy data with the provided API key...");
  try {
    const workoutsData = await fetchHevyData(apiKey);
    // The actual structure of workoutsData is unknown, logging as is.
    console.log(
      "Fetched Hevy data (main function):",
      JSON.stringify(workoutsData, null, 2),
    );
  } catch (error) {
    // Error logging is handled in fetchHevyData, but we can add more context here
    console.error(
      "Failed to run Hevy service example in main:",
      (error as Error).message,
    );
  }
};

// Check if running in Node.js for direct execution (testing)
// In a SvelteKit app, this service module would be imported, not run directly.
if (
  typeof process !== "undefined" &&
  typeof require !== "undefined" &&
  require.main === module
) {
  console.log(
    "Running hevyService.ts directly for testing (Node.js environment).",
  );
  // Simulating import.meta.env for Node.js testing if it's not already polyfilled
  if (typeof import.meta === "undefined") {
    (globalThis as any).import = {
      meta: { env: { HEVY_API_KEY: process.env.HEVY_API_KEY } },
    };
  }
  main();
}

export { fetchHevyData };
export type { Workout, Exercise, Set }; // Export types for use in other parts of the application
