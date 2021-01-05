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
}