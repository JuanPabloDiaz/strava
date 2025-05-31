import React from 'react';

// Helper to get theme colors based on activity type
const getThemeColors = (type) => {
  switch (type.toLowerCase()) {
    case 'run':
      return { border: 'border-orange-500', text: 'text-orange-500', bg: 'bg-orange-50' };
    case 'ride':
      return { border: 'border-blue-500', text: 'text-blue-500', bg: 'bg-blue-50' };
    case 'swim':
      return { border: 'border-cyan-500', text: 'text-cyan-500', bg: 'bg-cyan-50' };
    default:
      return { border: 'border-gray-500', text: 'text-gray-500', bg: 'bg-gray-50' };
  }
};

function ActivityCard({ activity }) {
  if (!activity) return null;

  const theme = getThemeColors(activity.type);

  return (
    <div className={`p-4 bg-white shadow-md rounded-lg ${theme.border} border-l-4 mb-4`}>
      <h3 className={`text-xl font-semibold ${theme.text}`}>{activity.name} ({activity.type})</h3>
      <p className="text-sm text-gray-600">Date: {new Date(activity.date).toLocaleDateString()}</p>
      <p className="text-gray-700">Distance: {activity.distance} km</p>
      <p className="text-gray-700">Duration: {activity.duration}</p>
      {/* Add more details if needed, e.g., pace or speed if available */}
    </div>
  );
}

export default ActivityCard;
