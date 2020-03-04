// tttttt  hh  hh  eeeeee  nn   nn
//   tt    hh  hh  ee      nnn  nn
//   tt    hhhhhh  eeee    nn n nn
//   tt    hh  hh  ee      nn  nnn
//   tt    hh  hh  eeeeee  nn   nn


import React, { useEffect, useState } from 'react';

import Anaglyph from './Anaglyph.js';
import Circle from './Circle.js';
import Corrupted from './Corrupted.js';
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

import './rl/board.css';
import './Home.css';

import { Switch, Redirect, Route, Link, useLocation } from 'react-router-dom';


const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
    ReactGA.initialize(process.env.REACT_APP_GA_ID);
}

const apiHost = process.env.REACT_APP_API_HOST;
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

    const [first, setFirst] = useState(["/"]);

    const getMapping = () => {
        return {
                "/autostereogram":          <Autostereogram />,
                "/1986":                    <Distrito />,
                "/corrupt":                 <Corrupted />,
                "/mandelbrot":              <Mandelbrot width={width} height={height} host={mandelbrot}/>,
                "/voronoi":                 <Voronoi width={width} height={height} />,
                "/stereo-photography":      <Masonry url={banditHost + "/wigglegrams/gif"} rows={3} width={width} height={height} />,
                "/bolero":                  <Nostalgia />,
                "/":                        null,
                "/hilbert":                 <Hilbert width={width} height={height} />,
                "/hilbert/:res":            <Hilbert width={width} height={height} />,
                "/reinforcement-learning":  <Reinforcement />,
                "/anaglyph":                <Anaglyph url={apiHost} />,
                "/traveling-salesman":      <TravelingSalesman url={apiHost} width={width} height={height} />,
                "/conway":                  <Circle width={width} height={height} />,
                "/kaleidoscope":            <Mirror />,
                "/film":                    <Masonry url={banditHost + "/wigglegrams/jpg"} rows={1} width={width} height={height} />,
                "/404":                     <NotFound />,
            };
    }

    const getMappingDecorated = (home) => {

        return { ...getMapping(), "/": getMapping()[home[0]]};

    }

    const getNames = () => {
        return Object.entries(getMapping()).filter((element) => 
              !(element[0] === "/404" || 
                element[0] === "/" ||
                element[0] === "/hilbert/:res")
        );
    }

    useEffect(() => {
        
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

            
            setFirst(json.order[0]);
          });


    }, []);



    const handleMenu = () => {
        setIsActive(!isActive);
    }



    const getMenu = () => {
        return <ul>{names.map((element, index) => <li key={index}><Link onClick={handleMenu} to={element[0]}>{element[0].slice(1).replace("-", " ")}</Link></li>)
        }</ul>;
    }


    const getBackgroundContentRouter = () => {

        let routes = Object.entries(getMappingDecorated(first)).map((element, index) => <Route key={index} exact path={element[0]}>
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
              <div className="Home Home-info-container background">
                <Switch>
                  {getBackgroundContentRouter()}
                </Switch>
              </div>
            </div>);

}

export default Home;
