import React from 'react';
import { Link } from 'react-router-dom'

import './Navigation.css';



const Navigation = () => {

    return (
        <nav className="Navigation">
            <ul>
                <Link to="/" className="nav-link">
                    <span>Home</span>
                </Link>
                <Link to="/bits" className="nav-link">
                    <span>Bits</span>
                </Link>
                <Link to="/blog" className="nav-link">
                    <span>Blog</span>
                </Link>
            </ul>
        </nav>
        );
}

export default Navigation
