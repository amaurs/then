// tttttt  hh  hh  eeeeee  nn   nn
//   tt    hh  hh  ee      nnn  nn
//   tt    hhhhhh  eeee    nn n nn
//   tt    hh  hh  ee      nn  nnn
//   tt    hh  hh  eeeeee  nn   nn


import React, { useEffect, useState } from 'react';

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
import Then from './Then.js';
import TravelingSalesman from './TravelingSalesman';
import Voronoi from './Voronoi.js';
import Wigglegram from './Wigglegram.js';

import ReactGA from 'react-ga';

import './Home.css';

import { Switch, Redirect, Route, Link, useLocation, useHistory } from 'react-router-dom';


const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
    ReactGA.initialize(process.env.REACT_APP_GA_ID);
}

const mandelbrot = process.env.REACT_APP_MANDELBROT_HOST;
const banditHost = process.env.REACT_APP_API_BANDIT_HOST;
const delay = 15000;
const NotFoundRedirect = () => <Redirect to='/not-found' />;


const usePageViews = () => {
    let location = useLocation();
    

    useEffect(() => {
        if (isProduction) {
            ReactGA.set({ page: location.pathname }); 
            ReactGA.pageview(location.pathname);
        
            let id = setTimeout(() => { 
                console.log("User has been in " + location.pathname + " for " + delay + " milliseconds.")
                let bandit = {state: location.pathname,
                          reward: delay}
                let banditUrl = banditHost + "/metric";
                fetch(banditUrl, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                  body: JSON.stringify(bandit)
                })
                .then(response => {
            
                  console.log(response.json())
                });
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
    const [current, setCurrent] = useState("/");

    const [pointer, setPointer] = useState(0);

    let history = useHistory();

    const getMapping = () => {
        return {
                "/":                        <Then />,
                "/autostereogram":          <Autostereogram width={width} height={height} />,
                "/1986":                    <Distrito width={width} height={height} />,
                "/corrupt":                 <Corrupted width={width} height={height} />,
                "/colors":                  <Colors width={width} height={height}  url={banditHost} />,
                "/mandelbrot":              <Mandelbrot width={width} height={height} host={mandelbrot}/>,
                "/voronoi":                 <Voronoi width={width} height={height} />,
                "/stereo-photography":      <Masonry width={width} height={height} url={banditHost + "/wigglegrams/gif"} rows={2} />,
                "/bolero":                  <Nostalgia width={width} height={height} url={banditHost + "/boleros/en"} />,
                "/hilbert":                 <Hilbert width={width} height={height} />,
                "/hilbert/:res":            <Hilbert width={width} height={height} />,
                "/reinforcement-learning":  <Reinforcement width={width} height={height} />,
                "/anaglyph":                <Anaglyph width={width} height={height} url={banditHost} />,
                "/traveling-salesman":      <TravelingSalesman width={width} height={height} url={banditHost} />,
                "/conway":                  <Circle width={width} height={height} />,
                "/kaleidoscope":            <Mirror width={width} height={height} />,
                "/film":                    <Masonry width={width} height={height} url={banditHost + "/wigglegrams/jpg"} rows={1} />,
                "/404":                     <NotFound />,
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
        
        let bandit = {states: getNames()}
        let banditUrl = banditHost + "/order";
        fetch(banditUrl, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bandit)
        })
        .then(response => {
            return  response.json();
        }).then(json => {
            setNames(json.order);
            window.addEventListener("resize", onWindowResize);
            
        });
        return () => {
            window.removeEventListener("resize", onWindowResize);
        }
    }, []);


    useEffect(() => {
        const handleKeyPress = (event) => {
            if (names.length > 0) {
    
                console.log(names);
    
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
            }
        }
        
        window.addEventListener("keydown", handleKeyPress);

        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        }
    }, [names, location.pathname]);



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






    let menu = <div className={"Menu Home-info-container" + (isActive?" active":"")}>
                {getMenu()}
               </div>;

    return (<div>
              {usePageViews()}
              <div className="MenuHamburger">
                  <Hamburger onClick={handleMenu} isActive={isActive} />
              </div>
              {isActive?menu:null} 
              <div className="Home Home-info-container">
                <Switch>
                  {getBackgroundContentRouter()}
                </Switch>
              </div>
            </div>);

}

export default Home;
