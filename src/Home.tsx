import React, {
    Fragment,
    useEffect,
    useMemo,
    useState,
    useContext,
    lazy,
    Suspense,
} from 'react'
import { Navigate, Routes, Route, Outlet, useLocation } from 'react-router-dom'
import Menu from './Menu'
import { useViewport } from './Hooks'

const Bolero = lazy(() => import('./bits/bolero/Bolero'))
const Quilt = lazy(() => import('./bits/quilt/Quilt'))
const Autostereogram = lazy(
    () => import('./bits/autostereogram/Autostereogram')
)
const Colors = lazy(() => import('./bits/colors/Colors'))
const Distrito = lazy(() => import('./bits/distrito/Distrito'))
const Conway = lazy(() => import('./bits/conway/Conway'))
const Animation = lazy(() => import('./util/Animation'))
const Loom = lazy(() => import('./bits/loom/Loom'))
const Mandelbrot = lazy(() => import('./bits/mandelbrot/Mandelbrot'))
const Photography = lazy(() => import('./bits/photography/Photography'))
const Voronoi = lazy(() => import('./bits/voronoi/Voronoi'))
const Reinforcement = lazy(() => import('./bits/reinforcement/Reinforcement'))
const Stereo = lazy(() => import('./bits/stereo/Stereo'))
const Nostalgia = lazy(() => import('./bits/nostalgia/Nostalgia'))
const Corrupted = lazy(() => import('./bits/corrupted/Corrupted'))
const Anaglyph = lazy(() => import('./bits/anaglyph/Anaglyph'))
const Penrose = lazy(() => import('./bits/penrose/Penrose'))
const TravelingSalesman = lazy(
    () => import('./bits/travelingsalesman/TravelingSalesman')
)

import Then from './Then'
import Navigation from './Navigation'
import Blog from './Blog'
import Post from './Post'

import './Home.css'
import './Blog.css'

import autostereogram from './bits/autostereogram/Autostereogram.md'
import distrito from './bits/distrito/Distrito.md'
import bolero from './bits/bolero/Bolero.md'
import loom from './bits/loom/Loom.md'
import conway from './bits/conway/Conway.md'
import photography from './bits/photography/Photography.md'
import mandelbrot from './bits/mandelbrot/Mandelbrot.md'
import voronoi from './bits/voronoi/Voronoi.md'
import quilt from './bits/quilt/Quilt.md'
import reinforcement from './bits/reinforcement/Reinforcement.md'
import nostalgia from './bits/nostalgia/Nostalgia.md'
import corrupted from './bits/corrupted/Corrupted.md'
import anaglyph from './bits/anaglyph/Anaglyph.md'
import penrose from './bits/penrose/Penrose.md'
import travelingSalesman from './bits/travelingsalesman/TravelingSalesman.md'

import floodFill from './bits/floodfill/FloodFill.md'
import hamiltoniaCycle from './bits/hamiltoniacycle/HamiltoniaCycle.md'
import hilbert from './bits/hilbert/Hilbert.md'
import identity from './bits/identity/Identity.md'
import morton from './bits/morton/Morton.md'
import quadtree from './bits/quadtree/Quadtree.md'
import random from './bits/random/Random.md'
import simulatedAnnealing from './bits/simulatedannealing/SimulatedAnnealing.md'

import stereo from './bits/stereo/Stereo.md'

import { ThemeContext } from './ThemeContext'
import Slider from './Slider'
import ReactMarkdown from 'react-markdown'
import BitView from './BitView'

import ReactGA from 'react-ga4'

const GA_ID = import.meta.env.VITE_GA_ID
const API_HOST = import.meta.env.VITE_API_HOST

if (GA_ID) {
    ReactGA.initialize(GA_ID)
}

const banditHost = API_HOST

const presentationTime = 0

const dataMapping = {
    'flood-fill': floodFill,
    'hamiltonian-cycle': hamiltoniaCycle,
    hilbert: hilbert,
    identity: identity,
    morton: morton,
    quadtree: quadtree,
    random: random,
    'simulated-annealing': simulatedAnnealing,
}

