import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Scaffold from './Scaffold.js'
import registerServiceWorker from './registerServiceWorker'
import './fonts/LubalinGraphStd-Medium/font.woff'
import './fonts/LubalinGraphStd-Medium/font.woff2'
import { BrowserRouter as Router } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'

import About from './About.tsx'
import Blog from './Blog.tsx'
import Names from './Names.tsx'
import Post from './Post.tsx'
import Calendar from './Calendar.tsx'

const root = createRoot(document.getElementById('root'))

let host = window.location.host.split('.')

const banditHost = process.env.REACT_APP_API_HOST

if (host.length && host[0] === 'blog') {
    root.render(
        <Router>
            <div className="Blog">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Blog title={'Else'} url={`${banditHost}/posts`} />
                        }
                    />

                    <Route
                        path="/post/:slug"
                        element={<Post url={`${banditHost}/post`} />}
                    />
                </Routes>
            </div>
        </Router>
    )
}

else if (host.length && host[0] === 'calendar' || true) {
    root.render(
        <Router>
            <Calendar />
        </Router>
    )
}

else if (host.length && host[0] === 'into') {
    root.render(
        <Router>
            <div className="Blog">
                <About />
            </div>
        </Router>
    )
}

else if (host.length && host[0] === 'poroto') {
    root.render(
        <Router>
            <div className="Blog">
                <Names />
            </div>
        </Router>
    )
}

else {
    root.render(
        <Router>
            <Scaffold />
        </Router>
    )
}

registerServiceWorker()
