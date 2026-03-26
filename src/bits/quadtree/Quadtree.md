# Quadtree

Part of the color space collection. Quadtrees and octrees — hierarchical data structures that recursively subdivide space into four and eight partitions respectively — are here used to simultaneously organize the image plane and the RGB color cube. The quadtree partitions the canvas into nested quadrants; the octree partitions color space into nested octants. Synchronized traversal of both trees maps colors to pixels according to their shared position in the hierarchy.

The resulting image bears the unmistakable signature of recursive subdivision: large blocks of similar color containing smaller blocks of finer variation, producing a mosaic that is simultaneously coarse and detailed. The piece makes visible the trade-off at the heart of all hierarchical data structures — the tension between the efficiency of broad partitioning and the precision of deep subdivision.