const buildStaticMapping = (width, height) => ({
    '/penrose': {
        content: penrose,
        component: (
            <Penrose
                title="penrose"
                style={{}}
                delay={presentationTime}
                width={width}
                height={height}
            />
        ),
    },

    '/nostalgia': {
        content: nostalgia,
        component: (
            <Nostalgia
                title="nostalgia"
                style={{}}
                delay={presentationTime}
                width={width}
                height={height}
            />
        ),
    },

    '/corrupted': {
        content: corrupted,
        component: (
            <Corrupted
                title="corrupted"
                style={{}}
                delay={presentationTime}
                width={1080}
                height={1080}
            />
        ),
    },

    '/mandelbrot': {
        content: mandelbrot,
        component: (
            <Mandelbrot
                title="mandelbrot"
                style={{}}
                delay={presentationTime}
                width={width}
                height={height}
            />
        ),
    },

    '/voronoi': {
        content: voronoi,
        component: (
            <Voronoi
                title="voronoi"
                style={{}}
                delay={presentationTime}
                width={width}
                height={height}
            />
        ),
    },

    '/stereo': {
        content: stereo,
        component: (
            <Stereo
                title="stereo"
                style={{}}
                delay={presentationTime}
                width={width}
                height={height}
            />
        ),
    },

    '/reinforcement-learning': {
        content: reinforcement,
        component: (
            <Reinforcement
                title="reinforcement learning"
                style={{ height: height + 'px' }}
                delay={presentationTime}
                width={width}
                height={height}
            />
        ),
    },

    '/conway': {
        content: conway,
        component: (
            <Conway
                title="conway"
                style={{}}
                delay={presentationTime}
                width={width}
                height={height}
            />
        ),
    },

    '/1986': {
        content: distrito,
        component: (
            <Distrito
                title="1986"
                style={{}}
                delay={presentationTime}
                width={width}
                height={height}
            />
        ),
    },
    '/autostereogram': {
        content: autostereogram,
        component: (
            <Autostereogram
                title="autostereogram"
                delay={presentationTime}
                style={{}}
                width={width}
                height={height}
            />
        ),
    },

    '/loom': {
        content: loom,
        component: (
            <Loom
                title="loom"
                delay={presentationTime}
                style={{}}
                width={width}
                height={height}
            />
        ),
    },

    '/quilt': {
        content: quilt,
        component: (
            <Quilt
                title="quilt"
                delay={presentationTime}
                style={{}}
                width={width}
                height={height}
            />
        ),
    },

    '/anaglyph': {
        content: anaglyph,
        component: (
            <Anaglyph
                title="anaglyph"
                style={{}}
                delay={presentationTime}
                width={width}
                height={height}
            />
        ),
    },
})

const Container = (props) => {
    return (
        <Fragment>
            <div
                className={`Background${
                    props.viewMode === 'studio' ? ' studio' : ''
                }`}
                key={props.backgroundKey}
            >
                <Suspense fallback={null}>{props.background}</Suspense>
            </div>
            <Outlet />
            <div className="Home-slider">
                <Slider />
            </div>
        </Fragment>
    )
}

const BitMenu = (props) => {
    return (
        <Menu
            options={Object.keys(props.mapping)}
            style={{ backgroundColor: 'transparent' }}
            setIndexBackground={props.setIndexBackground}
        ></Menu>
    )
}

const markdown = `
# this is a markdown header
`

