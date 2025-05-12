import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import "aframe";
import "aframe-look-at-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEye,
  faBook,
  faSearch,
  faEllipsisH,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { IoInformation, IoEyeOutline } from "react-icons/io5";
import { GiOpenGate } from "react-icons/gi";
import { BsPersonWalking } from "react-icons/bs";
import nipplejs from "nipplejs";
import * as THREE from "three";
import Restrict from "./components/restrict";
import { useNavigate } from "react-router";
import SearchMenu from "./components/SearchMenu";
import supabase from "../utils/supabase";
import wayPoints from "../data/wayPoints";
import graph from "../data/graphs";

function MapScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAerialView, setIsAerialView] = useState(false);
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 1.9, z: 0 });
  const [events, setEvents] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [isOnCampus, setIsOnCampus] = useState(false);
  const CAMPUS_LAT_CENTER = 8.956136; // Your campus center coordinates
  const CAMPUS_LON_CENTER = 125.597071;
  // const CAMPUS_LAT_CENTER = 8.955521; // Your campus center coordinates
  // const CAMPUS_LON_CENTER = 125.597184;
  const [hasUserMovedManually, setHasUserMovedManually] = useState(false);
  const [navPath, setNavPath] = useState([]); // stores sequence of waypoint ids
  const navLineRef = useRef(null);
  const location = useLocation();

  const rafRef = useRef();

  const getWaypointPosition = (id) => {
    const wp = wayPoints.find((wp) => wp.id === id);
    return wp ? wp.position : null;
  };

  const interpolatePointsBetween = (start, end, stepDistance = 5) => {
    const dx = end.x - start.x;
    const dz = end.z - start.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    const numSteps = Math.floor(distance / stepDistance);
    const result = [start];

    for (let i = 1; i < numSteps; i++) {
      const t = i / numSteps;
      const x = start.x + dx * t;
      const z = start.z + dz * t;
      result.push({ x, y: start.y, z });
    }

    return result;
  };

  const getDistance = (a, b) => {
    const dx = a.x - b.x;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dz * dz);
  };

  const findClosestWaypointId = (currentPosition) => {
    if (!currentPosition) return null;

    let closestId = null;
    let minDistance = Infinity;

    wayPoints.forEach((wp) => {
      const distance = getDistance(wp.position, currentPosition);
      if (distance < minDistance) {
        minDistance = distance;
        closestId = wp.id;
      }
    });

    return closestId;
  };

  const findClosestWaypointIndex = (path, currentPosition) => {
    if (!currentPosition || !path.length) return 0;

    let closestIndex = 0;
    let minDistance = Infinity;

    path.forEach((id, index) => {
      const pos = getWaypointPosition(id);
      if (pos) {
        const distance = getDistance(pos, currentPosition);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      }
    });

    return closestIndex;
  };

  const findPath = (startId, endId) => {
    const queue = [[startId]];
    const visited = new Set();

    while (queue.length > 0) {
      const path = queue.shift();
      const node = path[path.length - 1];

      if (node === endId) {
        return path;
      }

      if (!visited.has(node)) {
        visited.add(node);
        const neighbors = graph[node] || [];
        neighbors.forEach((neighbor) => {
          queue.push([...path, neighbor]);
        });
      }
    }

    return null; // No path found
  };

  const handleNavigateTo = (destinationId) => {
    const currentPos = cameraPosition; // Already being tracked in state
    const startId = findClosestWaypointId(currentPos);

    if (!startId) {
      console.warn("No closest waypoint found for current position.");
      return;
    }

    const path = findPath(startId, destinationId);
    if (path) {
      console.log("Navigation path:", path);
      setNavPath(path);
    } else {
      console.warn("No path found from", startId, "to", destinationId);
    }
  };

  if (AFRAME) {
    delete AFRAME.systems["arjs"];
    delete AFRAME.components["arjs"];
    delete AFRAME.components["arjs-camera"];
    delete AFRAME.components["marker"];
    delete AFRAME.components["gps-camera"];
    delete AFRAME.components["location-based"];
  }

  useEffect(() => {
    // Campus boundary definition (example coordinates - adjust to your campus)
    const campusBounds = {
      latMin: 8.952524,
      latMax: 8.959551,
      lonMin: 125.595328,
      lonMax: 125.598868,
    };

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });

          // Check if within campus bounds
          const onCampus =
            latitude > campusBounds.latMin &&
            latitude < campusBounds.latMax &&
            longitude > campusBounds.lonMin &&
            longitude < campusBounds.lonMax;

          setIsOnCampus(onCampus);

          if (onCampus) {
            console.log("User location:", { lat: latitude, lon: longitude });
            console.log("Is on campus:", onCampus);
          } else {
            console.log("User is outside campus bounds.");
          }
        },
        (error) => console.error("Geolocation error:", error),
        { enableHighAccuracy: true, maximumAge: 1000 }
      );
    }
  }, []);

  const gpsTo3DPosition = (lat, lon) => {
    // Convert lat/lon to meters using Web Mercator projection
    const earthCircumference = 40075016; // meters
    const latOffset = (lat - CAMPUS_LAT_CENTER) * (earthCircumference / 360);
    const lonOffset =
      (lon - CAMPUS_LON_CENTER) *
      (earthCircumference / 360) *
      Math.cos((CAMPUS_LAT_CENTER * Math.PI) / 180);

    return {
      x: -latOffset, // Adjust axis based on model orientation
      y: 1.9, // Eye-level height
      z: -lonOffset,
    };
  };

  // Fetch events from Supabase and filter by date
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("events") // Replace 'events' with your table name
          .select("id, title, x_coordinate, y_coordinate, event_date"); // Include event_date

        if (error) throw error;

        // Get the current date
        const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

        // Filter events where event_date is greater than or equal to today
        const upcomingEvents = data.filter(
          (event) => event.event_date >= currentDate
        );

        setEvents(upcomingEvents); // Set only upcoming events in state
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Remove AR.js system if it's globally registered
    if (AFRAME && AFRAME.systems["arjs"]) {
      delete AFRAME.systems["arjs"];
    }

    // Optional: Override arjs-camera if needed
    if (AFRAME.components["arjs-camera"]) {
      delete AFRAME.components["arjs-camera"];
    }
  }, []);

  const cameraRigRef = useRef(null);
  const joystickRef = useRef(null);
  const modelRef = useRef(null);

  // Define dome radius and center coordinates
  const domeRadiusX = isAerialView ? 2610 : 2610;
  const domeRadiusZ = isAerialView ? 1150 : 1150;

  Restrict(
    cameraRigRef,
    joystickRef,
    domeRadiusX,
    domeRadiusZ,
    setHasUserMovedManually
  );

  useEffect(() => {
    if (!userLocation || !cameraRigRef.current || hasUserMovedManually) return;

    const cameraObject = cameraRigRef.current.object3D;
    let animationFrameId;

    const targetPosition = isOnCampus
      ? gpsTo3DPosition(userLocation.lat, userLocation.lon)
      : { x: -373.75469, y: 1.9, z: 62.06585 };

    const animateMovement = () => {
      const currentPosition = cameraObject.position;
      const lerpFactor = 0.05;

      currentPosition.x += (targetPosition.x - currentPosition.x) * lerpFactor;
      currentPosition.y += (targetPosition.y - currentPosition.y) * lerpFactor;
      currentPosition.z += (targetPosition.z - currentPosition.z) * lerpFactor;

      animationFrameId = requestAnimationFrame(animateMovement);
    };

    const tick = () => {
      const position = cameraRigRef.current.object3D.position;
      setCameraPosition({
        x: position.x,
        y: position.y,
        z: position.z,
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    animateMovement();
    tick();

    return () => cancelAnimationFrame(animationFrameId, rafRef.current);
  }, [userLocation, isOnCampus, hasUserMovedManually]);

  useEffect(() => {
    if (cameraRigRef.current) {
      const scene = document.querySelector("a-scene");
      if (!scene) return;

      // Listen for the scene's loaded event
      scene.addEventListener("loaded", () => {
        console.log("Scene loaded");

        if (location.state?.selectedBuilding) {
          handleNavigateTo(location.state.selectedBuilding);
        }

        // Temporarily disable look-controls
        cameraRigRef.current.setAttribute("look-controls", "enabled", false);

        // Set the initial position of the camera
        // const initialPosition = { x: 0, y: 2, z: 0 };
        // const initialPosition = { x: -2260, y: 2, z: -100 };
        const initialPosition = { x: -373.75469, y: 1.9, z: 62.06585 };
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
          cameraRigRef.current.setAttribute("look-controls", "enabled", true);

          const lookControlsComponent =
            cameraRigRef.current.components["look-controls"];
          if (lookControlsComponent) {
            lookControlsComponent.pitchObject.rotation.x =
              THREE.MathUtils.degToRad(initialRotation.pitch);
            lookControlsComponent.yawObject.rotation.y =
              THREE.MathUtils.degToRad(initialRotation.yaw);
          }
        }, 100);

        // Listen for position changes
        const updatePosition = () => {
          const position = cameraRigRef.current.object3D.position;
          setCameraPosition({ x: position.x, y: position.y, z: position.z });
        };

        cameraRigRef.current.addEventListener("componentchanged", (event) => {
          if (event.detail.name === "position") {
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
          cameraRigRef.current.removeEventListener(
            "componentchanged",
            updatePosition
          );
        };
      });
    }

    // Listen for the model's loaded event
    if (modelRef.current) {
      const modelEntity = modelRef.current;

      const handleModelLoaded = () => {
        console.log("Model loaded");
        setIsLoading(false); // Hide loading screen when the model is loaded
      };

      modelEntity.addEventListener("model-loaded", handleModelLoaded);

      // Fallback timeout in case the model fails to load
      const timeoutId = setTimeout(() => {
        console.warn("Model loading timed out");
        setIsLoading(false);
      }, 60000);

      return () => {
        modelEntity.removeEventListener("model-loaded", handleModelLoaded);
        clearTimeout(timeoutId);
      };
    }
  }, [location.state]);

  const toggleView = () => {
    if (cameraRigRef.current) {
      const currentPosition = cameraRigRef.current.object3D.position;
      setCameraPosition({
        x: currentPosition.x,
        y: isAerialView ? 1.9 : 40,
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
      camera.position.set(-373.75469, 1.9, 62.06585);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center relative">
      {/* Loading Screen */}
      {isLoading ? (
        <div className="absolute inset-0 bg-primGreen flex flex-col items-center justify-center z-50">
          <div className="flex text-white text-md">
            Loading 3D Map...
            <BsPersonWalking
              className="animate-walking text-white pb-1"
              size={24}
            />
          </div>
        </div>
      ) : (
        <div>
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="absolute top-14 left-6 p-4 rounded-full shadow-slate-800 shadow-md flex bg-white z-50"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          {/* <div className="absolute flex flex-col top-36 left-0 bg-black bg-opacity-40 p-2 rounded-md shadow-md z-50">
            <button onClick={() => handleNavigateTo('ced')} className="p-2 m-1 bg-blue-500 bg-opacity-80 text-white rounded">Go to CED</button>
            <button onClick={() => handleNavigateTo('caa')} className="p-2 m-1 bg-blue-500 bg-opacity-80 text-white rounded">Go to CAA</button>
            <button onClick={() => handleNavigateTo('ftc')} className="p-2 m-1 bg-blue-500 bg-opacity-80 text-white rounded">Go to FTC</button>
            <button onClick={() => handleNavigateTo('harrison-bridge')} className="p-2 m-1 bg-blue-500 bg-opacity-80 text-white rounded">Go to Harrison Bridge</button>
            <button onClick={() => handleNavigateTo('harrison-crossroad')} className="p-2 m-1 bg-blue-500 bg-opacity-80 text-white rounded">Go to Harrison Crossroad</button>
          </div> */}

          {/* Top-Right Menu */}
          <div className="absolute flex flex-col top-14 right-6 shadow-slate-800 shadow-lg z-50 rounded-xl">
            {/* <button onClick={handleBack} className="bg-white p-4 rounded-t-xl border-b text-lg">
              <IoInformation />
            </button> */}
            <button
              onClick={toggleView}
              className="bg-white p-4  rounded-t-xl border-b text-lg"
            >
              {isAerialView ? <BsPersonWalking /> : <IoEyeOutline />}
            </button>
            <button
              onClick={handleGate}
              className="bg-white p-4 rounded-b-xl text-lg"
            >
              <GiOpenGate />
            </button>
          </div>

          {/* Bottom Navigation Bar */}
          <div className="">
            <SearchMenu
              onBuildingSelect={(building) => {
                // if (cameraRigRef.current) {
                //   const camera = cameraRigRef.current.object3D;
                //   camera.position.set(building.xCoord, building.yCoord, building.zCoord);
                //   setCameraPosition({ x: building.xCoord, y: building.yCoord, z: building.zCoord });
                // }
                handleNavigateTo(building.waypointId);
              }}
            />
          </div>

          {/* <div className="absolute bottom-20 left-6 bg-white p-2 rounded-md shadow-md z-50">
            <p className="text-sm font-mono">
              X: {cameraPosition.x}, Y: {cameraPosition.y}, Z:{" "}
              {cameraPosition.z}
            </p>
          </div> */}
        </div>
      )}

      {/* A-Frame Scene */}
      <a-scene>
        {/* Conditional AR Setup */}
        {isOnCampus && (
          <a-entity
            gps-camera="minAccuracy: 100"
            arjs="sourceType: webcam; debugUIEnabled: false"
          ></a-entity>
        )}
        {navPath.length > 1 && (
          <a-entity ref={navLineRef}>
            {(() => {
              const linePoints = navPath.map((id) => getWaypointPosition(id));
              if (!linePoints.every(Boolean)) return null;

              // Find the closest waypoint index to current camera position
              const currentIndex = findClosestWaypointIndex(
                navPath,
                cameraPosition
              );
              const visiblePath = linePoints.slice(currentIndex);

              let allArrowPositions = [];
              for (let i = 0; i < visiblePath.length - 1; i++) {
                const start = visiblePath[i];
                const end = visiblePath[i + 1];
                const segmentPoints = interpolatePointsBetween(start, end, 2); // adjust step as needed
                allArrowPositions = allArrowPositions.concat(segmentPoints);
              }
              allArrowPositions.pop();

              // Calculate overall direction from first to last point in visible path
              const firstPoint = visiblePath[0];
              const lastPoint = visiblePath[visiblePath.length - 1];
              const dxOverall = lastPoint.x - firstPoint.x;
              const dzOverall = lastPoint.z - firstPoint.z;
              const angleOverall = Math.atan2(dzOverall, dxOverall);
              const yawOverall = THREE.MathUtils.radToDeg(-angleOverall) - 90;
              const destinationPos = linePoints[linePoints.length - 1];

              return (
                <>
                  {allArrowPositions.map((pos, index) => {
                    // For each arrow, use the overall direction instead of local segment direction
                    return (
                      <a-entity
                        key={`${pos.x}-${pos.z}-${index}`}
                        position={`${pos.x} ${pos.y + 1} ${pos.z}`} // Slightly above ground
                        rotation={`0 ${yawOverall} 0`} // Use overall direction
                        scale=".8 .8 .8" // Adjust size as needed
                      >
                        <a-entity
                          gltf-model="url(/assets/triangle.glb)"
                          material="color: blue"
                          shadow="cast: false"
                          animation="property: position; to: 0 0 1; dir: alternate; dur: 1000; easing: easeInOutSine; loop: true"
                        ></a-entity>
                      </a-entity>
                    );
                  })}
                  {destinationPos && (
                    <a-entity
                      position={`${destinationPos.x + 1.5} 4 ${
                        destinationPos.z
                      }`}
                    >
                      <a-entity animation="property: position; to: 0 1 0; dir: alternate; dur: 1000; easing: easeInOutSine; loop: true">
                        <a-entity
                          obj-model="obj: url(/assets/pinpoint.obj)"
                          material="color: red; shader: standard; roughness: 0.5; metalness: 0.2"
                          scale="1 1 1"
                          look-at="#camera-rig"
                        ></a-entity>
                      </a-entity>
                    </a-entity>
                  )}
                </>
              );
            })()}
          </a-entity>
        )}

        <a-entity>
          <a-camera
            id="camera-rig"
            position={`${cameraPosition.x} ${isAerialView ? 40 : 1.9} ${
              cameraPosition.z
            }`}
            // animation__position={`property: position; to: ${cameraPosition.x} ${isAerialView ? 200 : 2} ${cameraPosition.z}; dur: 1000; easing: easeInOutQuad`}
            look-controls={isOnCampus ? "enabled: false" : "enabled: true"}
            ref={cameraRigRef}
          ></a-camera>
        </a-entity>

        {/* Joystick */}
        {!isOnCampus && (
          <a-entity
            ref={joystickRef}
            position="0 0 0"
            style={{
              position: "absolute",
              bottom: "25%",
              left: "50%",
              transform: "translateX(10%)",
              width: "200px",
              height: "200px",
              zIndex: 1,
            }}
          ></a-entity>
        )}

        {/* Ground Plane */}
        <a-plane
          scale="2.85 3.5 2.82"
          position="0 0 0"
          rotation="-90 191 0"
          width="270"
          height="120"
          repeat="1 1"
          shadow="receive: true"
          material="src: url(/assets/csu-ss.png)"
        ></a-plane>

        {/* 3D Model */}
        <a-entity
          ref={modelRef}
          gltf-model="url(/assets/CSU5 (2).glb)"
          position="10 0 -2"
          // position="55 0 -255"
          rotation="0 -350 0"
          scale="0.43 0.48 0.42"
        ></a-entity>

        <a-entity
          gltf-model="url(/assets/CED.glb)"
          position="-351 0 5"
          rotation="0 -350 0"
          scale="0.43 0.4 0.42"
        ></a-entity>

        <a-entity
          gltf-model="url(/assets/FTC.glb)"
          position="-303 0 75"
          rotation="0 -350 0"
          scale="0.43 0.4 0.42"
        ></a-entity>

        <a-entity
          gltf-model="url(/assets/CMNS-Canteen_and_LSG_Office.glb)"
          position="-265 0 -15"
          rotation="0 -350 0"
          scale="0.43 0.4 0.42"
        ></a-entity>

        <a-entity
          gltf-model="url(/assets/BatokHall.glb)"
          position="-205 0 -34"
          rotation="0 -350 0"
          scale="0.5 0.4 0.49"
        ></a-entity>

        <a-entity
          gltf-model="url(/assets/Motorpoll.glb)"
          position="-135 0 -120"
          rotation="0 -350 0"
          scale="0.33 0.4 0.32"
        ></a-entity>

        <a-entity
          gltf-model="url(/assets/Guidance_and_Registrar.glb)"
          position="1 0 -4"
          rotation="0 -350 0"
          scale="0.38 0.4 0.37"
        ></a-entity>

        <a-entity
          gltf-model="url(/assets/CAA-canteen.glb)"
          position="-330 0 116"
          rotation="0 -350 0"
          scale="0.43 0.4 0.42"
        ></a-entity>

        <a-entity
          gltf-model="url(/assets/CAA.glb)"
          position="-330 0 150"
          rotation="0 -350 0"
          scale="0.43 0.4 0.42"
        ></a-entity>

        <a-entity
          gltf-model="url(/assets/Kinaadman.glb)"
          position="4 0 -12"
          rotation="0 -350 0"
          scale="0.4 0.49 0.39"
        ></a-entity>

        <a-entity
          gltf-model="url(/assets/CAS.glb)"
          position="12 0 5"
          rotation="0 -350 0"
          scale="0.36 0.25 0.35"
        ></a-entity>

        <a-entity
          gltf-model="url(/assets/Hinang.glb)"
          position="8 0 -4"
          rotation="0 -350 0"
          scale="0.43 0.49 0.42"
        ></a-entity>

        {/* Skybox */}
        <a-sky
          src="/assets/clear-sunny-sky.jpg"
          scale="1.7 1 0.8"
          radius="3000"
        ></a-sky>

        {/* Event Markers */}
        {events.map((event) => (
          <a-entity
            key={event.id}
            position={`${event.x_coordinate} 20 ${event.y_coordinate}`}
          >
            <a-entity animation="property: position; to: 0 10 0; dir: alternate; dur: 1000; easing: easeInOutSine; loop: true">
              <a-entity
                obj-model="obj: url(/assets/pinpoint.obj)"
                material="color: red; shader: standard; roughness: 0.5; metalness: 0.2"
                scale="2 2 2"
                look-at="#camera-rig"
              ></a-entity>

              {/* Event Name */}
              <a-text
                value={event.title}
                align="center"
                color="black"
                position="0 15 0"
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
