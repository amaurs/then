# Penrose

Roger Penrose's aperiodic tilings — patterns that fill the plane without ever repeating — occupy a strange position between order and disorder. They obey strict local rules yet produce global structures that never settle into periodicity. This piece generates Penrose tilings through successive inflations, subdividing triangles into smaller triangles according to the golden ratio.

The implementation confronts a series of geometric challenges: triangles produced by inflation must be reoriented via cross products, deeper levels of recursion must be computed efficiently, and the rendering — using Three.js BufferGeometry with per-vertex coloring — must handle the resulting complexity without abstraction layers. The piece is as much about the craft of computation as it is about the mathematics of aperiodicity.
