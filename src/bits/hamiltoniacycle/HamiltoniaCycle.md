# Hamiltonian Cycle

Part of the color space collection. This piece constructs two weighted lattices — one in the image plane, one in the RGB color cube — and traverses both simultaneously using a depth-first search algorithm that follows the path of least resistance through randomly assigned weights.

The resulting spanning trees determine both the spatial arrangement of pixels and their color assignments, creating a bijective mapping between position and hue that is entirely governed by the topology of the search. The random weights introduce controlled unpredictability: each execution produces a unique image, but the underlying structure — the tree's branching logic, its preference for low-cost edges — remains legible in the visual patterns that emerge. Gradients form where the algorithm found smooth paths through color space; sharp transitions mark the boundaries where it was forced to backtrack.
