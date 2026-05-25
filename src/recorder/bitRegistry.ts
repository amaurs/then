import { lazy, LazyExoticComponent, ComponentType } from 'react'

export interface BitProps {
    title: string
    delay: number
    style: React.CSSProperties
    width: number
    height: number
}

export interface RecordableBit {
    slug: string
    name: string
    Component: LazyExoticComponent<ComponentType<any>>
    extraProps?: Record<string, unknown>
}

const animationBit = (slug: string, res: string): RecordableBit => ({
    slug,
    name: slug,
    Component: lazy(() => import('../util/Animation')),
    extraProps: {
        res,
        square: `/colors/${slug}/${res}/square.png`,
        cube: `/colors/${slug}/${res}/cube.png`,
    },
})

export const recordableBits: RecordableBit[] = [
    {
        slug: 'conway',
        name: 'conway',
        Component: lazy(() => import('../bits/conway/Conway')),
    },
    {
        slug: 'voronoi',
        name: 'voronoi',
        Component: lazy(() => import('../bits/voronoi/Voronoi')),
    },
    {
        slug: 'mandelbrot',
        name: 'mandelbrot',
        Component: lazy(() => import('../bits/mandelbrot/Mandelbrot')),
    },
    {
        slug: 'loom',
        name: 'loom',
        Component: lazy(() => import('../bits/loom/Loom')),
    },
    {
        slug: 'quilt',
        name: 'quilt',
        Component: lazy(() => import('../bits/quilt/Quilt')),
    },
    {
        slug: 'anaglyph',
        name: 'anaglyph',
        Component: lazy(() => import('../bits/anaglyph/Anaglyph')),
    },
    {
        slug: 'stereo',
        name: 'stereo',
        Component: lazy(() => import('../bits/stereo/Stereo')),
    },
    {
        slug: 'autostereogram',
        name: 'autostereogram',
        Component: lazy(() => import('../bits/autostereogram/Autostereogram')),
    },
    {
        slug: 'nostalgia',
        name: 'nostalgia',
        Component: lazy(() => import('../bits/nostalgia/Nostalgia')),
    },
    {
        slug: '1986',
        name: '1986',
        Component: lazy(() => import('../bits/distrito/Distrito')),
    },
    {
        slug: 'gridworld',
        name: 'gridworld',
        Component: lazy(() => import('../bits/reinforcement/Reinforcement')),
    },
    {
        slug: 'penrose',
        name: 'penrose',
        Component: lazy(() => import('../bits/penrose/Penrose')),
    },
    {
        slug: 'corrupted',
        name: 'corrupted',
        Component: lazy(() => import('../bits/corrupted/Corrupted')),
    },
    animationBit('flood-fill', '64'),
    animationBit('hamiltonian-cycle', '512'),
    animationBit('hilbert', '512'),
    animationBit('identity', '512'),
    animationBit('morton', '512'),
    animationBit('quadtree', '512'),
    animationBit('random', '512'),
    animationBit('simulated-annealing', '512'),
    {
        slug: 'colors',
        name: 'colors',
        Component: lazy(() =>
            import('./backendBits').then((m) => ({ default: m.ColorsBit }))
        ),
    },
    {
        slug: 'traveling-salesman',
        name: 'traveling salesman',
        Component: lazy(() =>
            import('./backendBits').then((m) => ({
                default: m.TravelingSalesmanBit,
            }))
        ),
    },
]
