import React, {
    Fragment,
    useEffect,
    useState,
    useContext,
    onEffect,
} from "react";
import {
    Link,
    useLocation,
    Navigate,
    useNavigate,
    useParams,
    Routes,
    Route,
    Outlet,
} from "react-router-dom";
import Menu from "./Menu.js";

import Anaglyph from "./projects/anaglyph/Anaglyph.tsx";
import Bolero from "./projects/bolero/Bolero.tsx";
import Quilt from "./projects/quilt/Quilt.tsx";

import Autostereogram from "./projects/autostereogram/Autostereogram.tsx";
import Colors from "./projects/colors/Colors.tsx";
import Distrito from "./projects/distrito/Distrito.tsx";

import Conway from "./projects/conway/Conway.tsx";
import Dense from "./projects/dense/Dense.tsx";
import Loom from "./projects/loom/Loom.tsx";
import Mandelbrot from "./projects/mandelbrot/Mandelbrot.tsx";
import Photography from "./projects/photography/Photography.tsx";
import Voronoi from "./projects/voronoi/Voronoi.tsx";
import Reinforcement from "./projects/reinforcement/Reinforcement.tsx";
import Stereo from "./projects/stereo/Stereo.tsx";
import Hilbert from "./projects/hilbert/Hilbert.tsx";
import Corrupted from "./projects/corrupted/Corrupted.tsx";

import Then from "./Then.tsx";
import TravelingSalesman from "./projects/travelingsalesman/TravelingSalesman.tsx";

import Loader from "./Loader.js";
import ReactMarkdown from "react-markdown";

import "./Home.css";

import anaglyph from "./projects/anaglyph/Anaglyph.md";
import autostereogram from "./projects/autostereogram/Autostereogram.md";
import colors from "./projects/colors/Colors.md";
import distrito from "./projects/distrito/Distrito.md";
import bolero from "./projects/bolero/Bolero.md";
import dense from "./projects/dense/Dense.md";
import loom from "./projects/loom/Loom.md";
import conway from "./projects/conway/Conway.md";
import photography from "./projects/photography/Photography.md";
import mandelbrot from "./projects/mandelbrot/Mandelbrot.md";
import voronoi from "./projects/voronoi/Voronoi.md";
import hilbert from "./projects/hilbert/Hilbert.md";
import corrupt from "./projects/corrupted/Corrupted.md";
import reinforcement from "./projects/reinforcement/Reinforcement.md";
import quilt from "./projects/quilt/Quilt.md";
import travelingSalesman from "./projects/travelingsalesman/TravelingSalesman.md";

import about from "./About.md";
import stereo from "./projects/stereo/Stereo.md";

import { ThemeContext } from "./ThemeContext.js";
import Slider from "./Slider.js";

import { useTimeout } from "./Hooks.js";

const presentationTime = 0;

const banditHost = process.env.REACT_APP_API_BANDIT_HOST;