const Home = (props) => {
    const [indexBackground, setIndexBackground] = useState(null)
    const theme = useContext(ThemeContext)
    const viewport = useViewport()
    const [markdownContent, setMardownContent] = useState('')
    const [viewMode, setViewMode] = useState<'gallery' | 'studio'>('gallery')
    const squareSampling = 100
    const numberColors = 500
    const location = useLocation()

    let [konami, setKonami] = useState(0)
    let code = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]

    // let debouncedShowMenu = useDebounce(showMenu, 5000);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.keyCode === code[konami] && konami + 1 < code.length) {
                setKonami(konami + 1)
            } else {
                if (konami + 1 === code.length) {
                    theme.toggleTheme('konami')
                }
                setKonami(0)
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => {
            window.removeEventListener('keydown', handleKeyPress)
        }
    }, [konami])

    useEffect(() => {
        const fetchMarkdown = async (key) => {
            try {
                const response = await fetch(mapping[key].content)
                const text = await response.text()
                setMardownContent(text)
            } catch {
                console.error('Error fecthing markdown.')
            }
        }
        if (location && location.pathname.startsWith('/bit')) {
            const bit = location.pathname.split('/bit')[1]
            fetchMarkdown(bit)
            setIndexBackground(bit)
            setViewMode('gallery')
        }
    }, [location])

    const mapping = useMemo(() => {
        let newMapping = buildStaticMapping(viewport.width, viewport.height)

        if (props.masterData.bolero && props.masterData.bolero.length) {
            newMapping['/bolero'] = {
                content: bolero,
                component: (
                    <Bolero
                        title="bolero"
                        style={{}}
                        delay={presentationTime}
                        width={viewport.width}
                        height={viewport.height}
                        sentence={props.masterData.bolero}
                    />
                ),
            }
        }

        if (
            props.masterData.travelingSalesmanColors &&
            props.masterData.travelingSalesmanColors.length
        ) {
            newMapping['/colors'] = {
                content: travelingSalesman,
                component: (
                    <Colors
                        title="colors"
                        delay={presentationTime}
                        style={{}}
                        width={viewport.width}
                        height={viewport.height}
                        colors={props.masterData.travelingSalesmanColors}
                    />
                ),
            }
        }

        if (props.masterData.colorsData && props.masterData.colorsData.data) {
            let colorsDataMapping = props.masterData.colorsData.data.reduce(
                (m, element) => {
                    m[`/${element.slug}`] = {
                        content: dataMapping[element.slug],
                        component: (
                            <Animation
                                title={element.slug}
                                style={{}}
                                delay={presentationTime}
                                width={viewport.width}
                                height={viewport.height}
                                res={element.resolution}
                                square={element.square}
                                cube={element.cube}
                            />
                        ),
                    }
                    return m
                },
                {}
            )

            newMapping = { ...newMapping, ...colorsDataMapping }
        }

        if (
            props.masterData.photography &&
            props.masterData.photography.length
        ) {
            newMapping['/photography'] = {
                content: photography,
                component: (
                    <Photography
                        title="photography"
                        style={{}}
                        delay={presentationTime}
                        width={viewport.width}
                        height={viewport.height}
                        data={props.masterData.photography}
                        rows={1}
                    />
                ),
            }
        }

        if (
            props.masterData.travelingSalesmanData &&
            props.masterData.travelingSalesmanData.cities &&
            props.masterData.travelingSalesmanData.hasFetched
        ) {
            newMapping['/traveling-salesman'] = {
                content: travelingSalesman,
                component: (
                    <TravelingSalesman
                        title="traveling salesman"
                        style={{}}
                        delay={presentationTime}
                        width={viewport.width}
                        height={viewport.height}
                        cities={props.masterData.travelingSalesmanData}
                        numberColors={numberColors}
                        squareSampling={squareSampling}
                    />
                ),
            }
        }

        return newMapping
    }, [props.masterData, viewport])

    return (
        <div
            className="Home"
            style={{
                background: theme.theme.background,
                color: theme.theme.foreground,
                width: '100vw',
                height: '100vh',
            }}
        >
            <Routes>
                <Route
                    path="/"
                    element={
                        <Container
                            backgroundKey={indexBackground}
                            background={
                                indexBackground === null ||
                                mapping[indexBackground] === undefined
                                    ? null
                                    : mapping[indexBackground].component
                            }
                        />
                    }
                >
                    <Route
                        path="/"
                        element={
                            <Then
                                keys={Object.keys(mapping)}
                                setIndexBackground={setIndexBackground}
                            />
                        }
                    />
                </Route>
                <Route
                    path="/bits"
                    element={
                        <Container
                            backgroundKey={indexBackground}
                            background={
                                indexBackground === null ||
                                mapping[indexBackground] === undefined
                                    ? null
                                    : mapping[indexBackground].component
                            }
                        />
                    }
                >
                    <Route
                        path="/bits"
                        element={
                            <BitMenu
                                mapping={mapping}
                                setIndexBackground={setIndexBackground}
                            />
                        }
                    />
                </Route>
                <Route
                    path="/bit"
                    element={
                        <Container
                            background={
                                indexBackground === null ||
                                mapping[indexBackground] === undefined
                                    ? null
                                    : mapping[indexBackground].component
                            }
                            viewMode={viewMode}
                        />
                    }
                >
                    {mapping &&
                        Object.entries(mapping).map(([key, value]) => {
                            const codeEntry = props.masterData.codes?.find(
                                (c) => c.redirect === key
                            )
                            return (
                                <Route
                                    key={key}
                                    path={`/bit/${key}`}
                                    element={
                                        <BitView
                                            content={markdownContent}
                                            title={key
                                                .slice(1)
                                                .replace(/-/g, ' ')}
                                            shortCode={codeEntry?.code || null}
                                            mode={viewMode}
                                            onToggle={() =>
                                                setViewMode((m) =>
                                                    m === 'gallery'
                                                        ? 'studio'
                                                        : 'gallery'
                                                )
                                            }
                                        />
                                    }
                                />
                            )
                        })}
                </Route>
                <Route
                    path="/blog"
                    element={
                        <Blog title={'Else'} url={`${banditHost}/posts`} />
                    }
                />
                <Route
                    path="/post/:slug"
                    element={<Post url={`${banditHost}/post`} />}
                />
                {props.masterData.codes &&
                    props.masterData.codes.map((element, index) => (
                        <Route
                            key={index}
                            path={element.code}
                            element={
                                <Navigate
                                    replace
                                    to={
                                        element.redirect
                                            ? `/bit/${element.redirect}`
                                            : '/'
                                    }
                                />
                            }
                        />
                    ))}
            </Routes>
            <Navigation />
        </div>
    )
}

export default Home
