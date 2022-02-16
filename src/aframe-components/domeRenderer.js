const VERTEX_SHADER = [
    'attribute vec3 position;',
    'attribute vec2 uv;',
    'uniform mat4 projectionMatrix;',
    'uniform mat4 modelViewMatrix;',
    'varying vec2 vUv;',
    'void main()  {',
    '  vUv = vec2( 1.- uv.x, uv.y );',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
    '}'
].join('\n');
  
const FRAGMENT_SHADER = [
    'precision mediump float;',
    'uniform samplerCube map;',
    'varying vec2 vUv;',
    '#define M_PI 3.141592653589793238462643383279',
    'void main() {',
    '  vec2 uv = vUv;',
    '  float longitude = uv.x * 2. * M_PI - M_PI + M_PI / 2.;',
    '  float latitude = uv.y * M_PI;',
    '  vec3 dir = vec3(',
    '    - sin( longitude ) * sin( latitude ),',
    '    cos( latitude ),',
    '    - cos( longitude ) * sin( latitude )',
    '  );',
    '  normalize( dir );',
    '  gl_FragColor = vec4( textureCube( map, dir ).rgb, 1.0 );',
    '}'
].join('\n');
  
/**
 * Component to take screenshots of the scene using a keboard shortcut (alt+s).
 * It can be configured to either take 360&deg; captures (`equirectangular`)
 * or regular screenshots ()
 *
 * This is based on https://github.com/spite/window.THREE.CubemapToEquirectangular
 * To capture an equirectangula of the scene a window.THREE.CubeCamera is used
 * The cube map produced by the CubeCamera is projected on a quad and then rendered to
 * WebGLRenderTarget with an ortographic camera.
 */
 window.AFRAME.registerComponent('dome-renderer', {
    schema: {
        width: {default: 4096},
        height: {default: 2048},
        camera: {type: 'selector'},
        cid: {type: 'selector'}
    },

    init: function () {
        var el = this.el;
        var self = this;

        self.canvas = this.data.cid;
        self.ctx = self.canvas.getContext('2d');
        self.canvas.width = 4096;
        self.canvas.height = 2048;

        // Create renderer
        this.renderer = new window.THREE.WebGLRenderer({
            antialias: true,
            canvas: window.THREE.OffscreenCanvas,
        });

        // Set properties for renderer DOM element
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.domElement.crossorigin = "anonymous";

         // Create renderer
         this.renderer2 = new window.THREE.WebGLRenderer({
            antialias: true,
            canvas: window.THREE.OffscreenCanvas,
        });

        // Set properties for renderer DOM element
        this.renderer2.setPixelRatio( window.devicePixelRatio );
        this.renderer2.domElement.crossorigin = "anonymous";

        self.scene = new window.THREE.Scene();

        var gl = this.renderer.getContext();
        if (!gl) { return; }
        self.cubeMapSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
        self.material = new window.THREE.RawShaderMaterial({
            uniforms: {map: {type: 't', value: null}},
            vertexShader: VERTEX_SHADER,
            fragmentShader: FRAGMENT_SHADER,
            side: window.THREE.DoubleSide
        });
        self.quad = new window.THREE.Mesh(
            new window.THREE.PlaneBufferGeometry(1, 1),
            self.material
        );
        self.camera = new window.THREE.OrthographicCamera(-1 / 2, 1 / 2, 1 / 2, -1 / 2, -10000, 10000);
        self.scene.add(self.quad);

        this.tick = window.AFRAME.utils.throttleTick(this.tick, 1000 / 90 , this);
    },

    'tick': function(time, timeDelta) {
        var params = this.setCapture();
        this.renderCapture(params.camera, params.size);
    },

    getRenderTarget: function (width, height) {
        return new window.THREE.WebGLRenderTarget(width, height, {
            encoding: window.THREE.sRGBEncoding,
            minFilter: window.THREE.LinearFilter,
            magFilter: window.THREE.LinearFilter,
            wrapS: window.THREE.ClampToEdgeWrapping,
            wrapT: window.THREE.ClampToEdgeWrapping,
            format: window.THREE.RGBAFormat,
            type: window.THREE.UnsignedByteType
        });
    },

    resize: function (width, height) {
        // Resize quad.
        this.quad.scale.set(width, height, 1);

        // Resize camera.
        this.camera.left = -1 * width / 2;
        this.camera.right = width / 2;
        this.camera.top = height / 2;
        this.camera.bottom = -1 * height / 2;
        this.camera.updateProjectionMatrix();

        // Resize canvas.
        this.canvas.width = width;
        this.canvas.height = height;
    },

    /**
     * Capture a screenshot of the scene.
     */
    setCapture: function () {
        var el = this.el;
        var size;
        var camera;
        var cubeCamera;
        var cubeRenderTarget;

        // Use ortho camera.
        camera = this.camera;
        cubeRenderTarget = new window.THREE.WebGLCubeRenderTarget(
            Math.min(this.cubeMapSize, 2048),
            {
                format: window.THREE.RGBFormat,
                generateMipmaps: true,
                minFilter: window.THREE.LinearMipmapLinearFilter,
                encoding: window.THREE.sRGBEncoding
            }
        );

        // Create cube camera and copy position from scene camera.
        cubeCamera = new window.THREE.CubeCamera(el.sceneEl.camera.near, el.sceneEl.camera.far, cubeRenderTarget);
        // Copy camera position into cube camera;
        el.sceneEl.camera.getWorldPosition(cubeCamera.position);
        el.sceneEl.camera.getWorldQuaternion(cubeCamera.quaternion);
        // Render scene with cube camera.
        cubeCamera.update(this.renderer, el.sceneEl.object3D);
        this.quad.material.uniforms.map.value = cubeCamera.renderTarget.texture;
        size = {width: 4096, height: 2048};

        return {
            camera: camera,
            size: size,
        };
    },

    /**
     * Return canvas instead of triggering download (e.g., for uploading blob to server).
     */
    getCanvas: function () {
        var params = this.setCapture();
        this.renderCapture(params.camera, params.size);
        return this.canvas;
    },

    renderCapture: function (camera, size) {
        var autoClear = this.renderer.autoClear;
        var el = this.el;
        var imageData;
        var output;
        var pixels;
        var scene = this.scene;
        var renderer = this.renderer2;
        // Create rendering target and buffer to store the read pixels.
        output = this.getRenderTarget(size.width, size.height);
        pixels = new Uint8Array(4 * size.width * size.height);
        // Resize quad, camera, and canvas.
        this.resize(size.width, size.height);
        // Render scene to render target.
        renderer.autoClear = true;
        renderer.clear();
        renderer.setRenderTarget(output);
        renderer.render(scene, camera);
        renderer.autoClear = autoClear;
        // Read image pizels back.
        renderer.readRenderTargetPixels(output, 0, 0, size.width, size.height, pixels);
        renderer.setRenderTarget(null);
        imageData = new ImageData(new Uint8ClampedArray(pixels), size.width, size.height);
        // Hide quad after projecting the image.
        this.quad.visible = false;
        // Copy pixels into canvas.
        this.ctx.putImageData(imageData, 0, 0);
    },

});