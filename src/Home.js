import React, {
    Fragment,
    useEffect,
    useState,
    useContext,
} from "react";
import {
    Link,
    Navigate,
    useNavigate,
    useParams,
    Routes,
    Route,
    Outlet,
} from "react-router-dom";
import Menu from "./Menu.js";

import Bolero from "./bits/bolero/Bolero.tsx";
import Quilt from "./bits/quilt/Quilt.tsx";

import Autostereogram from "./bits/autostereogram/Autostereogram.tsx";
import Colors from "./bits/colors/Colors.tsx";
import Distrito from "./bits/distrito/Distrito.tsx";

import Conway from "./bits/conway/Conway.tsx";
import Animation from "./util/Animation";
import Loom from "./bits/loom/Loom.tsx";
import Mandelbrot from "./bits/mandelbrot/Mandelbrot.tsx";
import Photography from "./bits/photography/Photography.tsx";
import Voronoi from "./bits/voronoi/Voronoi.tsx";
import Reinforcement from "./bits/reinforcement/Reinforcement.tsx";
import Stereo from "./bits/stereo/Stereo.tsx";
import Nostalgia from "./bits/nostalgia/Nostalgia.tsx";
import Corrupted from "./bits/corrupted/Corrupted.tsx";
import Anaglyph from "./bits/anaglyph/Anaglyph.tsx";
import Penrose from "./bits/penrose/Penrose.tsx";
import TravelingSalesman from "./bits/travelingsalesman/TravelingSalesman.tsx";
import Blog from './Blog.tsx';
import Post from './Post.tsx';

import Then from "./Then.tsx";

import ReactMarkdown from "react-markdown";

import "./Home.css";
import "./Blog.css";

import autostereogram from "./bits/autostereogram/Autostereogram.md";
import colors from "./bits/colors/Colors.md";
import distrito from "./bits/distrito/Distrito.md";
import bolero from "./bits/bolero/Bolero.md";
import loom from "./bits/loom/Loom.md";
import conway from "./bits/conway/Conway.md";
import photography from "./bits/photography/Photography.md";
import mandelbrot from "./bits/mandelbrot/Mandelbrot.md";
import voronoi from "./bits/voronoi/Voronoi.md";
import quilt from "./bits/quilt/Quilt.md";
import reinforcement from "./bits/reinforcement/Reinforcement.md";
import nostalgia from "./bits/nostalgia/Nostalgia.md";
import corrupted from "./bits/corrupted/Corrupted.md";
import anaglyph from "./bits/anaglyph/Anaglyph.md";
import penrose from "./bits/penrose/Penrose.md";
import travelingSalesman from "./bits/travelingsalesman/TravelingSalesman.md";

import about from "./About.md";
import stereo from "./bits/stereo/Stereo.md";

import { ThemeContext } from "./ThemeContext.js";
import Slider from "./Slider.js";
import { getRandomIntegerArray } from './tools';

import { useTimeout } from "./Hooks.js";

import ReactGA from "react-ga4";

if (process.env.REACT_APP_GA_ID) {
    ReactGA.initialize(process.env.REACT_APP_GA_ID);
}


const presentationTime = 0;

const banditHost = process.env.REACT_APP_API_HOST;
const TRACKING_ID = process.env.REACT_APP_GA_ID;

