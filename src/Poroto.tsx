import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Menu from './Menu'
import Spinner from './Spinner'

const Names = lazy(() => import('./Names'))
const Flyer = lazy(() => import('./Flyer'))

const options = ['/names', '/flyer']
const linkTo = (option: string) => option

const PorotoMenu = () => <Menu options={options} linkTo={linkTo} />

const Poroto = () => (
    <Suspense fallback={<Spinner />}>
        <Routes>
            <Route path="/" element={<PorotoMenu />} />
            <Route path="/names" element={<Names />} />
            <Route path="/flyer" element={<Flyer />} />
        </Routes>
    </Suspense>
)

export default Poroto
