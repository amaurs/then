import React, { Component } from 'react';
import './Hamburger.css';

export default class Hamburger extends Component {
    render() {
        return (
            <div onClick={this.props.onClick} className={"Hamburger" + (this.props.isActive?" active":"")}>
                <div className="Hamburger-hamburger"></div>
            </div>
        );
    }
}
