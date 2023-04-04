/*
 * This method gets the opposite color from the one given.
 */

export const invertColor = (r: number, g: number, b: number): string => {
    const invertedR = 255 - r,
        invertedG = 255 - g,
        invertedB = 255 - b
    return 'rgb(' + invertedR + ', ' + invertedG + ', ' + invertedB + ')'
}

/** When I fell lucky I like to get a random number. **/

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

/** There are other recipies to get brigthness I just like this one. **/
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
