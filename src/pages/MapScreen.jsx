import React, { useState, useEffect, useRef } from 'react';
import 'aframe';
import 'aframe-look-at-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEye, faBook, faSearch, faEllipsisH, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { IoInformation, IoEyeOutline } from "react-icons/io5";
import { GiOpenGate } from "react-icons/gi";
import { BsPersonWalking } from "react-icons/bs";
import nipplejs from 'nipplejs';
import * as THREE from 'three';
import Restrict from './components/restrict';
import { useNavigate } from 'react-router';
import SearchMenu from './components/SearchMenu';
import supabase from '../utils/supabase';

function MapScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAerialView, setIsAerialView] = useState(false);
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 10, z: 0 });
  const [events, setEvents] = useState([]);

  const rafRef = useRef();

  if (AFRAME) {
    delete AFRAME.systems['arjs'];
    delete AFRAME.components['arjs'];
    delete AFRAME.components['arjs-camera'];
    delete AFRAME.components['marker'];
    delete AFRAME.components['gps-camera'];
    delete AFRAME.components['location-based'];
  }

  // Fetch events from Supabase and filter by date
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events') // Replace 'events' with your table name
          .select('id, title, x_coordinate, y_coordinate, event_date'); // Include event_date

        if (error) throw error;

        // Get the current date
        const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // Filter events where event_date is greater than or equal to today
        const upcomingEvents = data.filter(event => event.event_date >= currentDate);

        setEvents(upcomingEvents); // Set only upcoming events in state
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  
  useEffect(() => {
    // Remove AR.js system if it's globally registered
    if (AFRAME && AFRAME.systems['arjs']) {
      delete AFRAME.systems['arjs'];
    }

    // Optional: Override arjs-camera if needed
    if (AFRAME.components['arjs-camera']) {
      delete AFRAME.components['arjs-camera'];
    }
  }, []);

  const cameraRigRef = useRef(null);
  const joystickRef = useRef(null);
  const modelRef = useRef(null);

  // Define dome radius and center coordinates
  const domeRadiusX = isAerialView ? 2610 : 2610;
  const domeRadiusZ = isAerialView ? 1150 : 1150;

  Restrict(cameraRigRef, joystickRef, domeRadiusX, domeRadiusZ);

  useEffect(() => {
    if (cameraRigRef.current) {
      const scene = document.querySelector('a-scene');
      if (!scene) return;

      // Listen for the scene's loaded event
      scene.addEventListener('loaded', () => {
        console.log('Scene loaded');
        // setIsLoading(false); 

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
          pitch: 0,
          yaw: -90,
          roll: 0,
        };

        cameraRigRef.current.object3D.rotation.set(
          THREE.MathUtils.degToRad(initialRotation.pitch),
          THREE.MathUtils.degToRad(initialRotation.yaw),
          THREE.MathUtils.degToRad(initialRotation.roll)
        );

        setTimeout(() => {
          cameraRigRef.current.setAttribute('look-controls', 'enabled', true);

          const lookControlsComponent = cameraRigRef.current.components['look-controls'];
          if (lookControlsComponent) {
            lookControlsComponent.pitchObject.rotation.x = THREE.MathUtils.degToRad(initialRotation.pitch);
            lookControlsComponent.yawObject.rotation.y = THREE.MathUtils.degToRad(initialRotation.yaw);
          }
        }, 100);

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

        const tick = () => {
          const position = cameraRigRef.current.object3D.position;
          setCameraPosition({
            x: position.x,
            y: position.y,
            z: position.z,
          });
          rafRef.current = requestAnimationFrame(tick);
        };

        tick();

        return () => {
          cameraRigRef.current.removeEventListener('componentchanged', updatePosition);
        };
      });
    }

    // Listen for the model's loaded event
    if (modelRef.current) {
      const modelEntity = modelRef.current;

      const handleModelLoaded = () => {
        console.log('Model loaded');
        setIsLoading(false); // Hide loading screen when the model is loaded
      };

      modelEntity.addEventListener('model-loaded', handleModelLoaded);

      // Fallback timeout in case the model fails to load
      const timeoutId = setTimeout(() => {
        console.warn('Model loading timed out');
        setIsLoading(false);
      }, 60000);

      return () => {
        modelEntity.removeEventListener('model-loaded', handleModelLoaded);
        clearTimeout(timeoutId);
      };
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

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleGate = () => {
    if (cameraRigRef.current) {
      const camera = cameraRigRef.current.object3D;
      camera.position.set(-2610, 10, -87);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center relative">
      {/* Loading Screen */}
      {isLoading ? (
        <div className="absolute inset-0 bg-primGreen flex flex-col items-center justify-center z-50">
          <div className="flex text-white text-md">Loading 3D Map...<BsPersonWalking className="animate-walking text-white pb-1" size={24} /></div>
        </div> 
       ) : (
        <div>
          {/* Back Button */}
          <button onClick={handleBack} className="absolute top-14 left-6 p-4 rounded-full shadow-slate-800 shadow-md flex bg-white z-50">
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>

          {/* Top-Right Menu */}
          <div className="absolute flex flex-col top-14 right-6 shadow-slate-800 shadow-lg z-50 rounded-xl">
            {/* <button onClick={handleBack} className="bg-white p-4 rounded-t-xl border-b text-lg">
              <IoInformation />
            </button> */}
            <button onClick={toggleView} className="bg-white p-4  rounded-t-xl border-b text-lg">
              {isAerialView ? <BsPersonWalking /> : <IoEyeOutline />}
            </button>
            <button onClick={handleGate} className="bg-white p-4 rounded-b-xl text-lg">
              <GiOpenGate />
            </button>
          </div>

          {/* Bottom Navigation Bar */}
          <div className="">
            <SearchMenu
              onBuildingSelect={(building) => {
                if (cameraRigRef.current) {
                  const camera = cameraRigRef.current.object3D;
                  camera.position.set(building.xCoord, building.yCoord, building.zCoord);
                  setCameraPosition({ x: building.xCoord, y: building.yCoord, z: building.zCoord });
                }
              }}
            />
          </div>

          <div className="absolute bottom-20 left-6 bg-white p-2 rounded-md shadow-md z-50">
            <p className="text-sm font-mono">
              X: {cameraPosition.x}, Y: {cameraPosition.y}, Z: {cameraPosition.z}
            </p>
          </div>
        </div>
      )}
    
      {/* A-Frame Scene */}
      <a-scene>
        <a-entity>
          <a-camera
            id="camera-rig"
            position={`${cameraPosition.x} ${isAerialView ? 200 : 10} ${cameraPosition.z}`}
            animation__position={`property: position; to: ${cameraPosition.x} ${isAerialView ? 200 : 10} ${cameraPosition.z}; dur: 1000; easing: easeInOutQuad`}
            look-controls="enabled: false"
            ref={cameraRigRef}
            arjs="false"
          ></a-camera>
        </a-entity>

        {/* Joystick */}
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
            zIndex: 1,
          }}
        ></a-entity>

        {/* Ground Plane */}
        <a-plane
          scale="20 20 1"
          position="-15 0 5"
          rotation="-90 180 0"
          width="270"
          height="120"
          repeat="1 1"
          shadow="receive: true"
          material="src: url(/src/assets/csu-ss.png)"
        ></a-plane>

        {/* 3D Model */}
        <a-entity
          ref={modelRef}
          gltf-model="url(/src/assets/CSU4.glb)"
          position="-345 0 12"
          rotation="0 -2 0"
          scale="2.5 2 2.6"
        ></a-entity>

        {/* Skybox */}
        <a-sky
          src="/src/assets/clear-sunny-sky.jpg"
          scale="1.7 1 0.8"
          radius="3000"
        ></a-sky>
        {/* Event Markers */}
        {events.map((event) => (
          <a-entity 
            key={event.id} 
            position={`${event.x_coordinate} 70 ${event.y_coordinate}`}
          >
            <a-entity
              animation="property: position; to: 0 10 0; dir: alternate; dur: 1000; easing: easeInOutSine; loop: true"
            >
              <a-entity
                obj-model="obj: url(/src/assets/pinpoint.obj)"
                material="color: red; shader: standard; roughness: 0.5; metalness: 0.2"
                scale="10 10 10"
                look-at="#camera-rig"
              ></a-entity>

              {/* Event Name */}
              <a-text
                value={event.title}
                align="center"
                color="black"
                position="0 35 0"
                scale="20 20 20"
                look-at="#camera-rig"
              ></a-text>
            </a-entity>
          </a-entity>
        ))}
      </a-scene>
    </div>
  );
}

export default MapScreen;