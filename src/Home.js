import React, { Component } from 'react';
import './Home.css';

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <header className="Home-header">
          <h1 className="Home-title">Amaury Gutiérrez</h1>
        </header>
        <p className="Home-intro">
          "Home sweet home."
        </p>
      </div>
    );
  }
}

export default Home;
