// tttttt  hh  hh  eeeeee  nn   nn
//   tt    hh  hh  ee      nnn  nn
//   tt    hhhhhh  eeee    nn n nn
//   tt    hh  hh  ee      nn  nnn
//   tt    hh  hh  eeeeee  nn   nn


import React, { Component } from 'react';



import Mandelbrot from './Mandelbrot.js';
import Reinforcement from './Reinforcement.js';
import cubeDepth from './assets/cube-depth.png';
import { getXYfromIndex, getRandomIntegerArray, getRandomInt, getBrightness, getCentroids } from './util.js';
import './Home.css';
import Anaglyph from './Anaglyph.js';
import Circle from './Circle.js';
import Corrupted from './Corrupted.js';
import Distrito from './Distrito.js';
import Hilbert from './Hilbert.js';
import Autostereogram from './Autostereogram';
import Loader from './Loader';
import Mirror from './Mirror.js';
import Nostalgia from './Nostalgia';
import Menu from './Menu';
import Then from './Then.js';
import TravelingSalesman from './TravelingSalesman';
import Voronoi from './Voronoi.js';
import Wigglegram from './Wigglegram.js';
import * as d3 from 'd3';
import { randomElement } from './rl/util.js';
import { getIndexFromArray, mod } from './util.js';


