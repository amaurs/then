// tttttt  hh  hh  eeeeee  nn   nn
//   tt    hh  hh  ee      nnn  nn
//   tt    hhhhhh  eeee    nn n nn
//   tt    hh  hh  ee      nn  nnn
//   tt    hh  hh  eeeeee  nn   nn

import React, { useEffect, useState, useContext } from 'react';

import Anaglyph from './Anaglyph.js';
import Circle from './Circle.js';
import Corrupted from './Corrupted.js';
import Colors from './Colors.js';
import Distrito from './Distrito.js';
import Hamburger from './Hamburger';
import Hilbert from './Hilbert.js';
import Autostereogram from './Autostereogram.js';
import Loader from './Loader.js'
import Mandelbrot from './Mandelbrot.js';
import Masonry from './Masonry.js';
import Mirror from './Mirror.js';
import Nostalgia from './Nostalgia';
import NotFound from './NotFound';
import Reinforcement from './Reinforcement.js';
import Slider from './Slider.js';
import Then from './Then.js';
import TravelingSalesman from './TravelingSalesman';
import Voronoi from './Voronoi.js';
import Wigglegram from './Wigglegram.js';
import ReactGA from 'react-ga';
import { useSwipeable } from 'react-swipeable';
import './Home.css';
import { Switch, Redirect, Route, Link, useLocation, useHistory } from 'react-router-dom';

import { ThemeContext } from './ThemeContext.js';



const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
    ReactGA.initialize(process.env.REACT_APP_GA_ID);
}

const mandelbrot = process.env.REACT_APP_MANDELBROT_HOST;
const banditHost = process.env.REACT_APP_API_BANDIT_HOST;
const delay = 15000;
const presentationTime = 2000;
const NotFoundRedirect = () => <Redirect to='/not-found' />;


const usePageViews = (pathname) => {
    let location = useLocation();

    useEffect(() => {
        if (isProduction) {

            ReactGA.set({ page: location.pathname }); 
            ReactGA.pageview(location.pathname);

            const fetchMetrics = async () => {
                try {
                    let payload = {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json"
                            },
                          body: JSON.stringify({state: location.pathname, reward: delay})
                        }
                    const response = await fetch(banditHost + "/metric", payload);
                    console.log(await response.json());
                } catch (error) {
                    console.err("Call to metrics endpoint failed.", error)
                }
            }

            let id = setTimeout(() => { 
                console.log("User has been in " + location.pathname + " for " + delay + " milliseconds.")
                fetchMetrics();
            }, delay);
            return () => clearTimeout(id);
        }
    }, [location]);

}




