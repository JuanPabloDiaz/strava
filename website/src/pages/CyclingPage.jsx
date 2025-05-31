import React, { useEffect, useState } from 'react';
import StravaDataManager from '@utils/StravaDataManager.js';

function CyclingPage() {
  const [lastRideData, setLastRideData] = useState(null);
  const [rideStats, setRideStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataManager = new StravaDataManager();
    async function loadData() {
      setLoading(true);
      const data = await dataManager.getLastActivity('Ride'); // Changed type to 'Ride'
      if (data && data.lastActivity && data.stats) {
        setLastRideData(data.lastActivity);
        setRideStats(data.stats);
      } else {
        console.error("Failed to load cycling data from StravaDataManager");
        setLastRideData(null);
        setRideStats(null);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-xl text-gray-500">Loading cycling data...</div>;
  }

  if (!lastRideData || !rideStats) {
    return <div className="text-center py-10 text-xl text-red-500">Could not load cycling data. Please try again later.</div>;
  }

  return (
    <div className="container mx-auto p-4 text-gray-800">
      <header className="text-center my-8">
        <h1 className="text-5xl font-bold text-blue-600">
          {lastRideData.daysSince}
        </h1>
        <p className="text-xl text-gray-600">Days Since Last Ride</p>
      </header>

      <section className="my-8 p-6 bg-white shadow-lg rounded-lg border-l-4 border-blue-500">
        <h2 className="text-3xl font-semibold mb-4 text-blue-500">Last Ride Details</h2>
        <p className="text-xl"><span className="font-semibold">Name:</span> {lastRideData.activity.name}</p>
        <p className="text-xl"><span className="font-semibold">Date:</span> {new Date(lastRideData.date).toLocaleDateString()}</p>
        <p className="text-xl"><span className="font-semibold">Distance:</span> {lastRideData.activity.distance} km</p>
        <p className="text-xl"><span className="font-semibold">Duration:</span> {lastRideData.activity.duration}</p>
        <p className="text-xl"><span className="font-semibold">Speed:</span> {lastRideData.activity.speed}</p>
      </section>

      <section className="my-8 p-6 bg-white shadow-lg rounded-lg border-l-4 border-blue-500">
        <h2 className="text-3xl font-semibold mb-4 text-blue-500">Cycling Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-4xl font-bold text-blue-600">{rideStats.total}</p>
            <p className="text-gray-600">Total Rides</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-600">{rideStats.distance} km</p>
            <p className="text-gray-600">Total Distance</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CyclingPage;
