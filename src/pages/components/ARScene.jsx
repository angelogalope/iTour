// src/components/ARScene.jsx
import React, { useRef, useEffect } from 'react';

const buildings = [
  {
    name: "CSU Admin",
    lat: 8.955317,
    lon: 125.597932,
    model: "/models/CSU(Admin).obj",
    mtl: "/models/CSU(Admin).mtl"
  },
  {
    name: "CSU Library",
    lat: 8.957805,
    lon: 125.596443,
    model: "/models/CSU(Library).obj",
    mtl: "/models/CSU(Library).mtl"
  },
  {
    name: "CSU Hiraya",
    lat: 8.83086,
    lon: 125.69302,
    // lat: 8.957217,
    // lon: 125.597586,
    model: "/models/CSU(Hiraya).obj",
    mtl: "/models/CSU(Hiraya).mtl"
  }
];

const ARScene = () => {
  const sceneRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window && window.aframe && window.aframe.components['gps-camera']) {
        const gpsCamera = document.querySelector('[gps-camera]');
        if (gpsCamera && gpsCamera.components['gps-camera']) {
          const coords = gpsCamera.components['gps-camera'].currentCoords;
          if (coords) {
            const debugText = document.getElementById('gps-debug');
            debugText.setAttribute('value', `Lat: ${coords.latitude}\nLon: ${coords.longitude}\nAcc: ${coords.accuracy}m`);
          }
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <a-scene
      ref={sceneRef}
      embedded
      arjs="sourceType: webcam; gpsMinAccuracy: 100; trackingMethod: best;"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        margin: 0,
        padding: 0
      }}
    >
      <a-camera gps-camera rotation-reader></a-camera>
      {/* <a-text
        position="0 2 -5"
        value="Waiting for GPS..."
        id="gps-debug"
        color="black"
      ></a-text> */}

      {buildings.map((building, index) => (
        <a-entity
          key={index}
          gps-entity-place={`latitude: ${building.lat}; longitude: ${building.lon};`}
          obj-model={`obj: ${building.model}; mtl: ${building.mtl}`}
          scale="0.1 0.1 0.1"
          look-at="[gps-camera]"
          rotation="-90 0 0"
        ></a-entity>
      ))}

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
    </a-scene>
  );
};

export default ARScene;
