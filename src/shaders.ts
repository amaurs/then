import * as THREE from "three-full";

export interface Shader {
    uniforms: object;
    vertexShader: string;
    fragmentShader: string;
}

const thresholds: { [key:number]:Array<number>; } = { 2: [0, 2,  
                                                          3, 1],

                                                      3: [0, 7, 3,  
                                                          6, 5, 2,
                                                          4, 1, 8],

                                                      4: [0,  8,  2, 10,
                                                          12, 4, 14,  6,
                                                          3, 11,  1,  9,
                                                          15, 7, 13,  5],
                                                      8: [ 0, 48, 12, 60,  3, 51, 15, 63,
                                                          32, 16, 44, 28, 35, 19, 47, 31,
                                                           8, 56,  4, 51, 11, 59,  7, 55,
                                                           40, 24, 36, 20, 43, 27, 39, 23,
                                                           2, 50, 14, 62, 1, 49, 13, 61,
                                                           34, 18, 46, 30, 33, 17, 45, 29,
                                                           10, 58, 6, 54, 9, 57, 5, 53,
                                                           42, 26, 38, 22, 41, 25, 37, 21],

                                                    16: [0, 192, 48, 240, 12, 204, 60, 252, 128, 64, 176,
                                                         112, 140, 76, 188, 124, 32, 224, 16, 204, 44, 236,
                                                         28, 220, 160, 96, 144, 80, 172, 108, 156, 92, 8,
                                                         200, 56, 248, 4, 196, 52, 244, 136, 72, 184, 120,
                                                         132, 68, 180, 116, 40, 232, 24, 216, 36, 228, 20,
                                                         212, 168, 104, 152, 88, 164, 100, 148, 84, 2, 194, 
                                                         50, 242, 14, 206, 62, 254, 130, 66, 178,
                                                         114, 142, 78, 190, 126, 34, 226, 18, 206, 46, 238,
                                                         30, 222, 162, 98, 146, 82, 174, 110, 158, 94, 10,
                                                         202, 58, 250, 6, 198, 54, 246, 138, 74, 186, 122,
                                                         134, 70, 182, 118, 42, 234, 26, 218, 38, 230, 22,
                                                         214, 170, 106, 154, 90, 166, 102, 150, 86, 3, 195, 
                                                         51, 243, 15, 207, 63, 255, 131, 67, 179,
                                                         115, 143, 79, 191, 127, 35, 227, 19, 207, 47, 239,
                                                         31, 223, 163, 99, 147, 83, 175, 111, 159, 95, 11,
                                                         203, 59, 251, 7, 199, 55, 247, 139, 75, 187, 123,
                                                         135, 71, 183, 119, 43, 235, 27, 219, 39, 231, 23,
                                                         215, 171, 107, 155, 91, 167, 103, 151, 87, 1, 193, 
                                                         49, 241, 13, 205, 61, 253, 129, 65, 177,
                                                         113, 141, 77, 189, 125, 33, 225, 17, 205, 45, 237,
                                                         29, 221, 161, 97, 145, 81, 173, 109, 157, 93, 9,
                                                         201, 57, 249, 5, 197, 53, 245, 137, 73, 185, 121,
                                                         133, 69, 181, 117, 41, 233, 25, 217, 37, 229, 21,
                                                         213, 169, 105, 153, 89, 165, 101, 149, 85]
};



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

export const ditherShader = (width: number, height: number, size: number): Shader => {
    return {
        uniforms: {
            tDiffuse: { value: null },
            resolution: { value: new THREE.Vector2(width, height) }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }`,
        fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform vec2 resolution;
            varying vec2 vUv;


            float threshold(int index) {
                
                float threshold = 0.0;

                ${thresholds[size].map((x, index) => `if (index == ${index}) threshold = ${Number.isInteger(x/size/size)?((x/size/size)+".0"):(x/size/size)};`).join("\n                ")}

                return threshold;
            }

            
            void main() {
                vec2 coordinates = resolution * vUv ;
            
                vec4 texel = texture2D( tDiffuse, vUv );
                float grey = (0.21 * texel.r + 0.71 * texel.g + 0.07 * texel.b);

                int x = int(mod(coordinates.x, ${Number.isInteger(size)?(size+".0"):size}));
                int y = int(mod(coordinates.y, ${Number.isInteger(size)?(size+".0"):size}));
                int index = x + y * ${size};
                
                if (grey < threshold(index)) {
                    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                } else {
                    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
                }
                
                
            }`,
    }
}

export const ditherErrorShader = (width: number, height: number): Shader => {
    return {
        uniforms: {
            tDiffuse: { value: null },
            resolution: { value: new THREE.Vector2(width, height) }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }`,
        fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform vec2 resolution;
            varying vec2 vUv;


            
            void main() {
                vec2 coordinates = resolution / vUv ;
            
                vec4 texel = texture2D( tDiffuse, vUv );
                float grey = (0.21 * texel.r + 0.71 * texel.g + 0.07 * texel.b);

                int x = int(mod(coordinates.x, 3.0));
                int y = int(mod(coordinates.y, 3.0));
                int index = x + y * 3;

                float threshold = 0.0;


                if (index == 0) {
                    threshold = 0.0;
                } else if (index == 1) {
                    threshold = 7.0 / 9.0;
                } else if (index == 2) {
                    threshold = 3.0 / 9.0;
                } else if (index == 3) {
                    threshold = 6.0 / 9.0;
                } else if (index == 4) {
                    threshold = 5.0 / 9.0;
                } else if (index == 5) {
                    threshold = 2.0 / 9.0;;
                } else if (index == 6) {
                    threshold = 4.0 / 9.0;
                } else if (index == 7) {
                    threshold = 1.0 / 9.0;
                } else {
                    threshold = 8.0 / 9.0;
                } 

                
                if (grey < threshold) {
                    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                } else {
                    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
                }
                
                
            }`,
    }
}
