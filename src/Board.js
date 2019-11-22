import { mod } from './util.js';
const ALIVE = 1;
const DEAD = 0;

export default class Board {

    constructor(width, height) {
        this.height = height;
        this.width = width;
        this.board = [];
        this.init();
    }

    init() {
        this.board = [];
        for (let i = 0; i < this.width * this.height; i++) {
            this.board.push(DEAD);
        }
    }

    randomize() {
        for(let i = 0; i < this.width; i++) {
            for(let j = 0; j < this.height; j++) {
                this.setXY(i, j, Math.random() < .5? ALIVE: DEAD);
            }
        }
    }

    glider() {
        this.init();
        this.setXY(0, 0, ALIVE);
        this.setXY(1, 1, ALIVE);
        this.setXY(1, 2, ALIVE);
        this.setXY(2, 0, ALIVE);
        this.setXY(2, 1, ALIVE);

    }
    
    getBoard() {
        return this.board;
    }

    getXY(x, y) {
        return this.board[mod(y, this.height) * this.width + mod(x, this.width)];
    }

    setXY(x, y, status) {
        this.board[mod(y, this.height) * this.width + mod(x, this.width)] = status;
    }

    getNeighbors(x, y) {
        let directions = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]
        return directions.map(function(element) {
            return this.getXY(x + element[0], y + element[1]);
        }.bind(this));
    }

    getNextGeneration() {
        let next = new Board(this.width, this.height);
        for(let i = 0; i < this.width; i++) {
            for(let j = 0; j < this.height; j++) {
                let neighbors = this.getNeighbors(i, j);
                let condition = neighbors.reduce((a, b) => a + b, 0);
                if (this.getXY(i, j) === ALIVE) {
                    if (condition === 2 || condition === 3) {
                        next.setXY(i, j, ALIVE);
                    } else {
                        next.setXY(i, j, DEAD);
                    }
                } else if (this.getXY(i, j) === DEAD) {
                    if (condition === 3) {
                        next.setXY(i, j, ALIVE);
                    } else {
                        next.setXY(i, j, DEAD);
                    }
                }
            }
        }
        return next;
    }

    print() {
        
        for(let j = 0; j < this.height; j++) {
            let row = ""
            for(let i = 0; i < this.width; i++) {
                row = row + (this.getXY(i, j)?"*": " ");
            }
            console.log(row)
        }
        console.log("")
    }

    printContext(context, squareSize) {
        
        for(let j = 0; j < this.height; j++) {
            let row = ""
            for(let i = 0; i < this.width; i++) {
                if (this.getXY(i, j)) {
                    context.fillStyle = "black";
                    context.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
                }
            }
            console.log(row)
        }
        console.log("")
    }


}
