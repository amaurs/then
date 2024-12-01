import React, { Fragment, useEffect, useState, useContext } from 'react'
import { Navigate, Routes, Route, Outlet, useLocation } from 'react-router-dom'
import Menu from './Menu.js'

import Bolero from './bits/bolero/Bolero.tsx'
import Quilt from './bits/quilt/Quilt.tsx'

import Autostereogram from './bits/autostereogram/Autostereogram.tsx'
import Colors from './bits/colors/Colors.tsx'
import Distrito from './bits/distrito/Distrito.tsx'

import Conway from './bits/conway/Conway.tsx'
import Animation from './util/Animation'
import Loom from './bits/loom/Loom.tsx'
import Mandelbrot from './bits/mandelbrot/Mandelbrot.tsx'
import Photography from './bits/photography/Photography.tsx'
import Voronoi from './bits/voronoi/Voronoi.tsx'
import Reinforcement from './bits/reinforcement/Reinforcement.tsx'
import Stereo from './bits/stereo/Stereo.tsx'
import Nostalgia from './bits/nostalgia/Nostalgia.tsx'
import Corrupted from './bits/corrupted/Corrupted.tsx'
import Anaglyph from './bits/anaglyph/Anaglyph.tsx'
import Penrose from './bits/penrose/Penrose.tsx'
import TravelingSalesman from './bits/travelingsalesman/TravelingSalesman.tsx'

import Then from './Then.tsx'
import Navigation from './Navigation.tsx'
import Blog from './Blog.tsx'
import Post from './Post.tsx'

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

import { ThemeContext } from './ThemeContext.js'
import Slider from './Slider.js'
import ReactMarkdown from 'react-markdown'

import ReactGA from 'react-ga4'

if (process.env.REACT_APP_GA_ID) {
    ReactGA.initialize(process.env.REACT_APP_GA_ID)
}

const banditHost = process.env.REACT_APP_API_HOST

const presentationTime = 0

const dataMapping = {
    "flood-fill": floodFill,            
    "hamiltonian-cycle": hamiltoniaCycle,
    "hilbert": hilbert,
    "identity": identity,
    "morton": morton,
    "quadtree": quadtree,
    "random": random,
    "simulated-annealing": simulatedAnnealing,
            
}

const oldMapping = {
    '/penrose': {
        content: penrose,
        component: (
            <Penrose
                title="penrose"
                style={{}}
                delay={presentationTime}
                width={window.innerWidth}
                height={window.innerHeight}
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
                width={window.innerWidth}
                height={window.innerHeight}
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
                width={window.innerWidth}
                height={window.innerHeight}
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
                width={window.innerWidth}
                height={window.innerHeight}
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
                width={window.innerWidth}
                height={window.innerHeight}
            />
        ),
    },

    '/reinforcement-learning': {
        content: reinforcement,
        component: (
            <Reinforcement
                title="reinforcement learning"
                style={{ height: window.innerHeight + 'px' }}
                delay={presentationTime}
                width={window.innerWidth}
                height={window.innerHeight}
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
                width={window.innerWidth}
                height={window.innerHeight}
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
                width={window.innerWidth}
                height={window.innerHeight}
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
                width={window.innerWidth}
                height={window.innerHeight}
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
                width={window.innerWidth}
                height={window.innerHeight}
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
                width={window.innerWidth}
                height={window.innerHeight}
            />
        ),
    },
}

const Container = (props) => {
    return (
        <Fragment>
            <div className="Background">{props.background}</div>
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
            setIsCursorOnMenu={props.setIsCursorOnMenu}
        ></Menu>
    )
}

const markdown = `
# this is a markdown header
`

