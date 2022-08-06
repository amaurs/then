import {
    ShaderMaterial,
    OrthographicCamera,
    Scene,
    Mesh,
    PlaneBufferGeometry,
    DataTexture,
    FloatType,
    RGBFormat,
    UniformsUtils,
    MathUtils
} from 'three'

import { Pass } from "three/jsm/postprocessing/Pass.js";

import { glitchShader } from '../../shaders'

var GlitchPass = function ( dtSize, width, height, imageWidth, imageHeight, predictions ) {

    Pass.call( this );

    if (glitchShader === undefined) console.error( "GlitchPass relies on DigitalGlitch" );

    var shader = glitchShader(width, height, imageWidth, imageHeight, predictions);

    console.log(shader.fragmentShader);
    this.uniforms = UniformsUtils.clone(shader.uniforms);

    if (dtSize == undefined) dtSize = 64;

    this.uniforms[ "tDisp" ].value = this.generateHeightmap( dtSize );

    this.material = new ShaderMaterial( {
        uniforms: this.uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader
    } );

    this.camera = new OrthographicCamera( - 1 / 2, 1  / 2, 1  / 2, - 1  / 2, 0, 1 );
    this.scene  = new Scene();

    this.quad = new Mesh( new PlaneBufferGeometry( 1, 1 ), null );
    this.quad.frustumCulled = false; // Avoid getting clipped
    this.scene.add( this.quad );

    this.goWild = false;
    this.curF = 0;
    this.generateTrigger();

};

GlitchPass.prototype = Object.assign( Object.create( Pass.prototype ), {

    constructor: GlitchPass,

    render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

        this.uniforms[ 'tDiffuse' ].value = readBuffer.texture;
        this.uniforms[ 'seed' ].value = Math.random();//default seeding
        this.uniforms[ 'distortionX' ].value = MathUtils.randFloat( 0, 1 );
        this.uniforms[ 'distortionY' ].value = MathUtils.randFloat( 0, 1 );
        this.uniforms[ 'angle' ].value = MathUtils.randFloat( - Math.PI, Math.PI );
        if (this.curF % this.randX === 0 || this.goWild === true) {
            this.uniforms[ 'offsetAmount' ].value = Math.random() / 10;
            this.uniforms[ 'snowAmount' ].value = Math.random() / 30;
            this.uniforms[ 'seedX' ].value = MathUtils.randFloat( - 1, 1 );
            this.uniforms[ 'seedY' ].value = MathUtils.randFloat( - 1, 1 );
            this.curF = 0;
            this.generateTrigger();

        } else {
            this.uniforms[ 'offsetAmount' ].value = Math.random() / 90;
            this.uniforms[ 'snowAmount' ].value = Math.random() / 90;
            this.uniforms[ 'seedX' ].value = MathUtils.randFloat( - 0.3, 0.3 );
            this.uniforms[ 'seedY' ].value = MathUtils.randFloat( - 0.3, 0.3 );

        }
        this.curF ++;
        this.quad.material = this.material;

        if (this.renderToScreen) {
            renderer.render(this.scene, this.camera);
        } else {
            renderer.render(this.scene, this.camera, writeBuffer, this.clear);
        }

    },

    generateTrigger: function() {
        this.randX = MathUtils.randInt(120, 240);
    },

    generateHeightmap: function(dtSize) {

        var data_arr = new Float32Array( dtSize * dtSize * 3 );
        var length = dtSize * dtSize;

        for (var i = 0; i < length; i ++) {

            var val = MathUtils.randFloat( 0, 1 );
            data_arr[ i * 3 + 0 ] = val;
            data_arr[ i * 3 + 1 ] = val;
            data_arr[ i * 3 + 2 ] = val;

        }

        var texture = new DataTexture( data_arr, dtSize, dtSize, RGBFormat, FloatType );
        texture.needsUpdate = true;
        return texture;

    }

} );

export { GlitchPass }