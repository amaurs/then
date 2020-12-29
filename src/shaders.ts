import * as THREE from "three-full";

export interface Shader {
    uniforms: object;
    vertexShader: string;
    fragmentShader: string;
}

export const colorMatrixShader = (colorMatrix: Array<number>): Shader => {
    return {
        uniforms: {
            "tDiffuse": { value: null },
            "red": { value: new THREE.Vector4(colorMatrix[0], colorMatrix[5], colorMatrix[10], colorMatrix[15]) },
            "green": { value: new THREE.Vector4(colorMatrix[1], colorMatrix[6], colorMatrix[11], colorMatrix[16]) },
            "blue": { value: new THREE.Vector4(colorMatrix[2], colorMatrix[7], colorMatrix[12], colorMatrix[17]) },
            "alpha": { value: new THREE.Vector4(colorMatrix[3], colorMatrix[8], colorMatrix[13], colorMatrix[18]) },
            "constant": { value: new THREE.Vector4(colorMatrix[4], colorMatrix[9], colorMatrix[14], colorMatrix[19]) }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }`,
        fragmentShader: `
            uniform vec4 red;
            uniform vec4 green;
            uniform vec4 blue;
            uniform vec4 alpha;
            uniform vec4 constant;
            uniform sampler2D tDiffuse;
            varying vec2 vUv;
            
            void main() {
                vec4 texel = texture2D( tDiffuse, vUv );
                float r = red.x * texel.r + green.x * texel.g + blue.x * texel.b + alpha.x * texel.a + constant.x;
                float g = red.y * texel.r + green.y * texel.g + blue.y * texel.b + alpha.y * texel.a + constant.y;
                float b = red.z * texel.r + green.z * texel.g + blue.z * texel.b + alpha.z * texel.a + constant.z;
                float a = red.w * texel.r + green.w * texel.g + blue.w * texel.b + alpha.w * texel.a + constant.w;
                gl_FragColor =  vec4(r, g, b, a);
            }`,
    }
}
