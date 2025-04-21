
/**
 * Utility functions for AR navigation
 */

// OpenRouteService API key
// Note: You'll need to replace this with your own API key from https://openrouteservice.org/
// This is just a placeholder - you should get your own API key
const ORS_API_KEY = "5b3ce3597851110001cf6248276939268e9446dea8be4a8c3b6d7214";

/**
 * Get directions between two points using OpenRouteService
 * @param {Object} start - Starting coordinates {lat, lng}
 * @param {Object} end - Destination coordinates {lat, lng}
 * @returns {Promise} - Promise resolving to route data
 */
export const getDirections = async (start, end) => {
  try {
    const response = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, application/geo+json, application/gpx+xml',
        'Content-Type': 'application/json',
        'Authorization': ORS_API_KEY
      },
      body: JSON.stringify({
        coordinates: [
          [start.lng, start.lat],
          [end.lng, end.lat]
        ],
        format: 'geojson'
      })
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching directions:', error);
    return null;
  }
};

/**
 * Calculate bearing between two points
 * @param {number} startLat - Starting latitude
 * @param {number} startLng - Starting longitude
 * @param {number} destLat - Destination latitude
 * @param {number} destLng - Destination longitude
 * @returns {number} - Bearing in degrees (0-360)
 */
export const calculateBearing = (startLat, startLng, destLat, destLng) => {
  const toRad = (deg) => deg * Math.PI / 180;
  const toDeg = (rad) => rad * 180 / Math.PI;
  
  const startLatRad = toRad(startLat);
  const startLngRad = toRad(startLng);
  const destLatRad = toRad(destLat);
  const destLngRad = toRad(destLng);
  
  const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad);
  const x = Math.cos(startLatRad) * Math.sin(destLatRad) -
            Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad);
  
  let bearing = toDeg(Math.atan2(y, x));
  bearing = (bearing + 360) % 360; // Normalize to 0-360
  return bearing;
};

/**
 * Calculate distance between two points in meters using Haversine formula
 * @param {number} startLat - Starting latitude
 * @param {number} startLng - Starting longitude
 * @param {number} destLat - Destination latitude
 * @param {number} destLng - Destination longitude
 * @returns {number} - Distance in meters
 */
export const calculateDistance = (startLat, startLng, destLat, destLng) => {
  const toRad = (deg) => deg * Math.PI / 180;
  const R = 6371e3; // Earth's radius in meters
  
  const phi1 = toRad(startLat);
  const phi2 = toRad(destLat);
  const deltaPhi = toRad(destLat - startLat);
  const deltaLambda = toRad(destLng - startLng);
  
  const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c; // Distance in meters
};

// Sample predefined destinations data
export const predefinedDestinations = [
  { name: "Simbahan", lat: 8.828503, lng: 125.691453 },
  { name: "CSU", lat: 8.9574, lng: 125.5974 },
  { name: "Hero Learning Commons", lat: 8.95785, lng: 125.596443 },
  { name: "Museum", lat: 40.7142, lng: -74.0085 }
];