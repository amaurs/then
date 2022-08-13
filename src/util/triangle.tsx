import Vector from './vector';

export default abstract class Triangle {
    a: Vector;
    b: Vector;
    c: Vector;

    constructor(a: Vector, b:Vector, c:Vector) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    abstract inflate(): Array<Triangle>;

    abstract conjugate(): Triangle;

    abstract invert(): Triangle;

    orientation() {
        // https://en.wikipedia.org/wiki/Cross_product#Computational_geometry
        return (this.b.y - this.a.y) * (this.c.x - this.b.x) - (this.b.x - this.a.x) * (this.c.y - this.b.y);
    }
}