import React, { useRef, useContext, useEffect } from 'react'
import ColorBoard from '../../ColorBoard'
import './Loom.css'
import CSS from 'csstype'
import { ThemeContext } from '../../ThemeContext'

const canvasSize = 1000
const squareSize = 10

interface Props {
    title: string
    delay: number
    style: CSS.Properties
    width: number
    height: number
}

interface WeavePattern {
    name: string
    shafts: number
    treadles: number
    // Threading sequence: which shaft each warp thread goes through
    threading: number[]
    // Treadling sequence: which treadle is pressed for each weft row
    treadling: number[]
    // Tie-up: [treadle][shaft] — which shafts each treadle lifts
    tieup: number[][]
}

// Classic patterns from weaving literature

const plainWeave: WeavePattern = {
    name: 'Plain Weave',
    shafts: 2,
    treadles: 2,
    threading: [0, 1],
    treadling: [0, 1],
    tieup: [
        [1, 0],
        [0, 1],
    ],
}

// 2/2 Twill — the classic diagonal, used in denim
const twill22: WeavePattern = {
    name: '2/2 Twill',
    shafts: 4,
    treadles: 4,
    threading: [0, 1, 2, 3],
    treadling: [0, 1, 2, 3],
    tieup: [
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 1],
        [1, 0, 0, 1],
    ],
}

// Point Twill — diamond/zigzag pattern
const pointTwill: WeavePattern = {
    name: 'Point Twill',
    shafts: 6,
    treadles: 6,
    threading: [0, 1, 2, 3, 4, 5, 4, 3, 2, 1],
    treadling: [0, 1, 2, 3, 4, 5, 4, 3, 2, 1],
    tieup: [
        [1, 1, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 0],
        [0, 0, 0, 0, 1, 1],
        [1, 0, 0, 0, 0, 1],
    ],
}

// Rosepath — a traditional Swedish pattern
const rosepath: WeavePattern = {
    name: 'Rosepath',
    shafts: 4,
    treadles: 6,
    threading: [0, 1, 2, 3, 2, 1],
    treadling: [0, 1, 2, 3, 4, 5, 4, 3, 2, 1],
    tieup: [
        [1, 0, 1, 0],
        [0, 1, 0, 1],
        [1, 1, 0, 0],
        [0, 0, 1, 1],
        [0, 1, 1, 0],
        [1, 0, 0, 1],
    ],
}

// Huck Lace — an openwork pattern
const huckLace: WeavePattern = {
    name: 'Huck Lace',
    shafts: 4,
    treadles: 4,
    threading: [0, 1, 0, 2, 3, 2],
    treadling: [0, 1, 0, 2, 3, 2],
    tieup: [
        [1, 0, 0, 1],
        [0, 1, 1, 0],
        [1, 0, 1, 0],
        [0, 1, 0, 1],
    ],
}

// 5-shaft Satin — smooth surface, minimal interlacing
const satin5: WeavePattern = {
    name: '5-Shaft Satin',
    shafts: 5,
    treadles: 5,
    threading: [0, 1, 2, 3, 4],
    treadling: [0, 2, 4, 1, 3],
    tieup: [
        [1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 0, 1],
    ],
}

const patterns = [pointTwill, twill22, rosepath, huckLace, satin5, plainWeave]

function buildThreading(
    pattern: WeavePattern,
    width: number,
    colors: number[][]
): ColorBoard {
    const board = new ColorBoard(width, pattern.shafts)
    for (let i = 0; i < width; i++) {
        const shaft = pattern.threading[i % pattern.threading.length]
        board.setXY(i, shaft, colors[shaft % colors.length])
    }
    return board
}

function buildTreadling(
    pattern: WeavePattern,
    height: number,
    colors: number[][]
): ColorBoard {
    const board = new ColorBoard(pattern.treadles, height)
    for (let j = 0; j < height; j++) {
        const treadle = pattern.treadling[j % pattern.treadling.length]
        board.setXY(treadle, j, colors[treadle % colors.length])
    }
    return board
}

function buildTieup(pattern: WeavePattern, color: number[]): ColorBoard {
    const board = new ColorBoard(pattern.treadles, pattern.shafts)
    for (let t = 0; t < pattern.treadles; t++) {
        for (let s = 0; s < pattern.shafts; s++) {
            if (pattern.tieup[t][s]) {
                board.setXY(t, s, color)
            }
        }
    }
    return board
}

