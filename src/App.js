import './App.css';
import { memo } from 'react'

const App = memo(() => {

  return (
    <div>
      <a-scene>
        <a-assets>
          <a-asset-item id="room" src="/room2.glb"></a-asset-item>
        </a-assets>
        <a-entity camera="active: true; fov: 30; zoom: 1" look-controls="enabled: false;" orbit-controls="target: 0 -1000 0; minDistance: 0.5; maxDistance: 15; initialPosition: 0 -1000 -5; enableKeys: false;"></a-entity>
        <a-sphere position="0 -1000 0" rotation="-90 -90 0" radius="1.25" color="#EF2D5E" chrome-material="src:#camera" phi-length="90"></a-sphere>
        <a-sphere position="0 -1000 0" radius="10" material="color: #000; side: double; shader: flat"></a-sphere>
        <a-entity position="0 0.2 0" id="camera" wasd-controls="enabled: true;"></a-entity>
        <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
        <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
        <a-plane position="0 0 -4" rotation="-90 0 0" width="40" height="40" color="#7BC8A4"></a-plane>
        <a-entity gltf-model="#room" position="-1 0.5 -3"></a-entity>
        <a-sphere color="#fff" radius="8" wireframe="true" material="side: double"></a-sphere>
        <a-sky color="#000"></a-sky>
      </a-scene>
    </div>
  );
})

export default App;