const mapping = {
    "/bolero": {
        content: bolero,
        component: (
            <Bolero
                title="bolero"
                style={{}}
                delay={presentationTime}
                width={window.innerWidth}
                height={window.innerHeight}
                url={banditHost + "/boleros/en"}
            />
        ),
    },
    "/dense": {
        content: dense,
        component: (
            <Dense
                title="dense"
                style={{}}
                delay={presentationTime}
                width={window.innerWidth}
                height={window.innerHeight}
                url={banditHost}
            />
        ),
    },

    "/mandelbrot": {
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

    "/voronoi": {
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

    "/stereo": {
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

    "/hilbert": {
        content: hilbert,
        component: (
            <Hilbert
                title="hilbert"
                style={{}}
                delay={presentationTime}
                width={window.innerWidth}
                height={window.innerHeight}
            />
        ),
    },

    "/corrupted": {
        content: corrupt,
        component: (
            <Corrupted
                title="corrupted"
                style={{}}
                delay={presentationTime}
                width={window.innerWidth}
                height={window.innerHeight}
            />
        ),
    },
    "/reinforcement-learning": {
        content: reinforcement,
        component: (
            <Reinforcement
                title="reinforcement learning"
                style={{ height: window.innerHeight + "px" }}
                delay={presentationTime}
                width={window.innerWidth}
                height={window.innerHeight}
            />
        ),
    },
    "/anaglyph": {
        content: anaglyph,
        component: (
            <Anaglyph
                title="anaglyph"
                style={{}}
                delay={presentationTime}
                width={window.innerWidth}
                height={window.innerHeight}
                url={banditHost}
            />
        ),
    },
    "/traveling-salesman": {
        content: travelingSalesman,
        component: (
            <TravelingSalesman
                title="traveling salesman"
                delay={presentationTime}
                style={{}}
                width={window.innerWidth}
                height={window.innerHeight}
                url={banditHost}
            />
        ),
    },
    "/conway": {
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
    "/photography": {
        content: photography,
        component: (
            <Photography
                title="photography"
                style={{}}
                delay={presentationTime}
                width={window.innerWidth}
                height={window.innerHeight}
                url={banditHost + "/wigglegrams/jpg"}
                rows={1}
            />
        ),
    },

    "/1986": {
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
    "/autostereogram": {
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
    "/colors": {
        content: colors,
        component: (
            <Colors
                title="colors"
                delay={presentationTime}
                style={{}}
                width={window.innerWidth}
                height={window.innerHeight}
                url={banditHost}
            />
        ),
    },

    "/loom": {
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

    "/quilt": {
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
};

const Project = (props) => {
    let [markdown, setMarkdown] = useState(null);

    let { slug } = useParams();

    useEffect(() => {
        let cancel = false;
        const fetchMarkdown = async (url) => {
            try {
                let response = await fetch(url);
                let text = await response.text();
                if (!cancel) {
                    console.log(text);
                    setMarkdown(text);
                }
            } catch (error) {
                console.log("Markdown loading failed.", error);
            }
        };
        fetchMarkdown(mapping["/" + slug].content);

        props.setIndexBackground("/" + slug);

        return () => (cancel = true);
    }, [slug]);

    return (
        <div
            style={{
                width: "0px",
                height: "100vh",
                position: "fixed",
                top: "0",
                right: "0",
                background: "white",
                mixBlendMode: "normal",
            }}
        ></div>
    );
};

const Container = (props) => {
    let { slug } = useParams();

    return (
        <Fragment>
            {props.background}
            <Outlet />
            <div className="Home-slider">
                <nav
                    style={{
                        position: "fixed",
                        right: "0",
                        top: "0",
                        zIndex: "200",
                        margin: "25px",
                        display: props.showMenu ? "block" : "none",
                    }}
                >
                    <ul>
                        <li style={{ display: "inline" }}>
                            <Link
                                style={{
                                    fontSize: "24px",
                                    textDecoration: "none",
                                }}
                                to="/"
                                onClick={() => props.setIndexBackground(null)}
                            >
                                then
                            </Link>
                        </li>{" "}
                        <li style={{ display: "inline" }}>
                            <Link
                                style={{
                                    fontSize: "24px",
                                    textDecoration: "none",
                                }}
                                to="/projects"
                                onClick={() => props.setIndexBackground(null)}
                            >
                                projects
                            </Link>
                        </li>{" "}
                    </ul>
                </nav>
                <Slider />
            </div>
        </Fragment>
    );
};

const ProjectMenu = (props) => {
    return (
        <Menu
            options={Object.keys(mapping)}
            style={{ backgroundColor: "transparent" }}
            setIndexBackground={props.setIndexBackground}
        ></Menu>
    );
};

const Home = (props) => {
    let [indexBackground, setIndexBackground] = useState(null);
    let navigate = useNavigate();
    let [markdown, setMarkdown] = useState(null);
    let [delay, setDelay] = useState(1000);
    let theme = useContext(ThemeContext);
    let [showMenu, setShowMenu] = useState(true);

    // let debouncedShowMenu = useDebounce(showMenu, 5000);

    useTimeout(() => {
        if (showMenu) {
            setShowMenu(false);
            console.log("Hiding menu.");
        }
        setDelay(null);
    }, [delay]);

    const mouseMoveHandler = (event) => {
        if (!showMenu) {
            setShowMenu(true);
            console.log("Showing menu.");
            setDelay(2000);
        }
    };

    useEffect(() => {
        let cancel = false;
        const fetchMarkdown = async (url) => {
            try {
                let response = await fetch(url);
                let text = await response.text();
                if (!cancel) {
                    console.log(text);
                    setMarkdown(text);
                }
            } catch (error) {
                console.log("Markdown loading failed.", error);
            }
        };
        fetchMarkdown(about);
        return () => (cancel = true);
    }, []);

    return (
        <div
            className="Home Home-info-container"
            style={{
                background: theme.theme.background,
                color: theme.theme.foreground,
                width: "100vw",
                height: "100vh",
            }}
            onMouseMove={mouseMoveHandler}
        >
            <Routes>
                <Route
                    path="/"
                    element={
                        <Container
                            background={
                                indexBackground === null
                                    ? null
                                    : mapping[indexBackground].component
                            }
                            setIndexBackground={setIndexBackground}
                            showMenu={showMenu}
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
                    <Route
                        path="projects"
                        element={
                            <ProjectMenu
                                setIndexBackground={setIndexBackground}
                            />
                        }
                    />
                    <Route
                        path="projects/:slug"
                        element={
                            <Project setIndexBackground={setIndexBackground} />
                        }
                    />
                    <Route
                        path="about"
                        element={<ReactMarkdown source={markdown} />}
                    />
                </Route>
            </Routes>
        </div>
    );
};

export default Home;
