import * as d3 from 'd3'
import { normal } from 'color-blend'

// --- Color constants ---

export const RED = { r: 255, g: 0, b: 0, a: 1 }
export const YELLOW = { r: 255, g: 255, b: 0, a: 1 }
export const BLUE = { r: 0, g: 0, b: 255, a: 1 }
export const WHITE = { r: 255, g: 255, b: 255, a: 1 }
export const BLACK = { r: 0, g: 0, b: 0, a: 1 }

// --- From tools.ts ---

export const invertColor = (r: number, g: number, b: number): string => {
    const invertedR = 255 - r,
        invertedG = 255 - g,
        invertedB = 255 - b
    return 'rgb(' + invertedR + ', ' + invertedG + ', ' + invertedB + ')'
}

export const getRandomInt = (lower: number, upper: number): number => {
    let min = Math.ceil(lower)
    let max = Math.floor(upper)
    return Math.floor(Math.random() * (max - min)) + min
}

export const getRandomIntegerArray = (
    size: number,
    min: number,
    max: number
): Array<number> => {
    let integers = []
    for (let i = 0; i < size; i++) {
        integers.push(getRandomInt(min, max))
    }
    return integers
}

export const intToColor = (color: number): string => {
    let b = color & 0xff,
        g = (color & 0xff00) >>> 8,
        r = (color & 0xff0000) >>> 16

    return 'rgb(' + [r, g, b].join(',') + ')'
}

export const randomColor = (): string => {
    return intToColor(getRandomInt(0, Math.pow(2, 24)))
}

export const colorToString = (
    red: number,
    green: number,
    blue: number
): string => {
    return 'rgb(' + red + ', ' + green + ', ' + blue + ')'
}

export const colorToInt = (
    red: number,
    green: number,
    blue: number
): number => {
    return (red << 16) | (green << 8) | blue
}

export const getXYfromIndex = (index: number, width: number): Array<number> => {
    let y = Math.floor(index / width)
    let x = index % width
    return [x, y]
}

export const getBrightness = (
    red: number,
    green: number,
    blue: number
): number => {
    return (red * 0.3 + green * 0.59 + blue * 0.11) / 255.0
}

export const colorToGrey = (
    red: number,
    green: number,
    blue: number
): number => {
    return Math.round(0.21 * red + 0.71 * green + 0.07 * blue)
}

export const colorMatrix = (
    color: Array<number>,
    matrix: Array<number>
): Uint8ClampedArray => {
    let rotatedColor = new Uint8ClampedArray(4)

    rotatedColor[0] =
        matrix[0] * color[0] +
        matrix[1] * color[1] +
        matrix[2] * color[2] +
        matrix[3] * color[3] +
        matrix[4] * 255
    rotatedColor[1] =
        matrix[5] * color[0] +
        matrix[6] * color[1] +
        matrix[7] * color[2] +
        matrix[8] * color[3] +
        matrix[9] * 255
    rotatedColor[2] =
        matrix[10] * color[0] +
        matrix[11] * color[1] +
        matrix[12] * color[2] +
        matrix[13] * color[3] +
        matrix[14] * 255
    rotatedColor[3] =
        matrix[15] * color[0] +
        matrix[16] * color[1] +
        matrix[17] * color[2] +
        matrix[18] * color[3] +
        matrix[19] * 255

    return rotatedColor
}

export const colorImageData = (
    image: ImageData,
    matrix: Array<number>
): ImageData => {
    let arr = new Uint8ClampedArray(image.data.length)

    for (let i = 0; i < arr.length; i++) {
        let rotatedColor = colorMatrix(
            [
                image.data[i * 4 + 0],
                image.data[i * 4 + 1],
                image.data[i * 4 + 2],
                image.data[i * 4 + 3],
            ],
            matrix
        )
        arr[i * 4 + 0] = rotatedColor[0]
        arr[i * 4 + 1] = rotatedColor[1]
        arr[i * 4 + 2] = rotatedColor[2]
        arr[i * 4 + 3] = rotatedColor[3]
    }

    return new ImageData(arr, image.width, image.height)
}

// --- From util.ts ---

