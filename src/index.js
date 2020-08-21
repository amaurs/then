import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Scaffold from './Scaffold.js';
import registerServiceWorker from './registerServiceWorker';
import './fonts/LubalinGraphStd-Medium/font.woff';
import './fonts/LubalinGraphStd-Medium/font.woff2';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(<Router><Scaffold /></Router>, document.getElementById('root'));
registerServiceWorker();
