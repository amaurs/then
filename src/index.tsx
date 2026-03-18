import React, { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './fonts/LubalinGraphStd-Medium/font.woff'
import './fonts/LubalinGraphStd-Medium/font.woff2'
import { BrowserRouter as Router } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'

const Scaffold = lazy(() => import('./Scaffold'))
const About = lazy(() => import('./About'))
const Blog = lazy(() => import('./Blog'))
const Names = lazy(() => import('./Names'))
const Post = lazy(() => import('./Post'))
const Calendar = lazy(() => import('./Calendar'))
const Album = lazy(() => import('./Album'))
const Login = lazy(() => import('./Login'))
const Flyer = lazy(() => import('./Flyer'))
const Days = lazy(() => import('./Days'))
import ProtectedRoute from './ProtectedRoute'
import { AuthProvider } from './Hooks'
import { CalendarProvider } from './CalendarContext'

const root = createRoot(document.getElementById('root'))

let host = window.location.host.split('.')

const banditHost = import.meta.env.VITE_API_HOST

if (host.length && host[0] === 'blog') {
    root.render(
        <Router>
            <Suspense fallback={null}>
                <AuthProvider>
                    <CalendarProvider>
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
                                    element={
                                        <Post url={`${banditHost}/post`} />
                                    }
                                />

                                <Route path="/invite" element={<Flyer />} />

                                <Route path="/days" element={<Days />} />

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
                    </CalendarProvider>
                </AuthProvider>
            </Suspense>
        </Router>
    )
} else if (host.length && host[0] === 'calendar') {
    root.render(
        <Router>
            <Suspense fallback={null}>
                <Calendar />
            </Suspense>
        </Router>
    )
} else if (host.length && host[0] === 'into') {
    root.render(
        <Router>
            <Suspense fallback={null}>
                <div className="Blog">
                    <About />
                </div>
            </Suspense>
        </Router>
    )
} else if (host.length && host[0] === 'poroto') {
    root.render(
        <Router>
            <Suspense fallback={null}>
                <div className="Blog">
                    <Names />
                </div>
            </Suspense>
        </Router>
    )
} else if (host.length && host[0] === 'baby') {
    root.render(
        <Router>
            <Suspense fallback={null}>
                <Flyer />
            </Suspense>
        </Router>
    )
} else {
    root.render(
        <Router>
            <Suspense fallback={null}>
                <Scaffold />
            </Suspense>
        </Router>
    )
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
}
