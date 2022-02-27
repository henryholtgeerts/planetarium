import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'aframe';
import 'aframe-environment-component';
import './aframe-components/domeRenderer';
import './aframe-components/chromeMaterial';
import 'aframe-orbit-controls';

window.AFRAME.registerComponent('scene-controller', {
  init: function () {
    window.addEventListener('keydown', function(evt) {
      switch ( evt.key ) {
        case 'c': {
          document.querySelector("#calibrate").setAttribute('visible', 'true');
          break;
        }
        case 'v': {
          document.querySelector("#calibrate").setAttribute('visible', 'false');
          break;
        }
        case '1': {
          document.querySelector("#wowvideo").setAttribute('visible', 'true');
          document.querySelector("#wowvideo").components.material.material.map.image.play();
          document.querySelector("#environment").setAttribute('visible', 'false');
          break;
        }
        case '2': {
          document.querySelector("#wowvideo").setAttribute('visible', 'false');
          document.querySelector("#environment").setAttribute('visible', 'true');
          document.querySelector("#environment").setAttribute('environment', {preset: 'starry'});
          break;
        }
        case '2': {
          document.querySelector("#wowvideo").setAttribute('visible', 'false');
          document.querySelector("#environment").setAttribute('visible', 'true');
          document.querySelector("#environment").setAttribute('environment', {preset: 'arches'});
          break;
        }
        case '3': {
          document.querySelector("#wowvideo").setAttribute('visible', 'false');
          document.querySelector("#environment").setAttribute('visible', 'true');
          document.querySelector("#environment").setAttribute('environment', {preset: 'moon'});
          break;
        }
        case '4': {
          document.querySelector("#wowvideo").setAttribute('visible', 'false');
          document.querySelector("#environment").setAttribute('visible', 'true');
          document.querySelector("#environment").setAttribute('environment', {preset: 'egypt'});
          break;
        }
        case '5': {
          document.querySelector("#wowvideo").setAttribute('visible', 'false');
          document.querySelector("#environment").setAttribute('visible', 'true');
          document.querySelector("#environment").setAttribute('environment', {preset: 'forest'});
          break;
        }
        case '6': {
          document.querySelector("#wowvideo").setAttribute('visible', 'false');
          document.querySelector("#environment").setAttribute('visible', 'true');
          document.querySelector("#environment").setAttribute('environment', {preset: 'default'});
          break;
        }
      }
    })
  }
})

window.AFRAME.registerComponent('camrender',{
  'schema': {
     // desired FPS
     fps: {
          type: 'number',
          default: 90.0
     },
     // Id of the canvas element used for rendering the camera
     cid: {
          type: 'string',
          default: 'camRenderer'
     },
     // Height of the renderer element
     height: {
          type: 'number',
          default: 600,
     },
     // Width of the renderer element
     width: {
          type: 'number',
          default: 800,
     }
  },
  'update': function(oldData) {
      var data = this.data
      if (oldData.cid !== data.cid) {
          // Find canvas element to be used for rendering
          var canvasEl = document.getElementById(this.data.cid);
          // Create renderer
          this.renderer = new window.THREE.WebGLRenderer({
              antialias: true,
              canvas: canvasEl
          });
          // Set properties for renderer DOM element
          this.renderer.setPixelRatio( window.devicePixelRatio );
          this.renderer.domElement.crossorigin = "anonymous";
      };
      if (oldData.width !== data.width || oldData.height !== data.height) {
          // Set size of canvas renderer
          this.renderer.setSize(data.width/2, data.height/2);
          this.renderer.domElement.height = data.height;
          this.renderer.domElement.width = data.width;
      };
      if (oldData.fps !== data.fps) {
          // Set how often to call tick
          this.tick = window.AFRAME.utils.throttleTick(this.tick, 1000 / data.fps , this);
      };
  },
  'tick': function(time, timeDelta) {
      this.renderer.render( this.el.sceneEl.object3D , this.el.object3DMap.camera );
  }
});

window.AFRAME.registerComponent('scenerender',{
    'schema': {
     // desired FPS
     fps: {
          type: 'number',
          default: 90.0
     },
     // Id of the canvas element used for rendering the camera
     cid: {
          type: 'string',
          default: 'camRenderer'
     },
    },
    'update': function(oldData) {
      var data = this.data
      if (oldData.cid !== data.cid) {
        this.renderCanvas = document.getElementById(this.data.cid);
        this.renderCanvas.width = 4096;
        this.renderCanvas.height = 2048;
      };
      if (oldData.fps !== data.fps) {
          //Set how often to call tick
          this.tick = window.AFRAME.utils.throttleTick(this.tick, 1000 / data.fps , this);
      };
    },
    'tick': function(time, timeDelta) {
      const render = this.el.components.screenshot.getCanvas();
      this.renderCanvas.getContext('2d').drawImage(render, 0, 0);
    }
});

window.AFRAME.registerComponent('canvas-updater', {
  dependencies: ['geometry', 'material'],

  tick: function () {
      var el = this.el;
      var material;

      material = el.getObject3D('mesh').material;
      if (!material.map) { return; }
      material.map.needsUpdate = true;
  }
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
