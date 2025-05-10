import React, { useEffect, useState, useRef } from "react";
import "aframe";
import "ar.js";
import { calculateBearing, calculateDistance } from '../../utils/navigationUtils';
import "../../utils/arrow";

const ARView = ({ destination }) => {
  // At top of ARView.jsx
const smoothBearing = useRef(0);

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
    
    console.log("[DEBUG] Bearing:", newBearing, "Distance:", newDistance);
    setBearing(newBearing);
    setDistance(newDistance);
    onDistanceUpdate(newDistance);
    
    // Force update the arrow rotation immediately
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
    }, 5); // Update every 200ms
    
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
    // Only process if we have valid data
    if (event.alpha !== null || event.webkitCompassHeading !== null) {
      deviceOrientationRef.current = {
        alpha: event.alpha,
        webkitCompassHeading: event.webkitCompassHeading,
        absolute: event.absolute
      };
      updateArrowRotation();
    }
  };
  
  // Update arrow rotation based on device orientation and destination bearing
  const updateArrowRotation = (currentBearing = null) => {
    if (!userLocation || !destination) return;
  
    // Use provided bearing or fall back to state
    const destBearing = currentBearing !== null ? currentBearing : bearing;
  
    // Get current compass heading
    let compassHeading = null;
  
    // iOS (WebKit)
    if (typeof deviceOrientationRef.current.webkitCompassHeading === 'number') {
      compassHeading = deviceOrientationRef.current.webkitCompassHeading;
    } 
    // Android/other devices
    else if (typeof deviceOrientationRef.current.alpha === 'number') {
      // Invert alpha and adjust for screen orientation
      compassHeading = (360 - deviceOrientationRef.current.alpha);
  
      // Adjust for screen orientation (portrait or landscape)
      if (window.screen?.orientation?.angle) {
        compassHeading = (compassHeading + window.screen.orientation.angle);
      }
  
      // Additional adjustment for Android-specific quirks
      if (navigator.userAgent.match(/Android/i)) {
        compassHeading = (compassHeading + 180); // Flip 180 degrees for Android
      }
    }
  
    // Calculate final rotation
    let arrowRotation = 0;
    if (compassHeading !== null) {
      // Point to destination relative to compass
      arrowRotation = (destBearing - compassHeading + 360) % 360;
    } else {
      // Fallback: point directly to destination (ignore device rotation)
      arrowRotation = destBearing;
    }
  
    console.log("[ARROW] Setting rotation to:", arrowRotation);
  
    // Update the arrow via A-Frame component
    const arrowElement = document.getElementById('navigation-arrow');
    if (arrowElement) {
      arrowElement.setAttribute('navigation-arrow', {
        bearing: arrowRotation,
        pulse: true
      });
    }
  
    // Smooth the bearing transition
    smoothBearing.current = smoothBearing.current * 0.3 + arrowRotation * 0.7;
    arrowRotation = smoothBearing.current;
  };
  
  // Update bearing and distance when user location or destination changes
  useEffect(() => {
    // This should run whenever destination OR userLocation changes
    if (userLocation && destination) {
      updateBearingAndDistance(userLocation, destination);
    }
  }, [userLocation, destination]);

  useEffect(() => {
    // Setup orientation listeners
    const requestOrientation = () => {
      if (typeof DeviceOrientationEvent !== 'undefined') {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
          // iOS 13+ permission flow
          DeviceOrientationEvent.requestPermission()
            .then(permission => {
              if (permission === 'granted') {
                window.addEventListener('deviceorientation', handleOrientation, true);
              }
            })
            .catch(console.error);
        } else {
          // Non-iOS devices
          window.addEventListener('deviceorientation', handleOrientation, true);
        }
      }
    };
  
    // Start orientation detection
    requestOrientation();
  
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);
  
  return (
    <div>
      <a-scene
        vr-mode-ui="enabled: false"
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix;"
        renderer="logarithmicDepthBuffer: true;"
        style={{ 
          position: "fixed", 
          top: 0, 
          left: 0, 
          width: "100vw", // Ensure full viewport width
          height: "100vh", // Ensure full viewport height
          overflow: "hidden",
          margin: 0, // Ensure no margin
          padding: 0, // Ensure no padding
        }}
      >
        {/* Navigation Arrow pointing to destination */}
        <a-entity camera>
          {/* The arrow is attached to the camera so it stays in view */}
          <a-entity
            ref={arrowRef}
            id="navigation-arrow"
            position="0 -0.999 -5"
            navigation-arrow="color: #0066ff; size: 1; bearing: 0;"
          ></a-entity>
          
          {/* Distance indicator (text)
          {destination && distance && (
            <a-text
              value={`${Math.round(distance)} meters`}
              position="0 0.25 -1"
              color="white"
              align="center"
              scale="0.5 0.5 0.5"
            ></a-text>
          )} */}
        </a-entity>
        
      <style>{`
        video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
          position: fixed !important;
          top: 0;
          left: 0;
          z-index: -2;
          margin: 0 !important;
          padding: 0 !important;
        }
      `}</style>
        {/* Scene end */}
        
      </a-scene>
        {/* <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="bg-white p-4 rounded">
            <p>Loading AR environment...</p>
          </div>
        </div> */}
      
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