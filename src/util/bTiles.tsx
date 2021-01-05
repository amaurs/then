import Vector from './vector';
import Triangle from './triangle';

const phi = (1 + Math.sqrt(5)) / 2;
const psi = (Math.sqrt(5) - 1) / 2;
const phiSquared = phi * phi;
const psiSquared = psi * psi;

export class BTileL extends Triangle {

    inflate(): Array<Triangle> {
        let d = this.a.times(psiSquared).plus(this.c.times(psi));
        let e = this.a.times(psiSquared).plus(this.b.times(psi));
        return [new BTileL(d, e, this.a), // fliping this values give rise to interesting configurations of the faces.
                new BTileS(e, d, this.b),
                new BTileL(this.c, d, this.b)]
    }

    conjugate(): Triangle {
        return new BTileL(new Vector(this.a.x, -this.a.y),
                          new Vector(this.b.x, -this.b.y),
                          new Vector(this.c.x, -this.c.y));
    }
}

export class BTileS extends Triangle {

    inflate(): Array<Triangle> {
        let d =this.a.times(psi).plus(this.b.times(psiSquared));
        return [new BTileS(d, this.c, this.a),
                new BTileL(this.c, d, this.b)];
    }

    conjugate(): Triangle {
        return new BTileS(new Vector(this.a.x, -this.a.y),
                          new Vector(this.b.x, -this.b.y),
                          new Vector(this.c.x, -this.c.y));
    }
}