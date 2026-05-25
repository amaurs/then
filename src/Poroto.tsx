import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Menu from './Menu'
import Spinner from './Spinner'
import './Poroto.css'

const Names = lazy(() => import('./Names'))
const Flyer = lazy(() => import('./Flyer'))
const Days = lazy(() => import('./Days'))
const Panama = lazy(() => import('./Panama'))
const Recorder = lazy(() => import('./Recorder'))

const options = ['/names', '/flyer', '/days', '/panama', '/record']
const linkTo = (option: string) => option

const PorotoMenu = () => <Menu options={options} linkTo={linkTo} />

const Poroto = () => (
    <Suspense fallback={<Spinner />}>
        <Routes>
            <Route path="/" element={<PorotoMenu />} />
            <Route path="/names" element={<Names />} />
            <Route path="/flyer" element={<Flyer />} />
            <Route path="/days" element={<Days />} />
            <Route path="/panama/:page?" element={<Panama />} />
            <Route path="/record" element={<Recorder />} />
        </Routes>
    </Suspense>
)

export default Poroto
