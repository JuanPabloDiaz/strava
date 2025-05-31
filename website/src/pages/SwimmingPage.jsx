import React, { useEffect, useState } from 'react';
import StravaDataManager from '@utils/StravaDataManager.js';

function SwimmingPage() {
  const [lastSwimData, setLastSwimData] = useState(null);
  const [swimStats, setSwimStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataManager = new StravaDataManager();
    async function loadData() {
      setLoading(true);
      const data = await dataManager.getLastActivity('Swim'); // Changed type to 'Swim'
      if (data && data.lastActivity && data.stats) {
        setLastSwimData(data.lastActivity);
        setSwimStats(data.stats);
      } else {
        console.error("Failed to load swimming data from StravaDataManager");
        setLastSwimData(null);
        setSwimStats(null);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-xl text-gray-500">Loading swimming data...</div>;
  }

  if (!lastSwimData || !swimStats) {
    return <div className="text-center py-10 text-xl text-red-500">Could not load swimming data. Please try again later.</div>;
  }

  return (
    <div className="container mx-auto p-4 text-gray-800">
      <header className="text-center my-8">
        <h1 className="text-5xl font-bold text-cyan-500"> {/* Aqua/Blue Theme */}
          {lastSwimData.daysSince}
        </h1>
        <p className="text-xl text-gray-600">Days Since Last Swim</p>
      </header>

      <section className="my-8 p-6 bg-white shadow-lg rounded-lg border-l-4 border-cyan-400"> {/* Aqua/Blue Theme */}
        <h2 className="text-3xl font-semibold mb-4 text-cyan-500">Last Swim Details</h2>
        <p className="text-xl"><span className="font-semibold">Name:</span> {lastSwimData.activity.name}</p>
        <p className="text-xl"><span className="font-semibold">Date:</span> {new Date(lastSwimData.date).toLocaleDateString()}</p>
        <p className="text-xl"><span className="font-semibold">Distance:</span> {lastSwimData.activity.distance} km</p>
        <p className="text-xl"><span className="font-semibold">Duration:</span> {lastSwimData.activity.duration}</p>
        <p className="text-xl"><span className="font-semibold">Pace:</span> {lastSwimData.activity.pace}</p>
      </section>

      <section className="my-8 p-6 bg-white shadow-lg rounded-lg border-l-4 border-cyan-400"> {/* Aqua/Blue Theme */}
        <h2 className="text-3xl font-semibold mb-4 text-cyan-500">Swimming Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-4xl font-bold text-cyan-500">{swimStats.total}</p>
            <p className="text-gray-600">Total Swims</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-cyan-500">{swimStats.distance} km</p>
            <p className="text-gray-600">Total Distance</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SwimmingPage;
