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
import Autostereogram from './Autostereogram';
import Mandelbrot from './Mandelbrot.js';
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


const isGAEnabled = process.env.NODE_ENV === 'production';

if (isGAEnabled) {
    ReactGA.initialize(process.env.REACT_APP_GA_ID);
}

const apiHost = process.env.REACT_APP_API_HOST;
const mandelbrot = process.env.REACT_APP_MANDELBROT_HOST;
const banditHost = process.env.REACT_APP_API_BANDIT_HOST;
const NotFoundRedirect = () => <Redirect to='/not-found' />;


const usePageViews = () => {
    let location = useLocation();

    useEffect(() => {
        if (isGAEnabled) {
            ReactGA.set({ page: location.pathname }); 
            ReactGA.pageview(location.pathname);
        }
        
    }, [location, isGAEnabled]);
}




const Home = (props) => {

    const [isActive, setIsActive] = useState(false);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);

    }, []);

    const getMapping = () =>  {
        return {
                "/autostereogram": <Autostereogram />,
                "/1986":           <Distrito />,
                "/corrupted":      <Corrupted />,
                "/mandelbrot":     <Mandelbrot host={mandelbrot}/>,
                "/voronoi":        <Voronoi width={width} height={height} />,
                "/nevado":         <Wigglegram url={banditHost} />,
                "/nostalgia":      <Nostalgia />,
                "/":               <Then />,
                "/colors":         <Hilbert />,
                "/colors/:res":    <Hilbert />,
                "/reinforcement":  <Reinforcement />,
                "/anaglyph":       <Anaglyph url={apiHost} />,
                "/tsp":            <TravelingSalesman url={apiHost} width={width} height={height} />,
                "/conway":         <Circle />,
                "/mirror":         <Mirror />,
                "/404":            <NotFound />,
            };
    }

    const handleMenu = () => {
        setIsActive(!isActive);
    }

    const getMenu = () => {
        return <ul>{Object.entries(getMapping()).filter((element) => 
              !(element[0] === "/404" || 
                element[0] === "/" ||
                element[0] === "/colors/:res")
        ).map((element, index) => 
             <li key={index}><Link onClick={handleMenu} to={element[0]}>{element[0].slice(1)}</Link></li>)
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
              <div className="Home Home-info-container background">
                <Switch>
                  {getBackgroundContentRouter()}
                </Switch>
              </div>
            </div>);

}

export default Home;
