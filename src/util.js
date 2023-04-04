import * as d3 from 'd3'
import { normal } from 'color-blend'

export const RED = { r: 255, g: 0, b: 0, a: 1 }
export const YELLOW = { r: 255, g: 255, b: 0, a: 1 }
export const BLUE = { r: 0, g: 0, b: 255, a: 1 }
export const WHITE = { r: 255, g: 255, b: 255, a: 1 }
export const BLACK = { r: 0, g: 0, b: 0, a: 1 }

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
    // taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

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
        //console.log(polygon);
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
