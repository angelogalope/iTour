import { useEffect } from 'react';
import * as THREE from 'three';
import nipplejs from 'nipplejs';

const Restrict = (cameraRigRef, joystickRef, domeRadiusX, domeRadiusZ, setHasUserMovedManually) => {
  // Store state outside useEffect
  const movement = {
    active: false,
    angleRad: 0,
    distance: 0,
    cameraRotationY: 0,
    intervalId: null,
  };

  useEffect(() => {
    if (!cameraRigRef.current || !joystickRef.current) return;

    const camera = cameraRigRef.current.object3D;
    const sensitivity = 0.2; // Adjust this to control base movement speed
    const moveInterval = 16; // ~60fps in ms

    const joystick = nipplejs.create({
      zone: joystickRef.current,
      mode: 'static',
      position: { left: '-10%', bottom: '30%' },
      color: 'white'
    });

    // Update stored joystick state on move
    joystick.on('move', (event, data) => {
      setHasUserMovedManually(true);
      movement.angleRad = (data.angle.degree * Math.PI) / 180;
      movement.distance = data.distance;
      movement.cameraRotationY = camera.rotation.y;
      movement.active = true;
    });

    // Stop movement when joystick is released
    joystick.on('end', () => {
      movement.active = false;
      movement.distance = 0;
    });

    // Start movement loop when joystick is held
    const startMovementLoop = () => {
      if (movement.intervalId) return;

      movement.intervalId = setInterval(() => {
        if (!movement.active || movement.distance === 0) return;

        const camera = cameraRigRef.current?.object3D;
        if (!camera) return;

        const moveDistance = (movement.distance / 50) * sensitivity;

        const dx = moveDistance * Math.cos(movement.angleRad + movement.cameraRotationY);
        const dz = moveDistance * Math.sin(movement.angleRad + movement.cameraRotationY);

        const newPosition = camera.position.clone().add(new THREE.Vector3(dx, 0, -dz));

        const clampedX = Math.max(-domeRadiusX, Math.min(domeRadiusX, newPosition.x));
        const clampedZ = Math.max(-domeRadiusZ, Math.min(domeRadiusZ, newPosition.z));

        camera.position.set(clampedX, camera.position.y, clampedZ);
      }, moveInterval);
    };

    joystick.on('start', () => {
      startMovementLoop();
    });

    // Cleanup on unmount or joystick destroy
    return () => {
      if (movement.intervalId) {
        clearInterval(movement.intervalId);
        movement.intervalId = null;
      }
      joystick.destroy();
    };
  }, [cameraRigRef, joystickRef, domeRadiusX, domeRadiusZ, setHasUserMovedManually]);
};

export default Restrict;