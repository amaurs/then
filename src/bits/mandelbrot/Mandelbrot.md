# Mandelbrot

The fractal can be thought of a escape time heatmap for points in the complex plane.

For each point *c* in the complex plane, we iterate the function *z = z² + c* starting from *z = 0*. If the magnitude of *z* stays bounded (never exceeds 2) after a large number of iterations, the point is considered part of the Mandelbrot set and is colored black. If it escapes, the number of iterations it took to diverge determines the color — creating the intricate, infinitely detailed boundary we see.

The boundary of the set is where the magic lives. Zooming into any region along the edge reveals self-similar structures at every scale — spirals, seahorses, miniature copies of the full set, and filaments of extraordinary complexity. This infinite detail from such a simple formula is what makes the Mandelbrot set one of the most celebrated objects in mathematics.

This implementation renders the set by sampling each pixel as a point in the complex plane, iterating the escape function, and mapping the iteration count to a color gradient. The resolution and color palette can be adjusted to explore different regions and aesthetic treatments of the fractal.

The color mapping uses a smooth gradient based on the normalized iteration count, avoiding the banding artifacts that occur with discrete coloring. Each pixel's hue is determined by how quickly its corresponding point escapes to infinity, producing the characteristic warm-to-cool transitions that trace the fractal's boundary.

What makes this piece particularly interesting is the relationship between computation and aesthetics. Every pixel represents a mathematical question — does this point escape or not? — and the answer, rendered millions of times across the canvas, produces an image of surprising organic beauty. The Mandelbrot set sits at the intersection of determinism and apparent chaos, where simple rules generate infinite complexity.
