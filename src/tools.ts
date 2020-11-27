/* 
 * This method gets the opposite color from the one given.
 */

export const invertColor = (r: number, g: number, b: number): string => {
    const invertedR = 255 - r,
        invertedG = 255 - g,
        invertedB = 255 - b;
    return "rgb(" + invertedR + ", " + invertedG + ", " + invertedB + ")";
};

/** When I fell lucky I like to get a random number. **/

export const getRandomInt = (lower: number, upper: number): number => {
    let min = Math.ceil(lower);
    let max = Math.floor(upper);
    return Math.floor(Math.random() * (max - min)) + min;
}



export const getRandomIntegerArray = (size: number, min: number, max: number): Array<number> => {
    let integers = [];
    for (let i = 0; i < size; i++) {
        integers.push(getRandomInt(min, max));
    }
    return integers;
}

export const intToColor = (color: number): string => {

    let b = color & 0xFF,
        g = (color & 0xFF00) >>> 8,
        r = (color & 0xFF0000) >>> 16;

    return "rgb(" + [r, g, b].join(",") + ")";

}

export const randomColor = (): string => {

    return intToColor(getRandomInt(0, Math.pow(2, 24)));
}


export const colorToString = (red: number, green: number, blue: number): string => {
    return "rgb(" + red + ", " + green + ", " + blue + ")";
}

export const colorToInt = (red: number, green: number, blue: number): number => {

    return (red << 16) | (green << 8) | blue;

}

export const getXYfromIndex = (index: number, width: number): Array<number> => {
    let y = Math.floor(index / width);
    let x = index % width;
    return [x, y];
}

/** There are other recipies to get brigthness I just like this one. **/
export const getBrightness = (red: number, green: number, blue: number): number => {
    return (red * 0.3 + green * 0.59 + blue * 0.11) / 255.0;
}