const oldMapping = {

    "/penrose": {
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

    "/nostalgia": {
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

    "/corrupted": {
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

const Bit = (props) => {
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

        console.log(props.mapping)

        //fetchMarkdown(props.mapping["/" + slug].content);

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
                                to="/bits"
                                onClick={() => props.setIndexBackground(null)}
                            >
                                bits
                            </Link>
                        </li>{" "}
                    </ul>
                </nav>
                <Slider />
            </div>
        </Fragment>
    );
};

const BitMenu = (props) => {
    return (
        <Menu
            options={Object.keys(props.mapping)}
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
    let [codes, setCodes] = useState([]);
    let [colorsData, setColorsData] = useState(null);
    let [mapping, setMapping] = useState(oldMapping);
    // traveling salesman
    const [cities, setCities] = useState({cities: [], hasFetched: true});
    const squareSampling = 100;
    const numberColors = 500;

    let [konami, setKonami] = useState(0);
    let code = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

    // let debouncedShowMenu = useDebounce(showMenu, 5000);

    let host = window.location.host.split(".");
    let isBlog = host.length && host[0] === 'blog';

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

        const handleKeyPress = (event) => {
            if (event.keyCode === code[konami] && konami + 1 < code.length) {
                setKonami(konami + 1);
            } else {
                if (konami + 1 === code.length) {
                    theme.toggleTheme("konami");
                }
                setKonami(0);
            }
        }

        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        }
    }, [konami]);

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
        return () => {
            cancel = true;
        }
    }, []);

    useEffect(() => {
        let cancel = false;
        const fetchCodes = async (url) => {
            try {
                let response = await fetch(url);
                let json = await response.json();

                if (!cancel) {

                    console.log(json);

                    let projects = json.colors.map((element) => {
                        console.log(element.resolutions);

                        let final = element.resolutions.filter(e => e.resolution == element.default);
                        let finalElement;
                        if (final.length === 0) {
                            finalElement = element.resolutions[0];
                        } else {
                            finalElement = final[0];
                        }

                        return {slug: element.slug, description: element.description, ...finalElement};
                    });

                    setColorsData(projects);
                    console.log(projects);
                }
            } catch (error) {
                console.log("Something went wrong.", error);
                console.log(error);
            }
        };
        fetchCodes(`${banditHost}/colors`);
        return () => {
            cancel = true;
        }
    }, []);

    useEffect(() => {
        let cancel = false;
        const fetchCodes = async (url) => {
            try {
                let response = await fetch(url);
                let json = await response.json();

                if (!cancel) {
                    let codes = json.codes.map((element, index) => <Route
                        key={index}
                        path={element.code}
                        element={<Navigate replace to={element.redirect?`/bit/${element.redirect}`:'/'} />}
                    />)
                    setCodes(codes);

                }
            } catch (error) {
                console.log("Error while loading qr routes.", error);
            }
        };
        fetchCodes(`${banditHost}/codes`);
        return () => {
            cancel = true;
        }
    }, []);

    useEffect(() => {
        let cancel = false;
        const fetchCitiesSolution = async (url, numberColors, squareSampling) => {
            try {
                let payload = {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                };

                let cityPoints = getRandomIntegerArray(numberColors * 2, 1, squareSampling);
                let citiesUrl = url + "/solve?cities=" + JSON.stringify(cityPoints) + "&dimension=" + 2;

                let response = await fetch(citiesUrl, payload);
                let json = await response.json();
                if (!cancel) {
                    setCities({cities: json, hasFetched: true});
                }  
            } catch (error) {
                console.log("Call to order endpoint failed.", error)
            }
        }
        fetchCitiesSolution(banditHost, numberColors, squareSampling);
        return () => {
            cancel=true;
        } 
    }, []);

    useEffect(() => {

        if (colorsData) {
            let newMapping = colorsData.reduce((m, element) => {
                m[`/${element.slug}`] = {
                    content: quilt,
                    component: <Animation
                        className="Composer"
                        title={element.slug}
                        style={{}}
                        delay={presentationTime}
                        width={window.innerWidth}
                        height={window.innerHeight}
                        res={element.resolution}
                        square={element.square}
                        cube={element.cube}/>};
                return m;
            }, {});
            setMapping({...mapping, ...newMapping});
        }
    }, [colorsData]);

    useEffect(() => {

        if (cities.hasFetched) {
            let newMapping = {
                "/traveling-salesman": {
                    content: travelingSalesman,
                    component: (
                        <TravelingSalesman
                            title="traveling salesman"
                            style={{}}
                            delay={presentationTime}
                            width={window.innerWidth}
                            height={window.innerHeight}
                            cities={cities}
                            numberColors={numberColors}
                            squareSampling={squareSampling}
                        />
                    ),
                },
            };
            setMapping({...mapping, ...newMapping});
        }
    }, [cities]);



    if (isBlog) {
        return (
            <div className="Blog">
                <Routes>
                     <Route
                        path="/"
                        element={
                            <Blog
                                title={"Else"}
                                url={`${banditHost}/posts`}
                                />
                        }
                    />

                    <Route
                        path="/post/:slug"
                        element={
                            <Post
                                url={`${banditHost}/post`}
                                />
                        }
                    />
                </Routes>
            </div>
        );
    }

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
                                indexBackground === null || mapping[indexBackground] === undefined
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
                        path="bits"
                        element={
                            <BitMenu
                                mapping={mapping}
                                setIndexBackground={setIndexBackground}
                            />
                        }
                    />
                    <Route
                        path="bit/:slug"
                        element={
                            <Bit 
                                mapping={mapping}
                                setIndexBackground={setIndexBackground} />
                        }
                    />
                    <Route
                        path="about"
                        element={<ReactMarkdown source={markdown} />}
                    />
                    {codes}
                </Route>
            </Routes>
        </div>
    );
};

export default Home;