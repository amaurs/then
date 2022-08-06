
import { Geometry, Vector3, Face3 } from "three/examples/jsm/deprecated/Geometry.js";
import Vector from '../vector';
import Triangle from '../triangle';
import { BTileS } from '../bTiles';


export default class PenroseGeometry extends Geometry {


    constructor(radius: number, inflations: number) {
        super();

        const increment = Math.PI / 5;
        let triangles: Array<Triangle> = [];
        
        for (let j = 0; j < 5; j++) {
            triangles.push(new BTileS(new Vector(Math.cos(increment * j), Math.sin(increment * j)).times(radius),
                                      new Vector(0, 0),
                                      new Vector(Math.cos(increment * (j + 1)), Math.sin(increment * (j + 1))).times(radius)));
        }
  
        for (let i = 0; i < inflations; i++) {
            triangles = triangles.reduce((result: Array<Triangle>, triangle: Triangle): Array<Triangle> => {
                let inflation = triangle.inflate();
                return [...result, ...inflation];
            }, []);
        
        }
        
        triangles = triangles.reduce((result: Array<Triangle>, triangle: Triangle): Array<Triangle> => {    
            return [...result, triangle, triangle.conjugate()];
        }, []);

        triangles.forEach((triangle, index) => {
            this.vertices.push(new Vector3(triangle.a.x, triangle.a.y,  0));
            this.vertices.push(new Vector3(triangle.b.x, triangle.b.y,  0));
            this.vertices.push(new Vector3(triangle.c.x, triangle.c.y,  0));
            const normal = new Vector3( 0, 0, 1 );
            const face = new Face3( index * 3, index * 3 + 1, index * 3 + 2, normal);
            this.faces.push(face);
        });
    }    
}