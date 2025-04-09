import React, { useState, useEffect, useRef } from 'react';
import 'aframe';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEye, faBook, faSearch, faEllipsisH, faArrowLeft, } from '@fortawesome/free-solid-svg-icons';
import { IoInformation, IoEyeOutline,  } from "react-icons/io5";
import { GiOpenGate } from "react-icons/gi";
import { BsPersonWalking } from "react-icons/bs";
import nipplejs from 'nipplejs';
import * as THREE from 'three';
import Restrict from './components/Restrict';
import { useNavigate } from 'react-router';
import SearchMenu from './components/SearchMenu';

function MapScreen() {
  const [isAerialView, setIsAerialView] = useState(false);
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 10, z: 0 }); // Initialize with aerial view position

  const cameraRigRef = useRef(null);
  const joystickRef = useRef(null);
  // const domeRef = useRef(null);

  // Define dome radius and center coordinates
  const domeRadiusX = isAerialView ? 2610 : 2610; // Adjust this to the actual dome radius for x-axis
  const domeRadiusZ = isAerialView ? 1150 : 1150;  // Adjust this to the actual dome radius for z-axis

  Restrict(cameraRigRef, joystickRef, domeRadiusX, domeRadiusZ);   // Use the custom hook to restrict camera movement

  useEffect(() => {
    if (cameraRigRef.current) {
      // Wait for the A-Frame scene to be fully loaded
      const scene = document.querySelector('a-scene');
      if (!scene) return;
  
      scene.addEventListener('loaded', () => {
        // Temporarily disable look-controls
        cameraRigRef.current.setAttribute('look-controls', 'enabled', false);
  
        // Set the initial position of the camera
        const initialPosition = { x: -2610, y: 10, z: -87 };
        setCameraPosition(initialPosition);
        cameraRigRef.current.object3D.position.set(
          initialPosition.x,
          initialPosition.y,
          initialPosition.z
        );
  
        // Set a fixed rotation for the camera
        const initialRotation = {
          pitch: 0,  // No tilt up/down
          yaw: -90,  // Face right (you can change this to any fixed value)
          roll: 0,   // No tilt left/right
        };
  
        // Apply the fixed rotation to the camera
        cameraRigRef.current.object3D.rotation.set(
          THREE.MathUtils.degToRad(initialRotation.pitch),
          THREE.MathUtils.degToRad(initialRotation.yaw),
          THREE.MathUtils.degToRad(initialRotation.roll)
        );
  
        // Wait for look-controls to initialize, then force it to respect the initial rotation
        setTimeout(() => {
          cameraRigRef.current.setAttribute('look-controls', 'enabled', true);
  
          // Force look-controls to respect the initial rotation
          const lookControlsComponent = cameraRigRef.current.components['look-controls'];
          if (lookControlsComponent) {
            lookControlsComponent.pitchObject.rotation.x = THREE.MathUtils.degToRad(initialRotation.pitch);
            lookControlsComponent.yawObject.rotation.y = THREE.MathUtils.degToRad(initialRotation.yaw);
          }
        }, 100); // Small delay ensures smooth transition
  
        // Listen for position changes
        const updatePosition = () => {
          const position = cameraRigRef.current.object3D.position;
          setCameraPosition({ x: position.x, y: position.y, z: position.z });
        };
  
        cameraRigRef.current.addEventListener('componentchanged', (event) => {
          if (event.detail.name === 'position') {
            updatePosition();
          }
        });
  
        // Cleanup listener
        return () => {
          cameraRigRef.current.removeEventListener('componentchanged', updatePosition);
        };
      });
    }
  }, []);

  const toggleView = () => {
    if (cameraRigRef.current) {
      const currentPosition = cameraRigRef.current.object3D.position;
      setCameraPosition({
        x: currentPosition.x,
        y: isAerialView ? 10 : 200,
        z: currentPosition.z,
      });
    }
    setIsAerialView(!isAerialView);
  };

  // useEffect(() => {
    // if (domeRef.current && cameraRigRef.current) {
    //   const joystick = nipplejs.create({
    //     zone: joystickRef.current,
    //     mode: 'static',
    //     position: { left: '40%', bottom: '90%' },
    //     color: 'white'
    //   });

  //     // Define dome radius and center coordinates
  //     const domeRadius = isAerialView ? 480 : 360; // Adjust this to the actual dome radius
  //     const domeCenter = new THREE.Vector3(0, 0, 0);

    //   joystick.on('move', (event, data) => {
    //     const { angle, distance } = data;
    //     const camera = cameraRigRef.current.object3D;
    //     const cameraRotationY = camera.rotation.y;

    //     const angleRad = (angle.degree * Math.PI) / 180;
    //     const moveDistance = distance / 50;
    //     const dx = moveDistance * Math.cos(angleRad + cameraRotationY);
    //     const dz = moveDistance * Math.sin(angleRad + cameraRotationY);

    //     // Calculate potential new position
    //     const newPosition = camera.position.clone().add(new THREE.Vector3(dx, 0, -dz));

    //     // Calculate distance from dome center to the new position
    //     const distanceFromCenter = domeCenter.distanceTo(newPosition);

    //     // Restrict movement to within dome radius
    //     if (distanceFromCenter <= domeRadius) {
    //       camera.position.copy(newPosition);
    //     } else {
    //       // Calculate restricted position along dome edge
    //       const directionToCenter = newPosition.clone().sub(domeCenter).normalize();
    //       const restrictedPosition = domeCenter.clone().add(directionToCenter.multiplyScalar(domeRadius));
    //       camera.position.copy(restrictedPosition);
    //     }
    //   });

    //   joystick.on('end', () => {
    //     if (cameraRigRef.current) {
    //       cameraRigRef.current.object3D.position.x += 0;
    //       cameraRigRef.current.object3D.position.z += 0;
    //     }
    //   });
    // }
  // }, [isAerialView]);
  
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  }
  
  const handleGate = () => {
    if (cameraRigRef.current) {
      const camera = cameraRigRef.current.object3D;
      camera.position.set(-2610, 10, -87); // Replace with your spawn point coordinates
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
            position={`${cameraPosition.x} ${isAerialView ? 200 : 10} ${cameraPosition.z}`}
            animation__position={`property: position; to: ${cameraPosition.x} ${isAerialView ? 200 : 10} ${cameraPosition.z}; dur: 1000; easing: easeInOutQuad`}
            look-controls="enabled: false"
            ref={cameraRigRef}>
          </a-camera>
        </a-entity>

        {/* <div className="w-full bg-white"> */}
        <a-entity 
          ref={joystickRef}
          position="0 0 0"
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '50%',
            transform: 'translateX(10%)',
            width: '200px',
            height: '200px',
            zIndex: 1}}>
        </a-entity>
        {/* </div> */}

        <a-plane
          // scale="20 20 1"
          // position="-15 0 5"
          // rotation="-90 180 0"
          // width="80"
          // height="40"
          // src="/src/assets/map-screenshot.png"
          // repeat="1 1"
          // shadow="receive: true">
          scale="20 20 1"
          position="-15 0 5"
          rotation="-90 180 0"
          width="270"
          height="120"
          color="gray"
          repeat="1 1"
          shadow="receive: true">
        </a-plane>

        <a-entity
          // gltf-model="url(/src/assets/CSU1.gltf)"
          obj-model="obj: url(/src/assets/CSU1.obj); mtl: url(/src/assets/CSU1.mtl)"
          position="-345 0 12"
          rotation="0 -2 0"
          scale="2.5 2 2.6">
        </a-entity>

        <a-sky
          // ref={domeRef}
          src="/src/assets/clear-sunny-sky.jpg"
          scale="1.7 1 0.8"
          radius="3000"
          // side="double"
        >
        </a-sky>
      </a-scene>

      {/* Bottom Navigation Bar */}
      <SearchMenu />
    </div>
  );
}

export default MapScreen;
