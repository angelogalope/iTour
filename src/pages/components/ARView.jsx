import React, { useEffect, useState, useRef } from "react";
import "aframe";
import "ar.js";
import { calculateBearing, calculateDistance } from '../../utils/navigationUtils';
import "../../assets/arrow.js";

const ARView = ({ destination }) => {
  // We'll add a callback to send distance updates to the parent component
  const onDistanceUpdate = distance => {
    if (window.updateNavigationDistance) {
      window.updateNavigationDistance(distance);
    }
  };
  const [userLocation, setUserLocation] = useState(null);
  const [bearing, setBearing] = useState(0);
  const [distance, setDistance] = useState(null);
  const watchId = useRef(null);
  const arrowRef = useRef(null);
  const deviceOrientationRef = useRef({
    alpha: null,
    webkitCompassHeading: null,
    absolute: false
  });
  
  // Function to get user's location
  const startLocationTracking = () => {
    if (navigator.geolocation) {
      // Get initial position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Please enable location services to use navigation");
        },
        { enableHighAccuracy: true }
      );
      
      // Watch position for real-time updates with higher frequency
      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setUserLocation(newLocation);
          console.log("Location updated:", newLocation);
          
          // Immediately update bearing when location changes
          if (destination) {
            updateBearingAndDistance(newLocation, destination);
          }
        },
        (error) => {
          console.error("Error watching location:", error);
        },
        { enableHighAccuracy: true, maximumAge: 500, timeout: 2000 }
      );
    } else {
      alert("Geolocation is not supported by this browser");
    }
  };
  
  // Update bearing and distance based on current location and destination
  const updateBearingAndDistance = (currentLocation, dest) => {
    if (!currentLocation || !dest) return;
    
    const newBearing = calculateBearing(
      currentLocation.lat,
      currentLocation.lng,
      dest.lat,
      dest.lng
    );
    
    const newDistance = calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      dest.lat,
      dest.lng
    );
    
    console.log("New Bearing:", newBearing.toFixed(2), "New Distance:", newDistance.toFixed(2));
    setBearing(newBearing);
    setDistance(newDistance);
    
    // Call the distance update callback
    onDistanceUpdate(newDistance);
    
    // Notify user when they're close to destination (within 20 meters)
    if (newDistance < 20 && distance && distance > 20) {
      // Only notify if they weren't previously close
      alert(`You're almost at your destination: ${dest.name}!`);
    }
    
    // Force arrow rotation update
    updateArrowRotation(newBearing);
  };
  
  // Start location tracking when component mounts
  useEffect(() => {
    startLocationTracking();
    
    // Request device orientation permission for iOS
    const requestOrientationPermission = () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && 
          typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation, true);
            } else {
              console.error("Device orientation permission denied");
              alert("Please allow device orientation access for navigation");
            }
          })
          .catch(console.error);
      } else {
        // For non-iOS devices or older iOS versions
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    };
    
    // Try to add listener immediately (for Android)
    window.addEventListener('deviceorientation', handleOrientation, true);
    
    // For iOS, add a click handler to request permission
    document.body.addEventListener('click', requestOrientationPermission, { once: true });
    
    // Setup orientation change event to recalculate on phone rotation
    window.addEventListener('orientationchange', () => {
      if (userLocation && destination) {
        updateBearingAndDistance(userLocation, destination);
      }
    });
    
    // Add a timer to update the arrow rotation frequently even if no other events fire
    const rotationInterval = setInterval(() => {
      if (userLocation && destination) {
        updateArrowRotation();
      }
    }, 200); // Update every 200ms
    
    // Clean up when component unmounts
    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
      }
      window.removeEventListener('deviceorientation', handleOrientation, true);
      document.body.removeEventListener('click', requestOrientationPermission);
      window.removeEventListener('orientationchange', updateArrowRotation);
      clearInterval(rotationInterval);
    };
  }, []);
  
  // Handle device orientation changes to get compass heading
  const handleOrientation = (event) => {
    // Store orientation data
    deviceOrientationRef.current = {
      alpha: event.alpha,
      webkitCompassHeading: event.webkitCompassHeading,
      absolute: event.absolute || false
    };
    
    // Update arrow rotation whenever device orientation changes
    updateArrowRotation();
  };
  
  // Update arrow rotation based on device orientation and destination bearing
  const updateArrowRotation = (currentBearing = null) => {
    if (!userLocation || !destination) return;
    
    // Use provided bearing or the current state bearing
    const destBearing = currentBearing !== null ? currentBearing : bearing;
    
    // Get compass heading - where the device is pointing
    let compassHeading = null;
    
    // Use WebKit compass heading (iOS)
    if (deviceOrientationRef.current.webkitCompassHeading !== null) {
      compassHeading = deviceOrientationRef.current.webkitCompassHeading;
    } 
    // Use alpha (Android)
    else if (deviceOrientationRef.current.alpha !== null) {
      // On Android, alpha gives the rotation of the device from North
      compassHeading = 360 - deviceOrientationRef.current.alpha;
      
      // Adjust for screen orientation if available
      if (window.screen && window.screen.orientation) {
        const screenOrientation = window.screen.orientation.angle || 0;
        compassHeading = (compassHeading + screenOrientation) % 360;
      }
    }
    
    if (compassHeading === null) {
      console.log("No valid compass data yet");
      return;
    }
    
    // Calculate relative bearing (arrow rotation)
    // This formula ensures the arrow points toward the destination regardless of phone orientation
    const relativeBearing = (destBearing - compassHeading + 360) % 360;
    
    console.log("Compass:", compassHeading.toFixed(2), "Destination Bearing:", destBearing.toFixed(2), "Arrow Rotation:", relativeBearing.toFixed(2));
    
    // Update the arrow's rotation
    const arrowElement = document.getElementById('navigation-arrow');
    if (arrowElement) {
      arrowElement.setAttribute('navigation-arrow', `bearing: ${relativeBearing}`);
    }
  };
  
  // Update bearing and distance when user location or destination changes
  useEffect(() => {
    if (userLocation && destination) {
      updateBearingAndDistance(userLocation, destination);
    }
  }, [userLocation, destination]);
  
  return (
    <div>
      <a-scene
        vr-mode-ui="enabled: false"
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix;"
        renderer="logarithmicDepthBuffer: true;"
        style={{ width: "100%", height: "100vh", position: "absolute", top: 0, left: 0 }}
      >
        {/* Navigation Arrow pointing to destination */}
        <a-entity camera>
          {/* The arrow is attached to the camera so it stays in view */}
          <a-entity
            ref={arrowRef}
            id="navigation-arrow"
            position="0 -0.999 -5"
            navigation-arrow="color: #0066ff; size: 1; bearing: 0"
          ></a-entity>
          
          {/* Distance indicator (text) */}
          {destination && distance && (
            <a-text
              value={`${Math.round(distance)} meters`}
              position="0 0.25 -1"
              color="white"
              align="center"
              scale="0.5 0.5 0.5"
            ></a-text>
          )}
        </a-entity>
        
        {/* Scene end */}
      </a-scene>
      
      {/* Loading indicators and fallbacks */}
      {!userLocation && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="bg-white p-4 rounded">
            <p>Please allow location access...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARView;