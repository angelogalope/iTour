import React, { useState, useEffect, useRef } from 'react';
import 'aframe';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEye, faBook, faSearch, faEllipsisH, faArrowLeft, } from '@fortawesome/free-solid-svg-icons';
import { IoInformation, IoEyeOutline,  } from "react-icons/io5";
import { GiOpenGate } from "react-icons/gi";
import { BsPersonWalking } from "react-icons/bs";
import nipplejs from 'nipplejs';
import * as THREE from 'three';
import "./components/restrict";
import { useNavigate } from 'react-router';
import SearchMenu from './components/SearchMenu';

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
        position: { left: '40%', bottom: '90%' },
        color: 'white'
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
  
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  }
  
  const handleGate = () => {
    if (cameraRigRef.current) {
      const camera = cameraRigRef.current.object3D;
      camera.position.set(0, 1.6, 5); // Replace with your spawn point coordinates
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center relative">
      <button onClick={handleBack} className="absolute top-14 left-6 p-4 rounded-full shadow-slate-800 shadow-md flex bg-white z-50">
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <div className="absolute flex flex-col top-14 right-6 shadow-slate-800 shadow-lg z-50 rounded-xl">
        <button onClick={handleBack} className="bg-white p-4 rounded-t-xl border-b text-lg">
          <IoInformation />
        </button>
        <button onClick={toggleView} className="bg-white p-4 border-b text-lg">
          {isAerialView ?  <BsPersonWalking /> : <IoEyeOutline />}
        </button>
        <button onClick={handleGate} className="bg-white p-4 rounded-b-xl text-lg">
          <GiOpenGate />
        </button>
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
      <SearchMenu />
    </div>
  );
}

export default MapScreen;
