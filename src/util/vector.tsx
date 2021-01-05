class Vector {

    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    times(scalar: number): Vector {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    plusBoundedBelow(other: Vector, lowerBound: number): Vector {
        let x = this.x + other.x;
        let y = this.y + other.y;
        if (y < lowerBound) {
            y = lowerBound;
        }
        return new Vector(x, y);
    }

    plus(other: Vector): Vector {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    toString(): string {
        return "(" + this.x + "," + this.y + ")";
    }
}

export default Vector;