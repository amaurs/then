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
import Album from './Album'
import Login from './Login'
import Flyer from './Flyer'
import ProtectedRoute from './ProtectedRoute'
import { AuthProvider } from './Hooks'

const root = createRoot(document.getElementById('root'))

let host = window.location.host.split('.')

const banditHost = process.env.REACT_APP_API_HOST

if (host.length && host[0] === 'blog') {
    root.render(
        <Router>
            <AuthProvider>
                <div className="Blog">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Blog
                                    title={'Else'}
                                    url={`${banditHost}/posts`}
                                />
                            }
                        />

                        <Route
                            path="/post/:slug"
                            element={<Post url={`${banditHost}/post`} />}
                        />

                        <Route
                            path="/calendar"
                            element={
                                <ProtectedRoute>
                                    <Calendar />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/calendar/:year/:month/:day"
                            element={
                                <ProtectedRoute>
                                    <Album />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="/login" element={<Login />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    )
} else if (host.length && host[0] === 'calendar') {
    root.render(
        <Router>
            <Calendar />
        </Router>
    )
} else if (host.length && host[0] === 'into') {
    root.render(
        <Router>
            <div className="Blog">
                <About />
            </div>
        </Router>
    )
} else if (host.length && host[0] === 'poroto') {
    root.render(
        <Router>
            <div className="Blog">
                <Names />
            </div>
        </Router>
    )
} else if (host.length && host[0] === 'flyer' || true) {
    root.render(
        <Router>
            <Flyer />
        </Router>
    )
} else {
    root.render(
        <Router>
            <Scaffold />
        </Router>
    )
}

registerServiceWorker()
