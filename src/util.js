import * as d3 from 'd3';
import { normal } from 'color-blend';

export const RED = { r: 255, g: 0, b: 0, a: 1 };
export const YELLOW = { r: 255, g: 255, b: 0, a: 1 };
export const BLUE = { r: 0, g: 0, b: 255, a: 1 };
export const WHITE = { r: 255, g: 255, b: 255, a: 1 };
export const BLACK = { r: 0, g: 0, b: 0, a: 1 };

// const pinkBackground  = { r: 255, g:   255, b: 0, a: .5 }
// const greenForeground = { r: 255, g: 255, b: 255, a: 1  }

// const help = normal(pinkBackground, greenForeground);

// const OTHER_YELLOW = [help.r, help.g, help.b]

/* 
 * This method gets the opposite color from the one given.
 */
export function invertColor(r, g, b) {
    let invertedR = 255 - r,
        invertedG = 255 - g,
        invertedB = 255 - b;
    return "rgb(" + invertedR + ", " + invertedG + ", " + invertedB + ")";
}

export function colorToString(r, g, b) {
    return "rgb(" + r + ", " + g + ", " + b + ")";
}

/** When I fell lucky I like to get a random number. **/
export function getRandomInt(lower, upper) {
  let min = Math.ceil(lower);
  let max = Math.floor(upper);
  return Math.floor(Math.random() * (max - min)) + min;
}

export function getIndexFromArray(array, value) {
    let index = -1;
    array.forEach(function(object, i) {
        if(object === value){
            index = i;
        }
    });
    return index;
}

export function getRandomIntegerArray(size, min, max) {
  let integers = [];
  for(let i = 0; i < size; i++) {
    integers.push(getRandomInt(min, max));
  }
  return integers;
}

export function getXYfromIndex(index, width) {
  let y = Math.floor(index / width);
  let x = index % width;
  return [x, y];
}

export function shuffle(array) {
  // taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  
  let result = array.slice();
  let currentIndex = result.length, temporaryValue, randomIndex;

  
  while (0 !== currentIndex) {

    
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = result[currentIndex];
    result[currentIndex] = result[randomIndex];
    result[randomIndex] = temporaryValue;
  }

  return result;
}

export function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

/** Given an array of polygons this calculates the centroids and returns them. **/
export function getCentroids(polygons){
  let points = [];
  let polygon;
  for (polygon of polygons) {
    let x = 0;
    let y = 0;
    polygon.forEach(function(point){
      x = x + point[0];
      y = y + point[1];
    })
    x = x / polygon.length;
    y = y / polygon.length;
    points.push([x,y]);
    //console.log(polygon);
  };
  return points;
}

export function getColor(imageData, x, y){
    
    let index = Math.floor(y) * imageData.width + Math.floor(x);
    let i = index * 4;
    let color = d3.rgb(imageData.data[i + 0], 
                  imageData.data[i + 1], 
                  imageData.data[i + 2]);
    
    return color;
}

export function closest(colors, red, green, blue) {
  let arrayColors = generateColors(colors, 10);
  let whiteBackground = { r: 255, g: 255, b: 255, a: 1 };
  let flatColors = arrayColors.map(function(color) {
    return normal(whiteBackground, color);
  });
  flatColors.push(WHITE);
  arrayColors.push(WHITE);
  let currentColor = { r: red, g: green, b: blue, a: 1 };
  let distance = flatColors.map(function(color) {
    return colorDistance(color, currentColor);
  });
  let min = 1000000;
  let colorIndex = 0;
  distance.forEach(function(c, index) {
    if(c < min) {
      min = c;
      colorIndex = index;
    
    }
  });

  return { flat_r: flatColors[colorIndex].r,
           flat_g: flatColors[colorIndex].g,
           flat_b: flatColors[colorIndex].b,
           alpha_r: arrayColors[colorIndex].r,
           alpha_g: arrayColors[colorIndex].g,
           alpha_b: arrayColors[colorIndex].b,
           alpha_a: arrayColors[colorIndex].a };
}

/** There are other recipies to get brigthness I just like this one. **/
export function getBrightness(red, green, blue){
  return (red * 0.3 + green * 0.59 + blue * 0.11) / 255.0; 
}

export function getBrightnessFromXY(imageData, x, y){

    let i = (Math.floor(y) * imageData.width + Math.floor(x)) << 2;
    let bright = getBrightness(imageData.data[i + 0], imageData.data[i + 1], imageData.data[i + 2]); 
    return bright;
}

export function getNorm(x1, y1, x2, y2){
    return Math.sqrt(getNormSquared(x1, y1, x2, y2));
}

function getNormSquared(x1, y1, x2, y2){
    return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)
}

function getNormSuared3d(x1, y1, z1, x2, y2, z2) {
  return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1)
}

function colorDistance(colorA, colorB) {
  return getNormSuared3d(colorA.r, colorA.g, colorA.b, colorB.r, colorB.g, colorB.b);
}

function generateColors(baseColorArray, steps) {
    let colors = [];
    let step = 255 / steps;
    baseColorArray.forEach(function(color) {
        for(let i = 0; i < steps; i ++) {
            let alpha = step * (i + 1);
            let newColor = {r: color.r, 
                            g: color.g, 
                            b: color.b, 
                            a: Math.round(alpha) / 255};
            colors.push(newColor);
        }
    });
    return colors;
}

export function romanize(num) {
    let lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},roman = '',i;
    for ( i in lookup ) {
      while ( num >= lookup[i] ) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
}


export function intToColor(color) {

    let b =  color & 0xFF,
        g = (color & 0xFF00) >>> 8,
        r = (color & 0xFF0000) >>> 16;

    return "rgb(" + [r, g, b].join(",") + ")";

}

export function randomColor() {

    return intToColor(getRandomInt(0, Math.pow(2, 24)));
}


export function colorToInt(r, g, b) {

    return (r << 16) | (g << 8) | b;

}

export function mod(n, m) {
    return ((n % m) + m) % m;
}

export function getDifference(oldSites, newSites){
  let totalDiff = 0;
  if(oldSites && newSites){
    for(let i = 0; i < oldSites.length; i++){
      if(oldSites[i] && newSites[i])
        totalDiff = totalDiff + getNorm(oldSites[i][0], oldSites[i][1], newSites[i][0], newSites[i][1]);
    }
  }
  return totalDiff;
}
