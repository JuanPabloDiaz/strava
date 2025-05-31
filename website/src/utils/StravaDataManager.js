import jsonData from '../../last-activities.json';

class StravaDataManager {
  constructor() {
    console.log("StravaDataManager initialized");
  }

  async fetchActivities() {
    console.log('Fetching all activities from JSON...');
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100)); 
    return jsonData.recentActivities || [];
  }

  async getLastActivity(type) {
    console.log(`Fetching last activity of type: ${type} from JSON...`);
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let activityData = null;
    let activityStats = null;

    switch (type.toLowerCase()) {
      case 'run':
        activityData = jsonData.lastRun;
        activityStats = { total: jsonData.totalRuns, distance: jsonData.totalRunDistance };
        break;
      case 'ride': // Corrected from 'Ride' to 'ride' to match common usage
        activityData = jsonData.lastRide;
        activityStats = { total: jsonData.totalRides, distance: jsonData.totalRideDistance };
        break;
      case 'swim': // Corrected from 'Swim' to 'swim'
        activityData = jsonData.lastSwim;
        activityStats = { total: jsonData.totalSwims, distance: jsonData.totalSwimDistance };
        break;
      default:
        console.error(`Unknown activity type: ${type}`);
        return null; // Or throw an error
    }
    
    if (!activityData) {
      console.error(`No data found for activity type: ${type} in JSON.`);
      return { lastActivity: null, stats: activityStats || { total: 0, distance: 0 } };
    }

    return { lastActivity: activityData, stats: activityStats };
  }

  calculateDaysSince(dateString) {
    if (!dateString) return 0;
    const activityDate = new Date(dateString);
    const today = new Date();
    // Ensure dates are treated as UTC to avoid timezone issues if dates are Z-suffixed
    const utcActivityDate = Date.UTC(activityDate.getFullYear(), activityDate.getMonth(), activityDate.getDate());
    const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const differenceInTime = utcToday - utcActivityDate;
    return Math.floor(differenceInTime / (1000 * 3600 * 24));
  }

  formatActivityData(activity) {
    // Basic formatting, can be expanded
    if (!activity || !activity.date) {
      return activity; // or handle error
    }
    return {
      ...activity,
      // Ensure date is valid before trying to format
      date: new Date(activity.date).toLocaleDateString(), 
    };
  }
}

export default StravaDataManager;
