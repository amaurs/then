import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Menu from './Menu'
import Spinner from './Spinner'
import './Poroto.css'

const Names = lazy(() => import('./Names'))
const Flyer = lazy(() => import('./Flyer'))
const Days = lazy(() => import('./Days'))

const options = ['/names', '/flyer', '/days']
const linkTo = (option: string) => option

const PorotoMenu = () => <Menu options={options} linkTo={linkTo} />

const Poroto = () => (
    <Suspense fallback={<Spinner />}>
        <Routes>
            <Route path="/" element={<PorotoMenu />} />
            <Route path="/names" element={<Names />} />
            <Route path="/flyer" element={<Flyer />} />
            <Route path="/days" element={<Days />} />
        </Routes>
    </Suspense>
)

export default Poroto
