// Restricts the camera movement to within a dome shape.

import { useEffect } from 'react';
import * as THREE from 'three';
import nipplejs from 'nipplejs';

const Restrict = (cameraRigRef, joystickRef, domeRadiusX, domeRadiusZ) => {
  
  useEffect(() => {
    if (cameraRigRef.current && joystickRef.current) {
      const joystick = nipplejs.create({
        zone: joystickRef.current,
        mode: 'static',
        position: { left: '-10%', bottom: '50%' },
        color: 'white'
      });

      // Dome center at (0, 0, 0) and defined radius
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

        // enforce elliptical boundary
        const clampedX = Math.max(-domeRadiusX, Math.min(domeRadiusX, newPosition.x));
        const clampedZ = Math.max(-domeRadiusZ, Math.min(domeRadiusZ, newPosition.z));

        // apply clamped position
        camera.position.set(clampedX, camera.position.y, clampedZ);
      });

      joystick.on('end', () => {
      });
    }
  }, [cameraRigRef, joystickRef, domeRadiusX, domeRadiusZ]);
};

export default Restrict;