const Home = (props) => {
    const [indexBackground, setIndexBackground] = useState(null)
    const [isCursorOnMenu, setIsCursorOnMenu] = useState(false)
    const theme = useContext(ThemeContext)
    const [mapping, setMapping] = useState(oldMapping)
    const [markdownContent, setMardownContent] = useState("")
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
                const response = await fetch(mapping[key].content);
                const text = await response.text();
                setMardownContent(text);
            } catch {
                console.error("Error fecthing markdown.");
            }
        }
        if (location && location.pathname.startsWith("/bit")) {
            const bit = location.pathname.split("/bit")[1];
            fetchMarkdown(bit);
            setIndexBackground(bit);
        }
    }, [location])

    

    useEffect(() => {
        let newMapping = {}

        if (
            props.masterData.anaglyph &&
            props.masterData.anaglyph.points &&
            props.masterData.anaglyph.points.length &&
            mapping['/anaglyph'] === undefined
        ) {
            newMapping['/anaglyph'] = {
                content: anaglyph,
                component: (
                    <Anaglyph
                        title="anaglyph"
                        style={{}}
                        delay={presentationTime}
                        width={window.innerWidth}
                        height={window.innerHeight}
                        anaglyphData={props.masterData.anaglyph}
                    />
                ),
            }
        }

        if (
            props.masterData.bolero &&
            props.masterData.bolero.length &&
            mapping['/bolero'] === undefined
        ) {
            newMapping['/bolero'] = {
                content: bolero,
                component: (
                    <Bolero
                        title="bolero"
                        style={{}}
                        delay={presentationTime}
                        width={window.innerWidth}
                        height={window.innerHeight}
                        sentence={props.masterData.bolero}
                    />
                ),
            }
        }

        if (
            props.masterData.travelingSalesmanColors &&
            props.masterData.travelingSalesmanColors.length &&
            mapping['/colors'] === undefined
        ) {
            newMapping['/colors'] = {
                content: travelingSalesman,
                component: (
                    <Colors
                        title="colors"
                        delay={presentationTime}
                        style={{}}
                        width={window.innerWidth}
                        height={window.innerHeight}
                        colors={props.masterData.travelingSalesmanColors}
                    />
                ),
            }
        }

        if (
            props.masterData.colorsData &&
            props.masterData.colorsData.data &&
            !props.masterData.colorsData.used
        ) {
            let colorsDataMapping = props.masterData.colorsData.data.reduce(
                (m, element) => {
                    m[`/${element.slug}`] = {
                        content: dataMapping[element.slug],
                        component: (
                            <Animation
                                title={element.slug}
                                style={{}}
                                delay={presentationTime}
                                width={window.innerWidth}
                                height={window.innerHeight}
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

            props.masterData.colorsData.used = true

            props.setMasterData(props.masterData)

            newMapping = { ...newMapping, ...colorsDataMapping }
        }

        if (
            props.masterData.photography &&
            props.masterData.photography.length &&
            mapping['/photography'] === undefined
        ) {
            newMapping['/photography'] = {
                content: photography,
                component: (
                    <Photography
                        title="photography"
                        style={{}}
                        delay={presentationTime}
                        width={window.innerWidth}
                        height={window.innerHeight}
                        data={props.masterData.photography}
                        rows={1}
                    />
                ),
            }
        }

        if (
            props.masterData.travelingSalesmanData &&
            props.masterData.travelingSalesmanData.cities &&
            props.masterData.travelingSalesmanData.hasFetched &&
            mapping['/traveling-salesman'] === undefined
        ) {
            newMapping['/traveling-salesman'] = {
                content: travelingSalesman,
                component: (
                    <TravelingSalesman
                        title="traveling salesman"
                        style={{}}
                        delay={presentationTime}
                        width={window.innerWidth}
                        height={window.innerHeight}
                        cities={props.masterData.travelingSalesmanData}
                        numberColors={numberColors}
                        squareSampling={squareSampling}
                    />
                ),
            }
        }

        if (Object.keys(newMapping).length) {
            setMapping({ ...mapping, ...newMapping })
        }
    }, [props.masterData, mapping])

    if (props.masterData.codes === undefined) {
        return null
    }

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
                                    isCursorOnMenu={isCursorOnMenu}
                                />
                        }
                    />
                </Route>
                <Route
                    path="/bits"
                    element={
                        <Container
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
                                    setIsCursorOnMenu={setIsCursorOnMenu}
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
                        />
                    }
                >
                {mapping && Object.entries(mapping).map(([key, value]) => (
                    <Route
                        path={`/bit/${key}`} 
                        element={<ReactMarkdown className="Description">{markdownContent}</ReactMarkdown>}
                    />
                ))}
                </Route>
                <Route
                    path="/blog" 
                    element={
                        <Blog
                            title={'Else'}
                            url={`${banditHost}/posts`}
                        />
                    }
                />
                <Route
                    path="/post/:slug"
                    element={<Post url={`${banditHost}/post`} />}
                />
                {props.masterData.codes.map((element, index) => (
                    <Route
                        key={index}
                        path={element.code}
                        element={
                            <Navigate
                                replace
                                to={
                                    element.redirect
                                        ? `/bits/${element.redirect}`
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
