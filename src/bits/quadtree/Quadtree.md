# Quadtree

As part of the collection exploring captivating representations of digital color spaces, this piece employs the hierarchical data structures of quadtrees and octrees. These tree-based data structures provide an efficient way to subdivide and organize spatial data in two and three dimensions, respectively.

In the case of the quadtree, the two-dimensional image plane is recursively partitioned into quadrants, with each quadrant containing a unique set of pixels. This hierarchical subdivision continues until a desired level of granularity is achieved, allowing for efficient storage and retrieval of pixel data.

Similarly, the octree organizes the three-dimensional RGB color space by recursively subdividing it into eight octants, each representing a distinct subset of color values. This hierarchical partitioning provides a structured approach to mapping colors onto the image canvas.

The mapping process begins by traversing the quadtree and octree data structures in a synchronized manner. As the algorithm explores the quadtree, it assigns color values from the corresponding octree nodes to the respective pixels within each quadrant.

The resulting image is a captivating visualization of the interplay between spatial and color data, where the hierarchical organization of the quadtree and octree is reflected in the intricate patterns and arrangements of colors on the canvas. This piece not only showcases the power of tree-based data structures in organizing and visualizing complex data but also invites viewers to explore the intricate relationships between spatial subdivisions and the vast expanse of the color spectrum.

By combining the principles of hierarchical data structures and the representation of color spaces, this work offers a unique perspective on the intersection of computer science concepts and artistic expression, creating a visually striking and intellectually stimulating experience for the viewer.