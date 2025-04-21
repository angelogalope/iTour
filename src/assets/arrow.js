if (typeof AFRAME !== 'undefined') {
  // Register a custom A-Frame component for our navigation arrow
  AFRAME.registerComponent('navigation-arrow', {
    schema: {
      color: { type: 'color', default: '#0066ff' },
      size: { type: 'number', default: 1 },
      pulse: { type: 'boolean', default: true },
      bearing: { type: 'number', default: 0 }
    },

    init: function() {
      this.createArrow();
      
      if (this.data.pulse) {
        this.setupPulseAnimation();
      }
      
      // Apply initial rotation
      this.updateRotation();
    },

    update: function(oldData) {
      // Update rotation if bearing has changed
      if (oldData.bearing !== this.data.bearing) {
        this.updateRotation();
      }
    },
    
    updateRotation: function() {
      // Update the arrow's rotation - rotate only on the Y axis like a compass
      // We're using a negative bearing because in A-Frame, positive Y rotation is clockwise
      // while compass bearings are measured clockwise from north
      const rotationY = -THREE.MathUtils.degToRad(this.data.bearing);
      this.el.object3D.rotation.set(0, rotationY, 0);
      console.log("Arrow rotation updated to:", this.data.bearing, "degrees");
    },

    createArrow: function() {
      const data = this.data;
      const el = this.el;
      
      // Create a model entity for the car arrow
      const arrowModel = document.createElement('a-entity');
      arrowModel.setAttribute('gltf-model', 'src/assets/triangle.glb');
      arrowModel.setAttribute('scale', `${data.size} ${data.size} ${data.size}`);
      arrowModel.setAttribute('id', 'arrow-shape');
      
      // Add model to the component entity
      el.appendChild(arrowModel);
    },
    
    setupPulseAnimation: function() {
      // Create subtle pulse animation to make arrow more noticeable
      const arrowShape = this.el.querySelector('#arrow-shape');
      
      // Use AFRAME animation system
      const pulseAnimation = document.createElement('a-animation');
      pulseAnimation.setAttribute('attribute', 'scale');
      pulseAnimation.setAttribute('direction', 'alternate');
      pulseAnimation.setAttribute('dur', '1500');
      pulseAnimation.setAttribute('repeat', 'indefinite');
      pulseAnimation.setAttribute('to', '1.1 1.1 1.1');
      pulseAnimation.setAttribute('from', '0.95 0.95 0.95');
      pulseAnimation.setAttribute('easing', 'ease-in-out');
      
      arrowShape.appendChild(pulseAnimation);
    }
  });
}