const Loom = (props: Props) => {
    let canvas = useRef<HTMLCanvasElement>(document.createElement('canvas'))
    const theme = useContext(ThemeContext)

    useEffect(() => {
        let timeoutId: any
        let step = 0
        const cycleEvery = 100

        // Apply theme color matrix to an [r,g,b] color
        const applyTheme = (c: number[]): number[] => {
            const m = theme.theme.colorMatrix
            if (!m) return c
            const [r, g, b] = c
            return [
                Math.min(
                    255,
                    Math.max(
                        0,
                        Math.floor(
                            m[0] * r +
                                m[1] * g +
                                m[2] * b +
                                m[3] * 255 +
                                m[4] * 255
                        )
                    )
                ),
                Math.min(
                    255,
                    Math.max(
                        0,
                        Math.floor(
                            m[5] * r +
                                m[6] * g +
                                m[7] * b +
                                m[8] * 255 +
                                m[9] * 255
                        )
                    )
                ),
                Math.min(
                    255,
                    Math.max(
                        0,
                        Math.floor(
                            m[10] * r +
                                m[11] * g +
                                m[12] * b +
                                m[13] * 255 +
                                m[14] * 255
                        )
                    )
                ),
            ]
        }

        const warpColorsBase: number[][] = [
            [255, 60, 60],
            [60, 200, 255],
            [255, 220, 50],
            [100, 255, 100],
            [200, 100, 255],
            [255, 150, 50],
        ]

        const weftColorsBase: number[][] = [
            [50, 100, 255],
            [255, 80, 180],
            [80, 255, 180],
            [255, 200, 60],
            [180, 80, 255],
            [255, 120, 60],
            [60, 220, 220],
        ]

        const tieupColor = applyTheme([200, 200, 200])
        const warpColors = warpColorsBase.map(applyTheme)
        const weftColors = weftColorsBase.map(applyTheme)

        // Pick random parts from different patterns to combine
        function randomCombo(): WeavePattern {
            const a = patterns[Math.floor(Math.random() * patterns.length)]
            const b = patterns[Math.floor(Math.random() * patterns.length)]
            const c = patterns[Math.floor(Math.random() * patterns.length)]
            // Use max shafts/treadles to fit all parts
            const shafts = Math.max(a.shafts, b.shafts, c.shafts)
            const treadles = Math.max(a.treadles, b.treadles, c.treadles)
            // Threading from a, treadling from b, tieup from c
            // Pad tieup to fit dimensions
            const tieup: number[][] = []
            for (let t = 0; t < treadles; t++) {
                const row: number[] = []
                for (let s = 0; s < shafts; s++) {
                    const ct = t % c.treadles
                    const cs = s % c.shafts
                    row.push(c.tieup[ct][cs])
                }
                tieup.push(row)
            }
            return {
                name: `${a.name}+${b.name}+${c.name}`,
                shafts,
                treadles,
                threading: a.threading.map((s) => s % shafts),
                treadling: b.treadling.map((t) => t % treadles),
                tieup,
            }
        }

        let currentPat = randomCombo()

        const animate = () => {
            timeoutId = setTimeout(function () {
                const context = canvas.current.getContext('2d')!
                context.clearRect(
                    0,
                    0,
                    canvas.current.width,
                    canvas.current.height
                )

                if (step > 0 && step % cycleEvery === 0) {
                    currentPat = randomCombo()
                }

                const pat = currentPat
                const gridSize = canvasSize / squareSize
                const weaveWidth = gridSize - pat.treadles
                const weaveHeight = gridSize - pat.shafts

                const shiftedPat = {
                    ...pat,
                    threading: pat.threading.map(
                        (s) => (s + Math.floor(step / 5)) % pat.shafts
                    ),
                    treadling: pat.treadling.map(
                        (t) => (t + Math.floor(step / 3)) % pat.treadles
                    ),
                }

                if (Math.random() < 0.1) {
                    const idx = Math.floor(
                        Math.random() * shiftedPat.threading.length
                    )
                    shiftedPat.threading[idx] = Math.floor(
                        Math.random() * pat.shafts
                    )
                }

                const threading = buildThreading(
                    shiftedPat,
                    weaveWidth,
                    warpColors
                )
                const treadling = buildTreadling(
                    shiftedPat,
                    weaveHeight,
                    weftColors
                )
                const tieup = buildTieup(pat, tieupColor)

                const weave = treadling
                    .multiply(tieup.transpose())
                    .multiply(threading)

                threading.printContextOffset(context, squareSize, 0, 0)
                treadling.printContextOffset(
                    context,
                    squareSize,
                    gridSize - pat.treadles,
                    pat.shafts
                )
                tieup.printContextOffset(
                    context,
                    squareSize,
                    gridSize - pat.treadles,
                    0
                )
                weave.printContextOffset(context, squareSize, 0, pat.shafts)

                step++

                frameId = requestAnimationFrame(animate)
            }, 1000 / 10)
        }

        let frameId: number | null = requestAnimationFrame(animate)
        return () => {
            cancelAnimationFrame(frameId!)
            clearTimeout(timeoutId)
            frameId = null
        }
    }, [theme])

    let style = {}
    if (props.width > 0 && props.height > 0) {
        style =
            props.width / props.height < 1
                ? { width: '100vw' }
                : { height: '100vh' }
    }

    return (
        <canvas
            className="Loom"
            ref={canvas}
            style={style}
            width={canvasSize}
            height={canvasSize}
        />
    )
}

export default Loom
