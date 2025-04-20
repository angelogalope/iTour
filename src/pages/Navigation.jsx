import React, { useState } from 'react';

function Navigation() {
    // List of locations with coordinates from OpenStreetMap
  const locations = [
    { name: "Caraga State University", lat: 8.2292, lon: 125.5882 },
    { name: "Tokyo Tower", lat: 35.6586, lon: 139.7454 },
    { name: "Eiffel Tower", lat: 48.8584, lon: 2.2945 },
    { name: "St. Anthony of Padua Parish", lat: 8.828503, lon: 125.691453 },
  ];

  // State for selected location
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);

  // Handle location change
  const handleLocationChange = (e) => {
    const selected = locations.find(loc => loc.name === e.target.value);
    setSelectedLocation(selected);
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded shadow-lg">
        <select
          onChange={handleLocationChange}
          value={selectedLocation.name}
          className="p-2 border border-gray-300 rounded"
        >
          {locations.map((location, index) => (
            <option key={index} value={location.name}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      <a-scene
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false;"
        style={{ height: '100vh', width: '100%' }}
      >
        {/* Arrow pointing to the selected location */}
        <a-entity
          gps-entity-place={`latitude: ${selectedLocation.lat}; longitude: ${selectedLocation.lon}`}
          geometry="primitive: cone; height: 1; radiusBottom: 0.3"
          material="color: red"
          position="5 0.5 0"
          rotation="-90 0 0"
        ></a-entity>

        {/* Camera */}
        <a-camera gps-camera rotation-reader></a-camera>
      </a-scene>
    </div>
  );
}

export default Navigation;