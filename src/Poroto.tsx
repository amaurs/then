import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Menu from './Menu'
import Spinner from './Spinner'
import './Poroto.css'

const Names = lazy(() => import('./Names'))
const Flyer = lazy(() => import('./Flyer'))
const Days = lazy(() => import('./Days'))
const Panama = lazy(() => import('./Panama'))

const options = ['/names', '/flyer', '/days', '/panama']
const linkTo = (option: string) => option

const PorotoMenu = () => <Menu options={options} linkTo={linkTo} />

const Poroto = () => (
    <Suspense fallback={<Spinner />}>
        <Routes>
            <Route path="/" element={<PorotoMenu />} />
            <Route path="/names" element={<Names />} />
            <Route path="/flyer" element={<Flyer />} />
            <Route path="/days" element={<Days />} />
            <Route path="/panama" element={<Panama />} />
        </Routes>
    </Suspense>
)

export default Poroto
