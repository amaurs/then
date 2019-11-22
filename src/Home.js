import React, { Component } from 'react';
import corrupted from './assets/escudo.m4v'
import emji from './assets/emji.mp4'
import Voronoi from './Voronoi.js';
import Mandelbrot from './Mandelbrot.js';
import Reinforcement from './Reinforcement.js';
import robot from './assets/our-lady.jpg';
import { getXYfromIndex, getRandomIntegerArray, getRandomInt, getBrightness, getCentroids } from './util.js';
import './Home.css';
import Cube from './Cube.js'
import Circle from './Circle.js'
import Colors from './Colors'
import Loader from './Loader'
import Nostalgia from './Nostalgia'
import { Delaunay } from "d3-delaunay";
import * as d3 from 'd3';
import { randomElement } from './rl/util.js';
import { getIndexFromArray, mod } from './util.js';

import { Environment, map} from './rl/windyGridworld.js';
import Controller from './rl/controller';
import { Agent } from './rl/sarsaAgent.js';
import './rl/board.css';

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
        "nostalgia": 10
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
       10: "nostalgia"
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
        let image = new Image();
        image.src = robot;
        image.onload = this.onLoad.bind(this);
        this.cube = React.createRef();
        this.handleSave = this.handleSave.bind(this);
        this.animate = this.animate.bind(this);
        this.tick = this.tick.bind(this);
        this.updateCities = this.updateCities.bind(this);

        this.state = {
          width: 0,
          height: 0,
          section: -1,
          points: null,
          tick: 0,
          ticks: 0,
          voronoiUpdates: 0,
          visited: [0],
          pointer: 0,
        }
      }

      animate() {
        let newTick = this.state.tick + 1;

        if (this.state.section === 9) {
            this.setState({tick: newTick});
        }

        setTimeout(function() {
            requestAnimationFrame(this.animate)
        }.bind(this), 1000 / 500)


      }

      tick() {
        

        let newTicks = this.state.ticks + 1;
        console.log("say hello " + this.state.ticks)
        this.setState({ticks: newTicks});


        


        if (this.state.ticks > 5) {
            clearInterval(this.ticker);

        }
      }

      updateCities(duration) {
        let sitesNew = this.sitesUpdate(this.state.sites, this.state.totalData, this.state.imageWidth, this.state.imageHeight);
        const ease = d3.easeCubic;
        let timer = d3.timer((elapsed) => {
           const t = Math.min(1, ease(elapsed / duration));
           let notQuiteNew = sitesNew.map(function(point) {
                let trans = Object.assign({}, point);
                trans.x = trans.oldX * (1 - t) + trans.x * t;
                trans.y = trans.oldY * (1 - t) + trans.y * t;
                trans.r = trans.oldR * (1 - t) + trans.r * t;
                trans.g = trans.oldG * (1 - t) + trans.g * t;
                trans.b = trans.oldB * (1 - t) + trans.b * t;
                return trans;
           })
           this.setState({sites: notQuiteNew});
           if (t === 1) {
               timer.stop();
           }
        });
        let voronoiUpdates = this.state.voronoiUpdates + 1;
        this.setState({sites: sitesNew, voronoiUpdates: voronoiUpdates});
      }

      maxBound(time, size) {

        let t = time % (2 * size)
        if(t < size) {
            return t;
        }else {
            return size;
        }
      }

      minBound(time, size) {

        let t = time % (2 * size)
        if(t < size) {
            return 0;
        }else {
            return time % size;
        }
      }

      onLoad(event) {
        const image = event.target;
        console.log(image.currentSrc);
        let canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        let context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        let imageData = context.getImageData(0, 0, image.width, image.height);
        let totalData = [];
        for(let index = 0; index < image.width * image.height; index++) {
            let pixel = getXYfromIndex(index, image.width);
            totalData.push({
                             x: pixel[0],
                             y: pixel[1],
                             r: imageData.data[index * 4],
                             g: imageData.data[index * 4 + 1],
                             b: imageData.data[index * 4 + 2],
                           });
        }
        const total = 10000;
        let sites = [];
        /** I use the rejection algorithm to get points with the most brightness. **/
        let numPoints = 0;

        while(numPoints < total){
          let index = getRandomInt(0, image.width * image.height);
          let site = totalData[index]
          let brightness = getBrightness(site.r, 
                                         site.g, 
                                         site.b);
          if (Math.random() >= brightness ) {
            sites.push(site);
            numPoints++;
          }
        }
        
        let sitesNew = this.sitesUpdate(sites, totalData, image.width, image.height);
        this.setState({imageData: imageData,
                       totalData: totalData,
                       imageWidth: image.width,
                       imageHeight: image.height,
                       sites: sitesNew
                      });
      }

      componentDidMount(){
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));
        //window.addEventListener("scroll", this.handleScroll.bind(this));
        document.addEventListener("keydown", this.handleKeyPress.bind(this));
        
        this.timerID = requestAnimationFrame(this.animate);

        // Fetch moebius.

        fetch(apiHost, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({point_set: "moebius", n_cities: "1000"})
          })
          .then(response => {
            return  response.json();
            
          }).then(json => {
            this.setState({points: json})
          });

        // Fetch colors.

        let colors = getRandomIntegerArray(numberColors * 3, 0, 256);
        let colorsUrl = apiHost + "/solve?cities=" + JSON.stringify(colors) + "&dimension=" + 3;
        fetch(colorsUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          return  response.json();
          
        }).then(json => {
          this.setState({colors: json})
        });

        // Fetch cities.

        let cities = getRandomIntegerArray(numberColors * 2, 0, squareSampling);
        let citiesUrl = apiHost + "/solve?cities=" + JSON.stringify(cities) + "&dimension=" + 2;
        fetch(citiesUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          return  response.json();
        }).then(json => {
          this.setState({cities: json})
        });

        this.getOrder();
      }

      componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
        window.removeEventListener("keydown", this.add.bind(this));
        //window.removeEventListener("scroll", this.handleScroll.bind(this));

        cancelAnimationFrame(this.timerID);
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





  sitesUpdate(sites, imageData, width, height) {
    const delaunay = Delaunay.from(sites, 
                                      function(d) { return d.x },
                                      function(d) { return d.y });
    const voronoi = delaunay.voronoi([0, 0, width, height]);
    const diagram = voronoi.cellPolygons();
    let newSites = getCentroids(diagram).map(function(centroid, index) {
        let closestIndex = Math.floor(centroid[1]) * width + Math.floor(centroid[0]);
        let closestPixel = imageData[closestIndex];
        return {
                oldX: sites[index].x,
                oldY: sites[index].y,
                x: centroid[0],
                y: centroid[1],
                r: closestPixel.r,
                g: closestPixel.g,
                b: closestPixel.b,

                oldR: sites[index].r,
                oldG: sites[index].g,
                oldB: sites[index].b
        };
    });

    return newSites;
  }





      getBackgroundContent() {
        let content = null;

              switch(this.state.section) {
                  case -1:
                      content = <div className="Home-info-container background project-0">
                                    <Circle />
                                </div>
                      break;
                  case 0:
                      content = <div className="Home-info-container background project-0">
                                  <div className="definition">
                                    <p className="name">then</p>
                                    <p className="pronunciation">/ <span className="underline">TH</span>en /</p>
                                    <p className="type">adverb</p>
                                    <ol>
                                      <li><p>at that time; at the time in question.</p></li>
                                      <li><p>after that; next; afterward.</p></li>
                                      <li><p>in that case; therefore.</p></li>
                                    </ol>
                                  </div>
                                </div>
                      break;
                  case 1:
                      content = <div className="Home-info-container background project-1">
                                </div>
                      break;
                  case 2:
                      content = <div className="Home-info-container background project-2">
                                  <video autoPlay loop muted>
                                    <source src={corrupted} type="video/mp4"/>
                                  </video>
                                </div>
                      break;
                  case 3:
                      content = <div className="Home-info-container background project-3">
                                    <Mandelbrot host={mandelbrot}/>
                                </div>
                      break;
                  case 4:

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
                      content = <div className="Home-info-container background project-4">
                                  {voronoi}
                                </div>
                      break;
                  case 5:
                      content = <div className="Home-info-container background project-5">
                                  <video autoPlay loop muted>
                                    <source src={emji} type="video/mp4" />
                                  </video>
                                </div>
                      break;
                  case 6:
                      content = <div className="Home-info-container background project-6">
                                </div>
                      break;
                  case 7:

                        const environment = new Environment(map.height, 
                                                            map.width, 
                                                            map.boardPlan,
                                                            map.wind,
                                                            map.agent,
                                                            map.goal)
      
                        const agent = new Agent(environment.getNumberOfActions(), environment.getNumberOfStates());
                        
                        const controller = new Controller(environment, agent)
                        content = <div className="Home-info-container background project-7">
                                     <Reinforcement controller={controller} />
                                  </div>
                      break;

                  case 8:

                      let cubeObject = null;

                      if (this.state.points) {
                        cubeObject = <Cube ref={this.cube} points={this.state.points}/>
                      }
                      content = <div className="Home-info-container background project-8">
                                   <button type="button" className="App-button nes-btn is-error" onClick={this.handleSave}>
                                       Export
                                   </button>
                                   {cubeObject}
                                 </div>  
                      break;
                  case 9:

                      if(this.state.colors && this.state.cities) {
                        // TODO: Maybe this logic should be handled by the component.
                        let colorNumber = this.state.tick % (numberColors + 1);
                        let color = [this.state.colors[colorNumber * 3],
                                 this.state.colors[colorNumber * 3 + 1],
                                 this.state.colors[colorNumber * 3 + 2]];

                        let min = this.minBound(this.state.tick, numberColors + 1);
                        let max = this.maxBound(this.state.tick, numberColors + 1);

                        let citiesToDraw = this.state.cities.slice(min * 2, max * 2);
                        content = <div className="Home-info-container background project-9">
                                   <Colors 
                                    colors={color}
                                    cities={citiesToDraw}
                                    squareSampling={squareSampling}
                                    width={this.state.width}
                                    height={this.state.height}
                                   />
                                 </div> 
                      }

                      else{
                        content = <div className="Home-info-container background project-9">
                                    <Loader />
                                  </div> 
                      }

                       
                      break;
                  case 10:
                    content = <div className="Home-info-container background project-9">
                                <Nostalgia />
                              </div> 
                      break;    
                  default:
                      content = null;
              }
              return content;
      }

      render() {

        return (
          <div className="Home">
            <header className="Home-header 4">
              
            </header>
            {this.getBackgroundContent()}        
          </div>
        );
      }
    }




    export default Home;
