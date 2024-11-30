# Hilbert

The Hilbert curve is a fractal space-filling curve that can fill space in two and three dimensions. It was first described by the mathematician David Hilbert in 1891. The curve has a unique property of visiting every point in a given area or volume without overlapping or leaving any gaps.

The Hilbert Curve is a space-filling curve that can fill a two-dimensional or three-dimensional space by traversing it in a continuous and non-overlapping manner. The curve is named after the German mathematician David Hilbert who first introduced it in 1891.

In two dimensions, the Hilbert curve is constructed by recursively dividing a square into four smaller squares and then connecting the smaller squares in a specific order. The order in which the squares are connected is determined by the Hilbert curve's recursive formula, which ensures that the curve never intersects itself. The resulting curve has a self-similar structure that allows it to fill the entire square.

In three dimensions, the Hilbert curve is constructed similarly by recursively dividing a cube into eight smaller cubes and connecting them in a specific order. The resulting curve has a similar self-similar structure that allows it to fill the entire cube.

The unique properties of the Hilbert curve make it useful in various applications, including data compression and image processing. One such application is the bijection between the cube of RGB colors and a square of pixels.

In this application, the RGB color cube is mapped onto a two-dimensional Hilbert curve, which fills a square of pixels. Each pixel in the square corresponds to a unique RGB color value in the cube. The bijection ensures that every pixel in the square is mapped to a unique RGB color value, and vice versa.

The use of the Hilbert curve in this application allows for efficient compression and storage of images, as well as fast retrieval of pixel values. The self-similar structure of the curve also allows for easy visualization and manipulation of images.

A space-filling curve is the image of a continuous function that maps an interval onto the unit cube of a n-dimensional euclidean space. The continuity of such mappings allow us to take one of these curves in certain space, stretch it into a line, and then map that line into another euclidean space. Using this tools we can flatten the space of colors, represented by triplets of Red, Green, and Blue values, into an image. The size of the image depends on the number of bits that we use to store the color information.