const Home = (props) => {

    const [isActive, setIsActive] = useState(false);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [names, setNames] = useState([]);
    const [current, setCurrent] = useState(null);
    const [pointer, setPointer] = useState(0);
    const [font, setFont] = useState(null);
    const history = useHistory();
    

    const theme = useContext(ThemeContext);


    let config = {
                  delta: 30,                             
                  preventDefaultTouchmoveEvent: false,   
                  trackTouch: true,                      
                  trackMouse: false,                     
                  rotationAngle: 0,                      
                }


    const getMapping = () => {
        return {
                "/":                        <Then />,
                "/autostereogram":          <Autostereogram title="autostereogram" delay={presentationTime}  width={width} height={height} />,
                "/1986":                    <Distrito title="1986" delay={presentationTime}  width={width} height={height} />,
                "/corrupt":                 <Corrupted title="corrupt" delay={presentationTime}  width={width} height={height} />,
                "/colors":                  <Colors title="colors" delay={presentationTime}  width={width} height={height}  url={banditHost} />,
                "/mandelbrot":              <Mandelbrot title="mandelbrot" delay={presentationTime}  width={width} height={height} host={mandelbrot}/>,
                "/voronoi":                 <Voronoi title="voronoi" delay={presentationTime}  width={width} height={height} />,
                "/stereo-photography":      <Masonry title="stereo photography" delay={presentationTime}  width={width} height={height} url={banditHost + "/wigglegrams/gif"} rows={2} />,
                "/bolero":                  <Nostalgia title="bolero" delay={presentationTime}  width={width} height={height} url={banditHost + "/boleros/en"} />,
                "/hilbert":                 <Hilbert title="hilbert" delay={presentationTime}  width={width} height={height} />,
                "/hilbert/:res":            <Hilbert title="hilbert" delay={presentationTime}  width={width} height={height} />,
                "/reinforcement-learning":  <Reinforcement title="reinforcement learning" delay={presentationTime}  width={width} height={height} />,
                "/anaglyph":                <Anaglyph title="anaglyph" delay={presentationTime} width={width} height={height} url={banditHost} />,
                "/traveling-salesman":      <TravelingSalesman title="traveling salesman" delay={presentationTime}  width={width} height={height} url={banditHost} />,
                "/conway":                  <Circle title="conway" delay={presentationTime}  width={width} height={height} />,
                //"/kaleidoscope":            <Mirror title="kaleidoscope" delay={presentationTime}  width={width} height={height} />,
                "/film":                    <Masonry title="film" delay={presentationTime}  width={width} height={height} url={banditHost + "/wigglegrams/jpg"} rows={1} />,
                "/404":                     <Loader />,
            };
    }

    const getMappingDecorated = (home) => {
        return { ...getMapping(), "/": getMapping()[home[0]]};
    }

    const getNames = () => {
        return Object.entries(getMapping()).filter((element) => 
              !(element[0] === "/404" ||
                element[0] === "/hilbert/:res")
        );
    }

    let location = useLocation();

    useEffect(() => {
        const onWindowResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        }
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
        window.addEventListener("resize", onWindowResize);
        return () => window.removeEventListener("resize", onWindowResize);
    }, []);

    useEffect(() => {
        let cancel = false;
        const fetchOrder = async () => {
            try {
                let payload = {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({states: getNames()})
                };
                let response = await fetch(banditHost + "/order", payload);
                let json = await response.json();
                if (!cancel) {
                    setNames(json.order);
                }  
            } catch (error) {
                console.log("Call to order endpoint failed.", error)
            }
 
        }
        fetchOrder();
        return () => cancel=true;
    }, []);

    const handlers = useSwipeable({ onSwiped: (eventData) => {
        
        if (names.length > 0) {
            let current = names.map((element, index) =>{ return {name: element[0], index: index}}).filter(element => {
                return element.name == location.pathname;
            })[0];
            if (eventData.dir === 'Left' && current.index < names.length - 1) {
                let next = names[current.index + 1];
                setCurrent(next[0])
            }
            if (eventData.dir === 'Right'  && current.index > 0) {
                let prev = names[current.index - 1];
                setCurrent(prev[0])
            }
        }

    }, ...config });


    useEffect(() => {
        const handleKeyPress = (event) => {
            if (names.length > 0) {
                let current = names.map((element, index) =>{ return {name: element[0], index: index}}).filter(element => {
                    return element.name == location.pathname;
                })[0];
                if (event.key === 'ArrowRight' && current.index < names.length - 1) {
                    let next = names[current.index + 1];
                    setCurrent(next[0])
                }
                if (event.key === 'ArrowLeft'  && current.index > 0) {
                    let prev = names[current.index - 1];
                    setCurrent(prev[0])
                }
                if (event.key === 't') {
                    console.log(event.key);
                    //setTheme(theme === themes.dark?themes.light:themes.dark);
                    theme.toggleTheme()

                }
            }
        }
        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        }
    }, [names, location.pathname, theme.theme]);

    useEffect(() => {
        if (current !== null) {
            history.push(current);
        }
    }, [current]);

    const handleMenu = () => {
        setIsActive(!isActive);
    }

    const getMenu = () => {
        return <ul>{names.map((element, index) => <li key={index}><Link onClick={handleMenu} to={element[0]}>{element[0].slice(1).replace("-", " ")}</Link></li>)
        }</ul>;
    }

    const getBackgroundContentRouter = () => {

        let routes = Object.entries(getMapping()).map((element, index) => <Route key={index} exact path={element[0]}>
                {element[1]}
                </Route>
                )

        routes.push(<Route key={404} component={NotFoundRedirect}><Redirect to="/404" /></Route>);
        return routes;
    }

    let menu = <div className={"Menu Home-info-container" + (isActive?" active":"")}
                    style={{ background: theme.theme.background, color: theme.theme.foreground }}>
                {getMenu()}
               </div>;

    

    return (
        
            <div {...handlers} style={{ background: theme.theme.background, color: theme.theme.foreground }}>
                {usePageViews()}
                <div className="MenuHamburger">
                    <Hamburger onClick={handleMenu} isActive={isActive} />
                </div>
                <div className="Home-slider">
                    <Slider onClick={theme.toggleTheme} />
                </div>
                    {isActive?menu:null} 
                <div className="Home Home-info-container">
                    <Switch>
                        {getBackgroundContentRouter()}
                    </Switch>
                </div>
                
            </div>
        
    );
}

export default Home;
