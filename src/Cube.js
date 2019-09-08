import React, { Component } from 'react';
import * as THREE from 'three-full';
import AnaglyphSVGRenderer from './AnaglyphSVGRenderer.js';
import './Cube.css'


class Cube extends Component{


  constructor(props) {
    console.log(props)
    super(props);
  }


  componentDidMount() {

        const vertices = this.props.points;
      
        const width = this.mount.clientWidth
        const height = this.mount.clientHeight
        const material = new THREE.LineBasicMaterial({ color: 0x000000, 
                                                       linewidth: 2,
                                                       opacity: 1 });

    
    
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000 )
        this.camera.position.z = 4
        this.renderer = new AnaglyphSVGRenderer(width, height);
        this.renderer.setClearColor(0xffffff, 0.0);
        this.mount.appendChild(this.renderer.domElement)
        let geometry = new THREE.BufferGeometry();

        geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

        this.line = new THREE.Line( geometry, material );
              
        this.scene.add( this.line );
        this.start()

        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    
  }



  componentWillUnmount() {
    this.stop()
    while (this.mount.firstChild) {
        this.mount.removeChild(this.mount.firstChild);
    }
  }

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  stop = () => {
    cancelAnimationFrame(this.frameId)
  }

  animate = () => {
    //this.line.rotation.x += 0.01
    //this.line.rotation.y += 0.01
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }

  render() {
    return(
      <div
        className="Cube"
        ref={(mount) => { this.mount = mount }}
      />
    )
  }
}
export default Cube