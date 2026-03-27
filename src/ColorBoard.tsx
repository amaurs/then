import { mod, getRandomInt } from './utils'

export default class ColorBoard {
    board: number[][]
    width: number
    height: number
    seed: number

    constructor(width: number, height: number, seed?: number) {
        this.height = height
        this.width = width
        this.seed = seed || 0.5
        this.board = []
        this.init()
    }

    init() {
        this.board = []
        for (let i = 0; i < this.width * this.height; i++) {
            this.board.push([0, 0, 0])
        }
    }

    randomize() {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if (Math.random() < this.seed) {
                    this.setXY(i, j, [
                        Math.floor(Math.random() * 256),
                        Math.floor(Math.random() * 256),
                        Math.floor(Math.random() * 256),
                    ])
                }
            }
        }
    }

    getXY(x: number, y: number): number[] {
        return this.board[mod(y, this.height) * this.width + mod(x, this.width)]
    }

    setXY(x: number, y: number, value: number[]) {
        this.board[mod(y, this.height) * this.width + mod(x, this.width)] =
            value
    }

    printContextOffset(
        context: CanvasRenderingContext2D,
        squareSize: number,
        x: number,
        y: number
    ) {
        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++) {
                const [r, g, b] = this.getXY(i, j)
                if (r > 0 || g > 0 || b > 0) {
                    context.fillStyle = `rgb(${Math.min(255, r)},${Math.min(
                        255,
                        g
                    )},${Math.min(255, b)})`
                    context.fillRect(
                        (x + i) * squareSize,
                        (y + j) * squareSize,
                        squareSize,
                        squareSize
                    )
                }
            }
        }
    }

    shiftRight(): ColorBoard {
        const result = new ColorBoard(this.width, this.height, this.seed)
        for (let j = 0; j < this.height; j++) {
            for (let i = this.width - 1; i > 0; i--) {
                result.setXY(i, j, this.getXY(i - 1, j))
            }
        }
        const ry = getRandomInt(0, this.height)
        result.setXY(0, ry, [
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
        ])
        return result
    }

    shiftUp(): ColorBoard {
        const result = new ColorBoard(this.width, this.height, this.seed)
        for (let j = 0; j < this.height - 1; j++) {
            for (let i = 0; i < this.width; i++) {
                result.setXY(i, j, this.getXY(i, j + 1))
            }
        }
        const rx = getRandomInt(0, this.width)
        result.setXY(rx, this.height - 1, [
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
        ])
        return result
    }

    transpose(): ColorBoard {
        const result = new ColorBoard(this.height, this.width)
        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++) {
                result.setXY(j, i, this.getXY(i, j))
            }
        }
        return result
    }

    // Tensor contraction: RGB dot product
    // Each cell holds [r,g,b]. The "dot product" of two cells
    // multiplies channel-wise and sums, then distributes back to RGB.
    multiply(other: ColorBoard): ColorBoard {
        console.assert(other.height === this.width, {
            errorMsg: 'ColorBoard dimensions do not match.',
        })
        const result = new ColorBoard(other.width, this.height)

        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < other.width; i++) {
                let r = 0,
                    g = 0,
                    b = 0
                for (let k = 0; k < other.height; k++) {
                    const a = this.getXY(k, j)
                    const c = other.getXY(i, k)
                    r += (a[0] * c[0]) / 255
                    g += (a[1] * c[1]) / 255
                    b += (a[2] * c[2]) / 255
                }
                result.setXY(i, j, [
                    Math.min(255, Math.floor(r)),
                    Math.min(255, Math.floor(g)),
                    Math.min(255, Math.floor(b)),
                ])
            }
        }

        return result
    }
}
