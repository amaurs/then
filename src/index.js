import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home.js';
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(<Router><Home /></Router>, document.getElementById('root'));
registerServiceWorker();
