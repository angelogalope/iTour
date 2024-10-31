import React, { useState, useEffect, useRef } from 'react';
import 'aframe';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEye, faEyeSlash, faBook, faSearch, faEllipsisH, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import nipplejs from 'nipplejs';
import * as THREE from 'three';
import "./components/restrict";

function MapScreen() {
  const [isAerialView, setIsAerialView] = useState(false);
  const toggleView = () => setIsAerialView(!isAerialView);  

  const cameraRigRef = useRef(null);
  const joystickRef = useRef(null);
  const domeRef = useRef(null);

  useEffect(() => {
    if (domeRef.current && cameraRigRef.current) {
      const joystick = nipplejs.create({
        zone: joystickRef.current,
        mode: 'static',
        position: { left: '40%', bottom: '60%' },
        color: 'black'
      });

      // Define dome radius and center coordinates
      const domeRadius = isAerialView ? 480 : 360; // Adjust this to the actual dome radius
      const domeCenter = new THREE.Vector3(0, 0, 0);

      joystick.on('move', (event, data) => {
        const { angle, distance } = data;
        const camera = cameraRigRef.current.object3D;
        const cameraRotationY = camera.rotation.y;

        const angleRad = (angle.degree * Math.PI) / 180;
        const moveDistance = distance / 50;
        const dx = moveDistance * Math.cos(angleRad + cameraRotationY);
        const dz = moveDistance * Math.sin(angleRad + cameraRotationY);

        // Calculate potential new position
        const newPosition = camera.position.clone().add(new THREE.Vector3(dx, 0, -dz));

        // Calculate distance from dome center to the new position
        const distanceFromCenter = domeCenter.distanceTo(newPosition);

        // Restrict movement to within dome radius
        if (distanceFromCenter <= domeRadius) {
          camera.position.copy(newPosition);
        } else {
          // Calculate restricted position along dome edge
          const directionToCenter = newPosition.clone().sub(domeCenter).normalize();
          const restrictedPosition = domeCenter.clone().add(directionToCenter.multiplyScalar(domeRadius));
          camera.position.copy(restrictedPosition);
        }
      });

      joystick.on('end', () => {
        if (cameraRigRef.current) {
          cameraRigRef.current.object3D.position.x += 0;
          cameraRigRef.current.object3D.position.z += 0;
        }
      });
    }
  }, [isAerialView]);

  return (
    <div className="h-screen flex flex-col items-center justify-center relative">
      <div className="absolute top-14 left-8 p-4 rounded-full shadow-2xl drop-shadow-2xl flex bg-white z-50">
        <FontAwesomeIcon icon={faArrowLeft} />
      </div>
      <a-scene>
        <a-entity>
          <a-camera
            position={isAerialView ? "0 1.6 5" : "0 200 15"}
            animation__position={`property: position; to: ${isAerialView ? '0 200 15' : '0 1.6 5'}; dur: 1000; easing: easeInOutQuad`}
            look-controls="touchEnabled: true"
            ref={cameraRigRef}>
          </a-camera>
        </a-entity>

        <div className="w-full bg-white">
          <a-entity 
            ref={joystickRef}
            style={{
              position: 'absolute',
              bottom: 0,
              transform: 'translateX(10%)',
              width: '100%',
              height: '200px',
              zIndex: 1}}
          >
          </a-entity>
        </div>

        <a-plane
          scale="20 20 1"
          position="-15 0 5"
          rotation="-90 180 0"
          width="80"
          height="40"
          src="/src/assets/map-screenshot.png"
          repeat="1 1"
          shadow="receive: true">
        </a-plane>

        <a-entity
          obj-model="obj: url(/src/assets/csu.obj)"
          position="-345 0 12"
          rotation="0 -3 0"
          scale="2.5 2 2.6">
        </a-entity>

        <a-sky
          ref={domeRef}
          src="/src/assets/clear-sunny-sky.jpg"
          scale="1.7 1 0.8"
          radius="600"
          side="double">
        </a-sky>
      </a-scene>

      {/* Bottom Navigation Bar */}
      <div className="absolute bottom-0 w-full bg-white pb-16 py-8 flex justify-around items-center border-t border-gray-200">
        <div className="flex flex-col items-center">
        <button onClick={toggleView} 
            className="rounded-full shadow-2xl z-50">
            <FontAwesomeIcon icon={isAerialView ? faUser : faEye} size="lg" />
          </button>
          <span className="text-xs">View</span>
        </div>
        <div className="flex flex-col items-center">
          <FontAwesomeIcon icon={faBook} size="lg" />
          <span className="text-xs">Gate</span>
        </div>
        <div className="flex flex-col items-center">
          {/* <FontAwesomeIcon icon={faEyeSlash} size="lg" /> */}
          {/* <span className="text-xs">Move</span> */}
        </div>
        <div className="flex flex-col items-center">
          <FontAwesomeIcon icon={faSearch} size="lg" />
          <span className="text-xs">Search</span>
        </div>
        <div className="flex flex-col items-center">
          <FontAwesomeIcon icon={faEllipsisH} size="lg" />
          <span className="text-xs">More</span>
        </div>
      </div>
    </div>
  );
}

export default MapScreen;
