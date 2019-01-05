import React, { Component } from 'react';
import corrupted from './assets/escudo.m4v'
import emji from './assets/emji.mp4'
import Voronoi from './Voronoi.js';
import robot from './assets/our-lady.jpg';
import { getXYfromIndex } from './util.js';
import './Home.css';
import Cube from './Cube.js'

const SECTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const apiHost = process.env.REACT_APP_API_HOST;

function mod(n, m) {
  return ((n % m) + m) % m;
}

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
    this.state = {
      width:0,
      height:0,
      section:0,
      points: null
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
    let totalDate = [];
    for(let index = 0; index < image.width * image.height; index++) {
        let pixel = getXYfromIndex(index, image.width);
        totalDate.push({
                         x: pixel[0],
                         y: pixel[1],
                         r: imageData.data[index * 4],
                         g: imageData.data[index * 4 + 1],
                         b: imageData.data[index * 4 + 2],
                       });
    }
    console.log(totalDate);

    this.setState({imageData: imageData,
                   totalDate: totalDate,
                   imageWidth: image.width,
                   imageHeight: image.height
                  });
  }

  componentDidMount(){
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
    //window.addEventListener("scroll", this.handleScroll.bind(this));
    document.addEventListener("keydown", this.handleKeyPress.bind(this));

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
    let section = this.state.section;
    console.log(section)
    if (event.key === 'ArrowDown') {
      section = mod(section + 1, SECTIONS.length);
      this.setState({ section: section });
    }
    if (event.key === 'ArrowUp') {
      section = mod(section - 1, SECTIONS.length);
      this.setState({ section: section });
    }
  };

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
                            </div>
                  break;
              case 4:

                  let voronoi = null;
                  if(this.state.imageData) {
                    voronoi = <Voronoi imageData={this.state.totalDate}
                                       width={this.state.width}
                                       height={this.state.height}
                                       imageWidth ={this.state.imageWidth  }
                                       imageHeight={this.state.imageHeight}
                                  />
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
                  content = <div className="Home-info-container background project-7">
                              <iframe title="reinforcement" scrolling="no" src="https://amaurs.com/windy-gridworld/"></iframe>
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
