import { useEffect, useState } from "preact/hooks";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import format from "date-fns/format";

const defaultActivityType = import.meta.env.VITE_DEFAULT_ACTIVITY ?? "Run";

export function App(props) {
  const [activityData, setActivityData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch from the new local file, which is structured differently
        const response = await fetch("/last-activities.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setActivityData(data);
      } catch (e) {
        console.error("Failed to fetch activity data:", e);
        setError(e.message);
      }
    };
    fetchData();
  }, []);

  // Adapt to the new data structure
  const lastDefaultActivity =
    activityData?.latest_by_type?.[defaultActivityType];

  const pad = (days) => {
    if (days === null || isNaN(days)) return "---";
    return days < 1000 ? days.toString().padStart(3, "0") : "Err";
  };

  const getDaysSince = (activity) => {
    if (!activity || !activity.start_date_local) return null;
    return differenceInCalendarDays(
      new Date(),
      new Date(activity.start_date_local)
    );
  };

  const daysDisplay = (activity) => pad(getDaysSince(activity));

  const color = (activity) => {
    const daysSince = getDaysSince(activity);
    if (daysSince === null) return "#ea1d0d"; // Default to red if no data
    return daysSince <= 1 ? "#03ba0c" : "#ea1d0d";
  };

  if (error) {
    return (
      <div class="text-center text-red-500">
        <p>Error loading activity data: {error}</p>
        <p>
          Please ensure `last-activities.json` is available in the public
          folder.
        </p>
      </div>
    );
  }

  if (!activityData) {
    return <div class="text-center">Loading activity data...</div>;
  }

  // Other activities to display (excluding the default one if present)
  // For now, let's list other types from latest_by_type
  const otherActivityTypes = Object.keys(
    activityData.latest_by_type || {}
  ).filter(
    (type) => type !== defaultActivityType && activityData.latest_by_type[type]
  );

  return (
    // Removed the outer <></> as Layout provides a root div
    // <main> is now provided by Layout.jsx, content directly here
    <>
      <h1 class="title">
        <span class="title1">
          {/* This was a static background number, can be kept or removed */}
          <span class="day-background">888</span>
        </span>
        <span class="title2">
          <span
            id="days"
            style={{ "--number-color": color(lastDefaultActivity) }}
          >
            {daysDisplay(lastDefaultActivity)}
          </span>
        </span>
        <span class="title3">DAYS</span>
        <span class="title4">
          SINCE LAST {defaultActivityType.toUpperCase()}
        </span>
      </h1>
      <p class="text-center my-4">
        Kinda like a “DAYS WITHOUT INCIDENT” sign — except it’s about your
        workouts, and fewer days is a good thing.
      </p>

      {lastDefaultActivity ? (
        <a
          id="strava-link"
          href={`https://www.strava.com/activities/${lastDefaultActivity.id}`}
          target="_blank"
          rel="noopener noreferrer"
          class="block text-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600"
        >
          Last {defaultActivityType} on{" "}
          {format(new Date(lastDefaultActivity.start_date_local), "PPPP")}
        </a>
      ) : (
        <p class="text-center text-gray-600 dark:text-gray-400">
          No {defaultActivityType} activity found recently.
        </p>
      )}

      {otherActivityTypes.length > 0 && (
        <div class="mt-8">
          <h3 class="text-xl font-semibold text-center mb-4">
            Other Recent Activities
          </h3>
          <ul class="list-disc list-inside space-y-2 text-center">
            {otherActivityTypes.map((type) => {
              const activity = activityData.latest_by_type[type];
              return (
                <li key={type}>
                  <span style={{ color: color(activity) }}>
                    {daysDisplay(activity)}
                  </span>{" "}
                  days since last {type} (
                  <a
                    href={`https://www.strava.com/activities/${activity.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600"
                  >
                    {format(new Date(activity.start_date_local), "PPPP")}
                  </a>
                  )
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