import './rl/board.css';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

    const SECTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const MAPPING = {
        "1986": 1,
        "corrupted": 2, 
        "mandelbrot": 3,
        "voronoi": 4,
        "nevado": 5,
        "colors": 6,
        "reinforcement": 7,
        "anaglyph": 8,
        "tsp": 9,
        "nostalgia": 10,
        "conway": 11,
        "autostereogram": 12,
        "mirror": 13
    }

    const REVERSE_MAPPING = {
        0: "then",
        1: "1986",
        2: "corrupted", 
        3: "mandelbrot",
        4: "voronoi",
        5: "nevado",
        6: "colors",
        7: "reinforcement",
        8: "anaglyph",
        9: "tsp",
       10: "nostalgia",
       11: "conway",
       12: "autostereogram",
       13: "mirror"
    }

    const environment = new Environment(map.height, 
                                        map.width, 
                                        map.boardPlan,
                                        map.wind,
                                        map.agent,
                                        map.goal)
    
    const agent = new Agent(environment.getNumberOfActions(), environment.getNumberOfStates());
    
    const controller = new Controller(environment, agent)


    const PATH_COMPONENT_MAPPING = {
        "/autostereogram": <Autostereogram />,
        "/1986": <Distrito />,
        "/corrupted": <Corrupted />,
        "/mandelbrot": <Mandelbrot host={mandelbrot}/>,
        //"voronoi": <
        "/nevado": <Wigglegram />,
        "/nostalgia": <Nostalgia />,
        "/": <Then />,
        "/colors": <Hilbert />,
        "/reinforcement": <Reinforcement />,
        //"/anaglyph": <Cube ref={this.cube} points={this.state.points} />
        //"tsp": <
        "/conway": <Circle />,
        "/mirror": <Mirror />,
    }



    const apiHost = process.env.REACT_APP_API_HOST;
    const mandelbrot = process.env.REACT_APP_MANDELBROT_HOST;
    const banditHost = process.env.REACT_APP_API_BANDIT_HOST;
    const numberColors = 700;
    const squareSampling = 100;

    function romanize(num) {
      var lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},roman = '',i;
      for ( i in lookup ) {
        while ( num >= lookup[i] ) {
          roman += i;
          num -= lookup[i];
        }
      }
      return roman;
    }

    function download(filename, text) {
        var pom = document.createElement('a');

        pom.setAttribute('href', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', filename);

        if (document.createEvent) {
            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            pom.dispatchEvent(event);
        }
        else {
            pom.click();
        }
    }

    class Home extends Component {
      constructor(props) {
        super(props);
        console.log("%c" + romanize(1), "color:red");
        this.cube = React.createRef();
        this.handleSave = this.handleSave.bind(this);

        this.state = {
          width: 0,
          height: 0,
          section: -1,
          points: null,
          voronoiUpdates: 0,
          visited: [0],
          pointer: 0,
          autostereogram: null,
        }
      }

      componentDidMount(){
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));
        //window.addEventListener("scroll", this.handleScroll.bind(this));
        document.addEventListener("keydown", this.handleKeyPress.bind(this));


        this.getOrder();
      }

      componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
        window.removeEventListener("keydown", this.add.bind(this));
        //window.removeEventListener("scroll", this.handleScroll.bind(this));

      }

      updateDimensions() {
        let update_width  = window.innerWidth;
        let update_height = window.innerHeight;
        this.setState({ width: update_width, height: update_height });
      }

      handleKeyPress(event) {
        console.log(event.key)
        let pointer = this.state.pointer;
        let visited = this.state.visited;
        let section;
        console.log(section)
        if (event.key === 'ArrowRight') {
          //section = mod(section + 1, SECTIONS.length);
          if (pointer < visited.length - 1) {
            pointer = pointer + 1;
            section = visited[pointer];
            this.setState({ section: section, pointer: pointer });
          }
        }
        if (event.key === 'ArrowLeft') {
          //section = mod(section - 1, SECTIONS.length);
          if (pointer > 0) {
            pointer = pointer - 1;
            section = visited[pointer];
            this.setState({ section: section, pointer: pointer });  
          }
        }

        this.rewardSignal();
      };

      getOrder() {
        let bandit = {states: Object.keys(MAPPING)}
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
            let visited = [0].concat(json.order.map(function(element) {
                return MAPPING[element];
            }));

            this.setState({visited: visited});
          });
      }

      rewardSignal() {
        let bandit = {state: REVERSE_MAPPING[this.state.section],
                      reward: 700}
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
      }

      handleScroll(event) {
        let section = Math.floor((window.scrollY + this.state.height / 2 )/ this.state.height );
        console.log("%cSection " + section, 'color: green');
        
      }

      handleSave(event) {
        let serializer = new XMLSerializer();
        let container = this.cube.current.mount.childNodes[0];

        let source = serializer.serializeToString(container.childNodes[0]);
        download("cube-left.svg", source)
        source = serializer.serializeToString(container.childNodes[1])
        download("cube_right.svg", source)

      }
      getBackgroundContent() {
        let content = null;

              switch(this.state.section) {
                  case -1:
                      content = <div className="Home-info-container background project-0">
                                    <Menu 
                                        items={REVERSE_MAPPING}
                                    />
                                </div>
                      break;
                  case 12:
                      content = <Autostereogram />
                      break;
                  case 11:
                      content = <Circle />
                      break;
                  case 13:
                      content = <Mirror />
                      break;
                  case 0:
                      content = <Then />
                      break;
                  case 1:
                      content = <Distrito />
                      break;
                  case 2:
                      content = <Corrupted />
                      break;
                  case 3:
                      content = <Mandelbrot host={mandelbrot}/>
                      break;
                  case 4:
                      /**
                      let voronoi = null;
                      if(this.state.totalData) {
                            let imageRatio = this.state.imageHeight / this.state.imageWidth;
                            let ratio = this.state.height / this.state.width;
                            let canvasHeight = this.state.height;
                            let canvasWidth = this.state.width;
                            if(ratio < 1) {
                                canvasWidth = canvasHeight * (1 / imageRatio);
                            } else {
                                canvasHeight = canvasWidth * imageRatio;
                            }
                            voronoi = <Voronoi imageData={this.state.totalData}
                                               width={this.state.width}
                                               height={this.state.height}
                                               imageWidth ={this.state.imageWidth}
                                               imageHeight={this.state.imageHeight}
                                               sites={this.state.sites}
                                               updateCities={this.updateCities}
                                               canvasWidth={canvasWidth}
                                               canvasHeight={canvasHeight}
                                               updates={this.state.voronoiUpdates}
                                      />
                      } else {
                        voronoi = <Loader />
                      }
                      **/
                      content = <Voronoi 
                                    width={this.state.width}
                                    height={this.state.height}
                                    />
                      break;
                  case 5:
                      content = <Wigglegram />
                      break;
                  case 6:
                      content = <Hilbert />
                      break;
                  case 7:
                      content =<Reinforcement />
                      break;
                  case 8:
                      content = <Anaglyph url={apiHost} />
                      break;
                  case 9:
                      content = <TravelingSalesman 
                                        url={apiHost} 
                                        width={this.state.width}
                                        height={this.state.height}
                                        />
                      break;
                  case 10:
                    content = <Nostalgia />
                    break;    
                  default:
                      content = null;
              }
              return <div className="Home-info-container background project-0">
                        {content}
                     </div> ;
      }

      getMenu() {
        return <ul>{Object.entries(PATH_COMPONENT_MAPPING).map((element, index) => 
                 <li key={index}><Link to={element[0]}>{element[0]}</Link></li>)
            }</ul>;
      }

      getBackgroundContentRouter() {
        return (<div className="Home-info-container background project-9">
                {Object.entries(PATH_COMPONENT_MAPPING).map((element, index) => <Route exact path={element[0]}>
                    {element[1]}
                    </Route>
                    )}
            </div>)
      }

      render() {

        return (
          <Router>
            <div className="Home">
              {this.getMenu()}
              <Switch>
                {this.getBackgroundContentRouter()}
              </Switch>
            </div>
          </Router>
        );
      }
    }




    export default Home;
