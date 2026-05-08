import React, { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './fonts/LubalinGraphStd-Medium/font.woff'
import './fonts/LubalinGraphStd-Medium/font.woff2'
import { BrowserRouter as Router } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'

const Scaffold = lazy(() => import('./Scaffold'))
const About = lazy(() => import('./About'))
const Blog = lazy(() => import('./Blog'))
const Names = lazy(() => import('./Names'))
const Post = lazy(() => import('./Post'))
const Calendar = lazy(() => import('./Calendar'))
const Album = lazy(() => import('./Album'))
const Flyer = lazy(() => import('./Flyer'))
const Days = lazy(() => import('./Days'))
const Machine = lazy(() => import('./Machine'))
import ProtectedRoute from './ProtectedRoute'
import { AuthProvider } from './Hooks'
import { CalendarProvider } from './CalendarContext'
import Spinner from './Spinner'

const root = createRoot(document.getElementById('root'))

let host = window.location.host.split('.')

const banditHost = import.meta.env.VITE_API_HOST
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

if (host.length && host[0] === 'blog') {
    root.render(
        <GoogleOAuthProvider clientId={googleClientId}>
            <Router>
                <Suspense fallback={<Spinner />}>
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
                                            <ProtectedRoute requiredRole="family">
                                                <Calendar />
                                            </ProtectedRoute>
                                        }
                                    />

                                    <Route
                                        path="/calendar/:year/:month/:day"
                                        element={
                                            <ProtectedRoute requiredRole="family">
                                                <Album />
                                            </ProtectedRoute>
                                        }
                                    />
                                </Routes>
                            </div>
                        </CalendarProvider>
                    </AuthProvider>
                </Suspense>
            </Router>
        </GoogleOAuthProvider>
    )
} else if (host.length && host[0] === 'calendar') {
    root.render(
        <Router>
            <Suspense fallback={<Spinner />}>
                <Calendar />
            </Suspense>
        </Router>
    )
} else if (host.length && host[0] === 'into') {
    root.render(
        <Router>
            <Suspense fallback={<Spinner />}>
                <div className="Blog">
                    <About />
                </div>
            </Suspense>
        </Router>
    )
} else if (host.length && host[0] === 'machine') {
    root.render(
        <GoogleOAuthProvider clientId={googleClientId}>
            <Router>
                <Suspense fallback={<Spinner />}>
                    <AuthProvider>
                        <ProtectedRoute requiredRole="owner">
                            <Machine />
                        </ProtectedRoute>
                    </AuthProvider>
                </Suspense>
            </Router>
        </GoogleOAuthProvider>
    )
} else if (host.length && host[0] === 'poroto') {
    root.render(
        <Router>
            <Suspense fallback={<Spinner />}>
                <div className="Blog">
                    <Names />
                </div>
            </Suspense>
        </Router>
    )
} else if (host.length && host[0] === 'baby') {
    root.render(
        <Router>
            <Suspense fallback={<Spinner />}>
                <Flyer />
            </Suspense>
        </Router>
    )
} else {
    root.render(
        <Router>
            <Suspense fallback={<Spinner />}>
                <Scaffold />
            </Suspense>
        </Router>
    )
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
}
