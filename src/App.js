import './App.css';
import { memo } from 'react'

const App = memo(() => {

  return (
    <div>
      <a-scene>
        <a-entity id="orbitcam" camera="active: true; fov: 30; zoom: 1" look-controls="enabled: false;" orbit-controls="target: 0 -1000 0; minDistance: 0.5; maxDistance: 15; initialPosition: 0 -1000 -5; enableKeys: true;"></a-entity>
        <a-sphere position="0 -1000 0" rotation="-90 -90 0" radius="1.25" color="#EF2D5E" chrome-material="src:#camera" phi-length="90"></a-sphere>
        <a-sphere position="0 -1000 0" radius="10" material="color: #000; side: double; shader: flat"></a-sphere>
        <a-entity position="0 0.2 0" id="camera"></a-entity>
        <a-videosphere visible="true" id="wowvideo" src="url(./video.mp4)" autoplay="false" loop="false" rotation="0 -90 0"></a-videosphere>
        {/* <a-entity id="environment" environment="preset: starry"></a-entity> */}
        <a-sky id="calibrate" visible="false" color="white" material="wireframe: true;"></a-sky>
        <a-entity scene-controller></a-entity>
      </a-scene>
    </div>
  );
})

export default App;