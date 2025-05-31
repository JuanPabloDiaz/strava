import React, { useEffect, useState } from 'react';
import StravaDataManager from '@utils/StravaDataManager.js';
import ActivityCard from '@components/ActivityCard'; 

function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataManager = new StravaDataManager();
    async function loadData() {
      setLoading(true);
      const fetchedActivities = await dataManager.fetchActivities();
      setActivities(fetchedActivities || []); // Ensure it's an array
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-xl text-gray-500">Loading activities...</div>;
  }

  if (activities.length === 0) {
    return <div className="text-center py-10 text-xl text-gray-500">No activities found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold my-6 text-center text-gray-700">All Activities</h1>
      
      {/* Placeholder for Filters/Sort/Search - to be added later */}
      <div className="my-4 p-4 bg-gray-100 rounded-lg">
        <p className="text-center text-gray-500">Filters, Sort, and Search will be here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map(activity => (
          <ActivityCard key={activity.id || activity.name} activity={activity} />
        ))}
      </div>
    </div>
  );
}

export default ActivitiesPage;
