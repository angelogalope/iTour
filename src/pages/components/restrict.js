import 'aframe';

AFRAME.registerComponent('restrict-movement', {
  init: function () {
    const maxRadius = 600;  // Define the maximum radius of movement

    this.el.addEventListener('componentchanged', (evt) => {
      if (evt.detail.name !== 'position') return;

      const position = this.el.getAttribute('position');
      const distanceFromCenter = Math.sqrt(position.x * position.x + position.z * position.z);

      console

      // Check if the camera is outside the allowed radius
      if (distanceFromCenter > maxRadius) {
        const scale = maxRadius / distanceFromCenter;
        position.x *= scale;
        position.z *= scale;
        this.el.setAttribute('position', position);
      }
    });
  },
});

export default {};  
