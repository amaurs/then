# Hamiltonian Cycle

As part of the collection exploring captivating representations of digital color spaces, this particular piece takes a unique approach by employing a depth-first search algorithm on weighted lattices. The process begins by constructing two lattices: one in the two-dimensional plane and another in the three-dimensional RGB color space.

Each node in these lattices is assigned a random weight, creating a weighted graph structure. Utilizing the depth-first search algorithm, a spanning tree is constructed by traversing the lattices, following the path of least resistance dictated by the weights.

The resulting spanning tree in the 2D plane determines the order and arrangement of pixels within the image canvas, while the corresponding tree in the 3D color space maps each pixel to a specific RGB color value. As the algorithm explores the lattices, it simultaneously traverses both spaces, creating a continuous path that connects every pixel to its respective color.

The final image is a captivating representation of the digital color space, where the arrangement of colors is dictated by the intricate structure of the spanning trees. The random weights introduce an element of unpredictability, resulting in a unique and visually striking pattern that celebrates the interplay between algorithmic processes and the vast expanse of the color spectrum.

This piece not only showcases the power of graph algorithms in organizing and visualizing complex data but also invites viewers to explore the intricate relationships between colors and their spatial arrangements, offering a fresh perspective on the intersection of mathematics, computer science, and art.
