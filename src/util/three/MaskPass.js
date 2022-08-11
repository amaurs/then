import * as THREE from 'three';
import { Pass, FullScreenQuad } from "three/examples/jsm/postprocessing/Pass.js";
import { glitchShader } from './shaders';


class MaskPass extends Pass {

    constructor( dt_size = 64 , width, height, imageWidth, imageHeight, predictions ) {

        super();
        const shader = glitchShader(width, height, imageWidth, imageHeight, predictions);
        this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );
        this.uniforms[ 'tDisp' ].value = this.generateHeightmap( dt_size );
        this.material = new THREE.ShaderMaterial( {
            uniforms: this.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader
        } );
        this.fsQuad = new FullScreenQuad( this.material );
        this.goWild = false;
        this.curF = 0;
        this.generateTrigger();
    }

    render( renderer, writeBuffer, readBuffer
        /*, deltaTime, maskActive */
    ) {

        this.uniforms[ 'tDiffuse' ].value = readBuffer.texture;
        this.uniforms[ 'seed' ].value = Math.random();//default seeding
        this.uniforms[ 'distortionX' ].value = THREE.MathUtils.randFloat( 0, 1 );
        this.uniforms[ 'distortionY' ].value = THREE.MathUtils.randFloat( 0, 1 );
        this.uniforms[ 'angle' ].value = THREE.MathUtils.randFloat( - Math.PI, Math.PI );
        if (this.curF % this.randX === 0 || this.goWild === true) {
            this.uniforms[ 'offsetAmount' ].value = Math.random() / 10;
            this.uniforms[ 'snowAmount' ].value = Math.random() / 30;
            this.uniforms[ 'seedX' ].value = THREE.MathUtils.randFloat( - 1, 1 );
            this.uniforms[ 'seedY' ].value = THREE.MathUtils.randFloat( - 1, 1 );
            this.curF = 0;
            this.generateTrigger();

        } else {
            this.uniforms[ 'offsetAmount' ].value = Math.random() / 90;
            this.uniforms[ 'snowAmount' ].value = Math.random() / 90;
            this.uniforms[ 'seedX' ].value = THREE.MathUtils.randFloat( - 0.3, 0.3 );
            this.uniforms[ 'seedY' ].value = THREE.MathUtils.randFloat( - 0.3, 0.3 );

        }
        this.curF ++;
        if ( this.renderToScreen ) {

            renderer.setRenderTarget( null );
            this.fsQuad.render( renderer );

        } else {

            renderer.setRenderTarget( writeBuffer );
            if ( this.clear ) renderer.clear();
            this.fsQuad.render( renderer );

        }


    }

    generateTrigger() {

        this.randX = THREE.MathUtils.randInt( 120, 240 );

    }

    generateHeightmap( dt_size ) {

        const data_arr = new Float32Array( dt_size * dt_size );
        const length = dt_size * dt_size;

        for ( let i = 0; i < length; i ++ ) {

            const val = THREE.MathUtils.randFloat( 0, 1 );
            data_arr[ i ] = val;

        }

        const texture = new THREE.DataTexture( data_arr, dt_size, dt_size, THREE.RedFormat, THREE.FloatType );
        texture.needsUpdate = true;
        return texture;

    }    
}


export { MaskPass }