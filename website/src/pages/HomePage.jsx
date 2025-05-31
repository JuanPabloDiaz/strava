import React, { useEffect, useState } from 'react';
import StravaDataManager from '@utils/StravaDataManager.js';

// HomePage: Running-specific dashboard
function HomePage() {
  const [lastRunData, setLastRunData] = useState(null);
  const [runStats, setRunStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataManager = new StravaDataManager();
    async function loadData() {
      setLoading(true);
      const data = await dataManager.getLastActivity('Run');
      if (data && data.lastActivity && data.stats) {
        setLastRunData(data.lastActivity);
        setRunStats(data.stats);
      } else {
        // Handle error or empty data case
        console.error("Failed to load running data from StravaDataManager");
        setLastRunData(null);
        setRunStats(null);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-xl text-gray-500">Loading running data...</div>;
  }

  if (!lastRunData || !runStats) {
    return <div className="text-center py-10 text-xl text-red-500">Could not load running data. Please try again later.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <header className="text-center my-8">
        <h1 className="text-5xl font-bold text-orange-600">
          {lastRunData.daysSince}
        </h1>
        <p className="text-xl text-gray-600">Days Since Last Run</p>
      </header>

      <section className="my-8 p-6 bg-white shadow-lg rounded-lg border-l-4 border-orange-500">
        <h2 className="text-3xl font-semibold mb-4 text-orange-500">Last Run Details</h2>
        <p className="text-xl"><span className="font-semibold">Name:</span> {lastRunData.activity.name}</p>
        <p className="text-xl"><span className="font-semibold">Date:</span> {new Date(lastRunData.date).toLocaleDateString()}</p>
        <p className="text-xl"><span className="font-semibold">Distance:</span> {lastRunData.activity.distance} km</p>
        <p className="text-xl"><span className="font-semibold">Duration:</span> {lastRunData.activity.duration}</p>
        <p className="text-xl"><span className="font-semibold">Pace:</span> {lastRunData.activity.pace}</p>
      </section>

      <section className="my-8 p-6 bg-white shadow-lg rounded-lg border-l-4 border-orange-500">
        <h2 className="text-3xl font-semibold mb-4 text-orange-500">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-4xl font-bold text-orange-600">{runStats.total}</p>
            <p className="text-gray-600">Total Runs</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-orange-600">{runStats.distance} km</p>
            <p className="text-gray-600">Total Distance</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
