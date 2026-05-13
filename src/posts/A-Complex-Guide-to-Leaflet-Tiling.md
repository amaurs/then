# A Complex Guide to Leaflet Tiling

When I was learning to program, I was also obsessed with fractals. The Mandelbrot set was both beautiful and enigmatic, so one of the first things that produced me a great sense of satisfaction was being able to create images of it. Soon, when I learned that I could zoom in the fractal by choosing an adequate window, I decided to make an animation of that zooming and uploaded to YouTube where it is still available today.

The Mandelbrot set became sort of my personal “Hello World!” every time I start to learn a new language. Throughout the years I have learned some tricks: how to compute it faster, how to create beautiful color palettes, how to get rid of color bands.

Lately I have been working on creating an application to display thousands of polygons on a map so I started using leaflet.js more seriously. As I was researching how to make the app more performant, I needed to learn how the framework works internally. I decided to finally finish one of the ideas that I have left behind: a Mandelbrot set interactive visualizer.

Leaflet uses a tile-system to represent the world and lets the user zoom in at will. By default, it uses 256-pixel-by-256-pixel images starting with one at zoom level zero. At zoom level one that tile is divided into four 256-pixel-by-256-pixel tiles, at zoom level two each one of those is divided by four again. A tile can be labeled using three coordinates, z for the depth, and x and y for the position. The number of tiles needed to represent the world at each level grows exponentially, so web map services calculate them in advance, and store them to be available on demand. This process is used to improve performance with big raster data and the resulting file with the tiling is called a pyramid.

Given that the Mandelbrot set is easy to calculate, instead of calculate and store the pyramids in advance I decided that it was easier to compute and store each image as they were needed. To simplify things I used Python as the programming language for the backend and Flask as the web framework.

Leaflet expects services that return images using the z, x, y coordinates. Our service transforms those coordinates into sections of the complex plane and computes the 256-pixel-by-256-pixel images for that window. This process should be as fast as it inspired by this post, I used Numba to speed up the calculation of the Mandelbrot Set. It compiles critical parts of the process making it run as fast as it was programmed directly in C, C++ or Fortran.

The Mandelbrot set in the complex plane is the set of complex numbers c that keep close to the origin after a mapping is recursively applied an infinite number of times starting at z=0.

As I was using a bounded numerical system, I needed to define what does an infinitely recursive function is and what does it mean to be close to the origin. To this end, I chose a radius of 15 units from the origin to define what is close and 2048 iterations as our infinitely many. In other words, for a given complex number c, if after 2048 iterations of the function its modulus is less than 15 then I mark that number to be part of the Mandelbrot; otherwise, I keep the iteration number at which its modulus went bigger than our threshold radius and is called escape time. Then I assign a color depending on the number of iterations that it took our sequence to escape from the bounded region.

The path for a given c, in this case it takes 3 iterations for the sequence to land outside the bounded region.
To create a mapping between the image coordinates and the complex plane I use a special function. I center our viewport at (0,-5i) and to have a 2-by-2i window at zoom zero. The image is oriented to have the real axis vertical to the screen with numbers running from top to bottom, and the imaginary axis horizontal to the screen with numbers running from left to right.

I have a 16 colors palette that resembles the article from Wikipedia on the Mandelbrot set. Each pixel is transformed from image coordinates into a number in the complex plane and compute the escape time for it. The color is then chosen using the number of iterations it took for z to escape the bounded region modulo 16 using a color lookup table. This process produces nasty color bands in our result.

To get rid of those a more complex approach is needed to smooth out the colors and create a gradient. The colors are chosen to be a convex combination of our palette with coefficients that are a function of both the module and the escape time for a given c. This algorithm is known as normalized iteration count.

Same tile after normalized iteration count algorithm.
With the service up and running, plugin it to Leaflet is straightforward. We need to add a tile layer to the simplest map that can be created.

```js
var map = L.map(‘map’).setView([0,0], 2);
 L.tileLayer(‘http://localhost:5000/mandelbrot/{z}/{x}/{y}', {
 maxZoom: 23
 }).addTo(map);
```

For performance reasons, the images are cached into the filesystem, so each tile needs to be computed only once. In this process the usual problem between time and space arises, a slow app that stores no information at all versus a fast app that takes a lot of disk space to hold its data. The complete code for the backend is available as a gist.

Leaflet is a very lightweight and reliable framework which was built to be extendable. It is open source and very mature. In this case, to keep things simple, I did not mess with the CRS that one and more features could be the subject of other posts.
