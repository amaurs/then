import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Scaffold from './Scaffold.js'
import registerServiceWorker from './registerServiceWorker'
import './fonts/LubalinGraphStd-Medium/font.woff'
import './fonts/LubalinGraphStd-Medium/font.woff2'
import { BrowserRouter as Router } from 'react-router-dom'

const root = createRoot(document.getElementById('root'))

root.render(
    <Router>
        <Scaffold />
    </Router>
)
registerServiceWorker()
