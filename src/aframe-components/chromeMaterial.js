window.AFRAME.registerComponent('chrome-material', {
    schema: {
       src: {type: 'selector'}
    },

    update: function () {

        const cubeRenderTarget = new window.THREE.WebGLCubeRenderTarget( 512, { generateMipmaps: true, minFilter: window.THREE.LinearMipmapLinearFilter } );

        // Create cube camera
        this.cubeCamera = new window.THREE.CubeCamera( 0.1, 5000, cubeRenderTarget );
        this.el.sceneEl.object3D.add( this.cubeCamera );

        this.chromeMaterial = new window.THREE.MeshBasicMaterial( { color: 0xffffff, envMap: cubeRenderTarget.texture } );

        var mirrormat = this.chromeMaterial;
          this.mesh = this.el.getObject3D('mesh');
          if(this.mesh){
            this.mesh.traverse( function( child ) { 
                if ( child instanceof window.THREE.Mesh ) child.material = mirrormat;
            });
        }
    },

    tick: function(time, timeDelta) {
        this.data.src.object3D.visible = false;
        this.cubeCamera.position.copy( this.data.src.object3D.position );
        this.cubeCamera.update( this.el.sceneEl.renderer, this.el.sceneEl.object3D );

        // Render the scene
        this.data.src.object3D.visible = true;
    },

});