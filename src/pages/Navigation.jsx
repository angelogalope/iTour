import React, { useState, useEffect } from 'react';
import ARView from './components/ARView';
// import { Button } from '@/components/ui/button';
import { predefinedDestinations } from '../utils/navigationUtils';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';

function Navigation() {
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [distance, setDistance] = useState(null);
  const navigate = useNavigate();
  const location = useLocation()

  const handleBackBtn = () => {
    navigate("/dashboard");
  }

  useEffect(() => {
    if (location.state && location.state.coordinates) {
        setSelectedDestination({
            label: location.state.coordinates.name,
            lat: location.state.coordinates.lat,
            lng: location.state.coordinates.lng,
        });
    }
}, [location]);
  
  // Setup global callback for distance updates from ARView
  useEffect(() => {
    window.updateNavigationDistance = (newDistance) => {
      setDistance(newDistance);
    };
    
    return () => {
      window.updateNavigationDistance = null;
    };
  }, []);
  
  const handleDestinationChange = (event) => {
    const selectedIndex = event.target.value;
    setSelectedDestination(predefinedDestinations[selectedIndex]);
  };

  return (
    <div className="">
      <ARView destination={selectedDestination} />
      
      {/* Destination selector overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-black/70 z-10 backdrop-blur-sm">
        <div className="flex flex-col space-y-3 max-w-md mx-auto">
          <div className="flex justify-between items-center">
            <label htmlFor="destination-select" className="text-white font-medium text-lg">
              Select Destination
            </label>
            <button onClick={handleBackBtn} size="sm" variant="outline" className="text-xs p-2 rounded-full bg-white/10 hover:bg-white/20 text-white">
              Back to Home
            </button>
          </div>
          
          <select 
            id="destination-select"
            className="p-3 rounded-md bg-white/90 border-2 border-blue-400 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleDestinationChange}
            defaultValue=""
          >
            <option value="" disabled>Choose a destination...</option>
            {predefinedDestinations.map((dest, index) => (
              <option key={dest.name} value={index}>
                {dest.name}
              </option>
            ))}
          </select>
          
          {selectedDestination && (
            <div className="mt-2 text-white bg-blue-600/70 p-3 rounded-md">
              <div className="flex items-center justify-between">
                <p className="font-bold text-lg">Navigating to: {selectedDestination.name || location.state.coordinates.name}</p>
                {distance && (
                  <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {Math.round(distance)}m away
                  </div>
                )}
              </div>
              <p className="text-xs opacity-90 mt-1">
                Follow the blue arrow to reach your destination
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navigation;