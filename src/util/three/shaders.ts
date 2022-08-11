import * as THREE from "three";

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

export interface Prediction { 
    topLeft: Array<number>;
    bottomRight: Array<number>;
}

export const maskShader = (width: number, height: number, imageWidth: number, imageHeight: number, predictions: Array<Prediction>): Shader => {
    

    let rectangles = predictions.map((prediction: Prediction) => {
        const topLeftX = prediction.topLeft[0];
        const topLeftY = prediction.topLeft[1];
        const bottomRightX = prediction.bottomRight[0];
        const bottomRightY = prediction.bottomRight[1];
        let maskWidth = (bottomRightX - topLeftX) / imageWidth;
        let maskHeight = (bottomRightY - topLeftY) / imageHeight;
        let maskX = topLeftX / imageWidth;
        let maskY = topLeftY / imageHeight;
        return `Rectangle(vec2(${maskWidth}, ${maskHeight}), uv, vec2(${maskX - 0.5}, ${0.5 - maskY - maskHeight}), maskColor)`;

    });

    return {
        uniforms: {
            tDiffuse: { value: null },
            uPlaneRatio: { value: width / height }

        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }`,
        fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform float uPlaneRatio;
            varying vec2 vUv;

            vec3 Rectangle(in vec2 size, in vec2 st, in vec2 p, in vec3 c) {
                float top = step(1. - (p.y + size.y), 1. - st.y);
                float right = step(1. - (p.x + size.x), 1. - st.x);
                float bottom = step(p.y, st.y);
                float left = step(p.x, st.x);
                return top * right * bottom * left * c;
            }

            
            void main() {
                vec2 uv = vUv - 0.5;
                uv.x *= uPlaneRatio;
                vec3 color = vec3(uv.x, uv.y, 0.0);

                vec2 maskPosition2 = vec2(0.0, 0.0);
                vec3 maskColor =  vec3(0.0, 1.0, 1.0);
                vec3 mask = ${rectangles.join(" + ")};
                vec3 frontImage = texture2D(tDiffuse, uv * 1.0 + 0.5).rgb;
                color = (1.0 - mask) * frontImage;
                gl_FragColor = vec4(color, 1.0);
                
            }`,
    }
}




export const glitchShader = (width: number, height: number, imageWidth: number, imageHeight: number, predictions: Array<Prediction>): Shader => {
    
    let rectangles = predictions.map((prediction: Prediction) => {
        const topLeftX = prediction.topLeft[0];
        const topLeftY = prediction.topLeft[1];
        const bottomRightX = prediction.bottomRight[0];
        const bottomRightY = prediction.bottomRight[1];
        let maskWidth = (bottomRightX - topLeftX) / imageWidth;
        let maskHeight = (bottomRightY - topLeftY) / imageHeight;
        let maskX = topLeftX / imageWidth;
        let maskY = topLeftY / imageHeight;
        return `Rectangle(vec2(${maskWidth}, ${maskHeight}), uv, vec2(${maskX - 0.5}, ${0.5 - maskY - maskHeight}))`;

    });

    return {
        uniforms: {
            "tDiffuse": { value: null },
            "tDisp": { value: null }, // displacement texture for digital glitch squares
            "snowAmount": { value: 0.08 },
            "offsetAmount": { value: 0.08 },
            "angle": { value: 0.02 },
            "seed": { value: 0.02 },
            "seedX": { value: 0.02 }, // -1,1
            "seedY": { value: 0.02 }, // -1,1
            "distortionX": { value: 0.5 },
            "distortionY": { value: 0.5 },
            "colS": { value: 0.05 },
            "uPlaneRatio": { value: width / height }

        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }`,
        fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform sampler2D tDisp;
        
            uniform float snowAmount;
            uniform float offsetAmount;
            uniform float angle;
            uniform float seed;
            uniform float seedX;
            uniform float seedY;
            uniform float distortionX;
            uniform float distortionY;
            uniform float colS;
            
            varying vec2 vUv;

            uniform float uPlaneRatio;

            float Rectangle(in vec2 size, in vec2 st, in vec2 p) {
                float top = step(1. - (p.y + size.y), 1. - st.y);
                float right = step(1. - (p.x + size.x), 1. - st.x);
                float bottom = step(p.y, st.y);
                float left = step(p.x, st.x);
                return top * right * bottom * left;
            }
        
            float rand(vec2 co){
                return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
            }
                
            void main() {
                vec2 uv = vUv - 0.5;
                //uv.x *= uPlaneRatio;
                vec3 color = vec3(uv.x, uv.y, 0.0);

                vec2 maskPosition2 = vec2(0.0, 0.0);
                float mask = ${rectangles.join(" + ")};




                if(mask > 0.5) {
                    vec2 p = vUv * 1.0;
                    //p.x *= uPlaneRatio;
                    float xs = floor(gl_FragCoord.x / 0.5);
                    float ys = floor(gl_FragCoord.y / 0.5);
                //based on staffantans glitch shader for unity https://github.com/staffantan/unityglitch
                    vec4 normal = texture2D (tDisp, p*seed*seed);
                    if(p.y < distortionX + colS && p.y > distortionX - colS * seed) {
                        if(seedX > 0.){
                            p.y = 1. - (p.y + distortionY);
                        }
                        else {
                            p.y = distortionY;
                        }
                    }
                    if(p.x<distortionY+colS && p.x>distortionY-colS*seed) {
                        if(seedY > 0.){
                            p.x = distortionX;
                        }
                        else {
                            p.x = 1. - (p.x + distortionX);
                        }
                    }
                    p.x += normal.x * seedX * (seed / 5.);
                    p.y += normal.y * seedY * (seed / 5.);
                    vec2 offset = offsetAmount * vec2(cos(angle), sin(angle));
                    vec4 cr = texture2D(tDiffuse, p + offset);
                    vec4 cga = texture2D(tDiffuse, p);
                    vec4 cb = texture2D(tDiffuse, p - offset);
                    vec4 snow = 200. * snowAmount * vec4(rand(vec2(xs * seed, ys * seed*50.)) * 0.2);
                    gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a) + snow;
                }
                else {
                    gl_FragColor = texture2D(tDiffuse, uv * 1.0 + 0.5);
                }
                
            }`,
    }
}
