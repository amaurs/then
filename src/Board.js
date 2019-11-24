import { mod, intToColor } from './util.js';
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

    glider(x, y) {
        this.setXY(x + 0, y + 0, ALIVE);
        this.setXY(x + 0, y + 1, ALIVE);
        this.setXY(x + 1, y + 0, ALIVE);
        this.setXY(x + 1, y + 2, ALIVE);
        this.setXY(x + 2, y + 0, ALIVE);

    }

    glider2(x, y) {
        this.setXY(x + 0, y + 0, ALIVE);
        this.setXY(x + 0, y + 1, ALIVE);
        this.setXY(x + 0, y + 2, ALIVE);
        this.setXY(x + 1, y + 0, ALIVE);
        this.setXY(x + 2, y + 1, ALIVE);

    }

    piece1(x, y) {
        this.setXY(x + 0, y + 1, ALIVE);
        this.setXY(x + 0, y + 2, ALIVE);
        this.setXY(x + 1, y + 0, ALIVE);
        this.setXY(x + 1, y + 2, ALIVE);
        this.setXY(x + 2, y + 0, ALIVE);
        this.setXY(x + 2, y + 1, ALIVE);
    }

    square(x, y) {
        this.setXY(x + 0, y + 0, ALIVE);
        this.setXY(x + 0, y + 1, ALIVE);
        this.setXY(x + 1, y + 0, ALIVE);
        this.setXY(x + 1, y + 1, ALIVE);

    }
    gliderGun(x, y) {
        this.square(x + 0, y + 2);
        this.piece1(x + 8, y + 2);
        this.setXY(x + 11, y + 8);
        this.setXY(x + 12, y + 5);
        this.glider2(x + 16, y + 4);
        this.piece1(x + 22, y + 0);
        this.glider(x + 24, y + 12);
        this.square(x + 34, y + 0);
        this.glider2(x + 35, y + 7);
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

    printContext(context, squareSize, color) {
        for(let j = 0; j < this.height; j++) {
            for(let i = 0; i < this.width; i++) {
                if (this.getXY(i, j)) {
                    context.fillStyle = color;
                    context.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
                }
            }
        }
    }

    highlight(context, squareSize, x, y, width, height) {
        let counter = 0;
        for(let j = y; j < y + height; j++) {
            for(let i = x; i < x + width; i++) {
                if (this.getXY(i, j)) {
                    context.fillStyle = "white";
                } else {
                    context.fillStyle = intToColor(1 << counter);
                }
                context.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
                counter++;
            }
        }
    }

    getColor(context, squareSize, x, y, width, height) {
        let counter = 0;
        let color = 0;
        for(let j = y; j < y + height; j++) {
            for(let i = x; i < x + width; i++) {
                if (this.getXY(i, j)) {
                    color += 1 << counter;
                }
                
                counter++;
            }
        }
        return intToColor(color);
    }


}
