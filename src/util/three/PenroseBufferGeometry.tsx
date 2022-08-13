
import * as THREE from 'three';
import Vector from '../vector';
import Triangle from '../triangle';
import { BTileS } from '../bTiles';


class PenroseBufferGeometry extends THREE.BufferGeometry {


    constructor(radius: number, inflations: number) {
        super();

        this.type = 'PenroseBufferGeometry';

        const increment = Math.PI / 5;
        let triangles: Array<Triangle> = [];
        
        for (let j = 0; j < 5; j++) {
            triangles.push(new BTileS(new Vector(Math.cos(increment * j), Math.sin(increment * j)).times(radius),
                                      new Vector(0, 0),
                                      new Vector(Math.cos(increment * (j + 1)), Math.sin(increment * (j + 1))).times(radius)));
        }
  
        for (let i = 0; i < inflations; i++) {
            // TODO: find a way to memoize this to make load time faster.
            triangles = triangles.reduce((result: Array<Triangle>, triangle: Triangle): Array<Triangle> => {
                let inflation = triangle.inflate();
                return [...result, ...inflation];
            }, []);
        
        }
        
        triangles = triangles.reduce((result: Array<Triangle>, triangle: Triangle): Array<Triangle> => {    
            return [...result, triangle, triangle.conjugate()];
        }, []);

        const positions: Array<number> = [];
        const normals: Array<number> = [];
        const uvs: Array<number> = [];
        const colors: Array<number> = [];


        triangles.forEach((triangle, index) => {

            let color = new THREE.Color( 0xffffff );
            color.setHex(Math.random() * 0xffffff);

            if (triangle.orientation() < 0) {
                triangle = triangle.invert();
            }
            
            positions.push(triangle.a.x);
            positions.push(triangle.a.y);
            positions.push(0);
            normals.push(0);
            normals.push(0);
            normals.push(1);
            uvs.push(0);
            uvs.push(1);
            colors.push(color.r);
            colors.push(color.g);
            colors.push(color.b);

            positions.push(triangle.b.x); 
            positions.push(triangle.b.y);
            positions.push(0);
            normals.push(0);
            normals.push(0);
            normals.push(1);
            uvs.push(0);
            uvs.push(1);
            colors.push(color.r);
            colors.push(color.g);
            colors.push(color.b);

            positions.push(triangle.c.x);
            positions.push(triangle.c.y);  
            positions.push(0);
            normals.push(0);
            normals.push(0);
            normals.push(1);
            uvs.push(0);
            uvs.push(1);
            colors.push(color.r);
            colors.push(color.g);
            colors.push(color.b);
            
        });

        const geometry = new THREE.BufferGeometry();
        const positionNumComponents = 3;
        const normalNumComponents = 3;
        const colorComponents = 3;
        const uvNumComponents = 2;
        this.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
        this.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
        this.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));
        this.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), colorComponents));
    }    
}


export { PenroseBufferGeometry }