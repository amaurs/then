import React, { Component } from 'react';
import corrupted from './assets/corrupted.mp4'
import emji from './assets/emji.mp4'
import Voronoi from './Voronoi.js';
import robot from './assets/our-lady.jpg';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    let image = new Image();
    image.src = robot;
    image.onload = this.onLoad.bind(this);
    this.state = {
      width:0,
      height:0,
      section:0,
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

    this.setState({imageData: imageData,
                   imageWidth: image.width,
                   imageHeight: image.height
                  });
  }

  componentDidMount(){
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
    window.addEventListener("scroll", this.handleScroll.bind(this));

  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
    window.removeEventListener("keydown", this.add.bind(this));
    window.removeEventListener("scroll", this.handleScroll.bind(this));
  }

  updateDimensions(){
    let update_width  = window.innerWidth;
    let update_height = window.innerHeight;
    this.setState({ width: update_width, height: update_height });
  }

  handleScroll(event) {
    this.setState({ section: Math.floor((window.scrollY + this.state.height / 2 )/ this.state.height )});
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
                              <p className="roman roman-left">{romanize(this.state.section - 1)}</p>
                            </div>
                  break;
              case 3:
                  content = <div className="Home-info-container background project-3">
                              <p className="roman roman-right">{romanize(this.state.section - 1)}</p>
                            </div>
                  break;
              case 4:

                  let voronoi = null;
                  if(this.state.imageData) {
                    voronoi = <Voronoi imageData={this.state.imageData}
                                       width={this.state.width}
                                       height={this.state.height}
                                       imageWidth ={this.state.imageWidth  }
                                       imageHeight={this.state.imageHeight}
                                  />
                  }
                  content = <div className="Home-info-container background project-4">
                              {voronoi}
                              <p className="roman roman-left">{romanize(this.state.section - 1)}</p>
                            </div>
                  break;
              case 5:
                  content = <div className="Home-info-container background project-5">
                              <video autoPlay loop muted>
                                <source src={emji} type="video/mp4"/>
                              </video>
                              <p className="roman roman-right">{romanize(this.state.section - 1)}</p>
                            </div>
                  break;
              case 6:
                  content = <div className="Home-info-container background project-6">
                                <p className="roman roman-left">{romanize(this.state.section - 1)}</p>
                            </div>
                  break;
              case 7:
                  content = <div className="Home-info-container background project-7">
                              <iframe title="reinforcement" scrolling="no" src="https://amaurs.com/windy-gridworld/"></iframe>
                              <p className="roman roman-right">{romanize(this.state.section - 1)}</p>
                            </div>
                  break;
              case 8:
                  content = <div className="Home-info-container background project-0">
                              
                              <svg className="triangle-container triangle-contact" >
                                <polygon className="triangle triangle-color" points="90,10 75,160 193,120" />
                              </svg>
                              <p className="contact">Contact</p>
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
        <section>
          <article className = "project">
            <div className="description-box left">
              <p className="courier">I was born and raised in Mexico City. I am curious by nature. The sense of awe and wonder has led me to keep learning. I appreciate design. I am thrilled with street art around the world. I like to take 3d pictures, but most of all I love reshaping them pixel-wise with my own tools.</p>
            </div>
          </article>
          <article className = "project">
            <div className = "description-box right">
              <p className = "courier">This was about exploring the posibilities of programatically create glitches. Each individual frame is stored as a JPG and the data section is scrambled experimentally. The frames are then arranged into a video using iMovie.</p>
            </div>
          </article>
          <article className = "project">
            <div className = "description-box left">
              <p className = "courier">In this project a visualization of the Mandelbrot set is created.</p>
            </div>
          </article>
          <article className = "project">
            <div className = "description-box right">
              <p className = "courier">Exploring new methods to create images that resemble Pointillism, a wave that branches from Impressionism, we developed a novel way to place the dots instead of a regular grid. With the technique of rejection sampling, we select a random collection of points from a picture. Then we create a Voronoi diagram with this dataset and rearrange the centroids of each of its cells in each iteration. Finally, the process stops when the system stabilizes. Inspired by Adrian Secord's Weighted Voronoi Stippling.</p>
            </div>
          </article>
          <article className = "project">
            <div className = "description-box left">
              <p className = "courier">Exploration of stereoscopic photography using diferent types of cameras. Animated gifs as a medium to capture moments. A window to the past.</p>
            </div>
          </article>
          <article className = "project  ">
            <div className = "description-box right">
              <p className = "courier">Having developed a way to create images that contained all the pixels. I came up with this image which maps the color cube along a hilbert curve. The idea is very simple, but strickingly beautiful. Two space filling curves are used a 3d one to touch every single color un the color cube, and then a 2d Hilbert curve to map all of the colors into a square.</p>
            </div>
          </article>
          <article className = "project">
            <div className = "description-box left">
              <p className = "courier">An implementation of the classic windy gridworld game for reinforcement learning. The agent learns the correct path to the goal tile. Some of the tiles push the agent up uppon the next move.</p>
            </div>
          </article>
          <article className = "project">
            <div className = "description-box right">
              <p className = "courier">amaury.gtz@gmail.com</p>
            </div>
          </article>
        </section>
        
      </div>
    );
  }
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

export default Home;