export function getIndexFromArray(array, value) {
    let index = -1
    array.forEach(function (object, i) {
        if (object === value) {
            index = i
        }
    })
    return index
}

export function shuffle(array) {
    let result = array.slice()
    let currentIndex = result.length,
        temporaryValue,
        randomIndex

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        temporaryValue = result[currentIndex]
        result[currentIndex] = result[randomIndex]
        result[randomIndex] = temporaryValue
    }

    return result
}

export function download(filename, text) {
    var pom = document.createElement('a')
    pom.setAttribute(
        'href',
        'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(text)
    )
    pom.setAttribute('download', filename)
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents')
        event.initEvent('click', true, true)
        pom.dispatchEvent(event)
    } else {
        pom.click()
    }
}

/** Given an array of polygons this calculates the centroids and returns them. **/
export function getCentroids(polygons) {
    let points = []
    let polygon
    for (polygon of polygons) {
        let x = 0
        let y = 0
        polygon.forEach(function (point) {
            x = x + point[0]
            y = y + point[1]
        })
        x = x / polygon.length
        y = y / polygon.length
        points.push([x, y])
    }
    return points
}

export function closest(colors, red, green, blue) {
    let arrayColors = generateColors(colors, 10)
    let whiteBackground = { r: 255, g: 255, b: 255, a: 1 }
    let flatColors = arrayColors.map(function (color) {
        return normal(whiteBackground, color)
    })
    flatColors.push(WHITE)
    arrayColors.push(WHITE)
    let currentColor = { r: red, g: green, b: blue, a: 1 }
    let distance = flatColors.map(function (color) {
        return colorDistance(color, currentColor)
    })
    let min = 1000000
    let colorIndex = 0
    distance.forEach(function (c, index) {
        if (c < min) {
            min = c
            colorIndex = index
        }
    })

    return {
        flat_r: flatColors[colorIndex].r,
        flat_g: flatColors[colorIndex].g,
        flat_b: flatColors[colorIndex].b,
        alpha_r: arrayColors[colorIndex].r,
        alpha_g: arrayColors[colorIndex].g,
        alpha_b: arrayColors[colorIndex].b,
        alpha_a: arrayColors[colorIndex].a,
    }
}

export function getNorm(x1, y1, x2, y2) {
    return Math.sqrt(getNormSquared(x1, y1, x2, y2))
}

function getNormSquared(x1, y1, x2, y2) {
    return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)
}

function getNormSuared3d(x1, y1, z1, x2, y2, z2) {
    return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1)
}

function colorDistance(colorA, colorB) {
    return getNormSuared3d(
        colorA.r,
        colorA.g,
        colorA.b,
        colorB.r,
        colorB.g,
        colorB.b
    )
}

function generateColors(baseColorArray, steps) {
    let colors = []
    let step = 255 / steps
    baseColorArray.forEach(function (color) {
        for (let i = 0; i < steps; i++) {
            let alpha = step * (i + 1)
            let newColor = {
                r: color.r,
                g: color.g,
                b: color.b,
                a: Math.round(alpha) / 255,
            }
            colors.push(newColor)
        }
    })
    return colors
}

export function romanize(num) {
    let lookup = {
            M: 1000,
            CM: 900,
            D: 500,
            CD: 400,
            C: 100,
            XC: 90,
            L: 50,
            XL: 40,
            X: 10,
            IX: 9,
            V: 5,
            IV: 4,
            I: 1,
        },
        roman = '',
        i
    for (i in lookup) {
        while (num >= lookup[i]) {
            roman += i
            num -= lookup[i]
        }
    }
    return roman
}

export function mod(n, m) {
    return ((n % m) + m) % m
}

export function getDifference(oldSites, newSites) {
    let totalDiff = 0
    if (oldSites && newSites) {
        for (let i = 0; i < oldSites.length; i++) {
            if (oldSites[i] && newSites[i])
                totalDiff =
                    totalDiff +
                    getNorm(
                        oldSites[i][0],
                        oldSites[i][1],
                        newSites[i][0],
                        newSites[i][1]
                    )
        }
    }
    return totalDiff
}
