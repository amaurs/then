import * as d3 from 'd3';

/** When I fell lucky I like to get a random number. **/
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}



/** Given an array of polygons this calculates the centroids and returns them. **/
export function getCentroids(polygons){
  let points = [];

  polygons.forEach(function(polygon){
    let x = 0;
    let y = 0;
    polygon.forEach(function(point){
      x = x + point[0];
      y = y + point[1];
    })
    x = x / polygon.length;
    y = y / polygon.length;
    points.push([x,y]);
  });
  return points;
}

export function getCentroidsNew(polygons){
  let points = [];

  for (let polygon of polygons) {
    let x = 0;
    let y = 0;
    polygon.forEach(function(point){
      x = x + point[0];
      y = y + point[1];
    })
    x = x / polygon.length;
    y = y / polygon.length;
    points.push([x,y]);

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

/** There are other recipies to get brigthness I just like this one. **/
export function getBrightness(red, green, blue){
  return (red * 0.3 + green * 0.59 + blue * 0.11) / 255.0; 
}

export function getBrightnessFromXY(imageData, x, y){

    let i = (Math.floor(y) * imageData.width + Math.floor(x)) << 2;
    let bright = getBrightness(imageData.data[i + 0], imageData.data[i + 1], imageData.data[i + 2]); 
    return bright;
}

function getNorm(x1, y1, x2, y2){
    return Math.sqrt(getNormSquared(x1, y1, x2, y2));
}

function getNormSquared(x1, y1, x2, y2){
    return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)
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