import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import './Menu.css'

const displayNames = {
    '/autostereogram': 'magic eye',
}

const Menu = (props) => {
    const listRef = useRef<HTMLUListElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)

    useEffect(() => {
        props.setIndexBackground(props.options[0])
    }, [])

    useEffect(() => {
        if (!listRef.current) return

        let ticking = false
        const handleScroll = () => {
            if (ticking) return
            ticking = true
            requestAnimationFrame(() => {
                const items = listRef.current?.querySelectorAll('li')
                if (!items) { ticking = false; return }
                const center = window.innerHeight / 2
                let closest = 0
                let minDist = Infinity
                items.forEach((li, i) => {
                    const rect = li.getBoundingClientRect()
                    const dist = Math.abs(rect.top + rect.height / 2 - center)
                    if (dist < minDist) { minDist = dist; closest = i }
                })
                if (closest !== activeIndex) {
                    setActiveIndex(closest)
                    props.setIndexBackground(props.options[closest])
                }
                ticking = false
            })
        }

        const el = listRef.current
        el.addEventListener('scroll', handleScroll, { passive: true })
        return () => el.removeEventListener('scroll', handleScroll)
    }, [activeIndex, props.options])

    return (
        <ul className="Menu" ref={listRef}>
            {props.options.map((element, index) => (
                <li key={index} className={index === activeIndex ? 'active' : ''}>
                    <Link to={`/bit${element}`}>
                        {displayNames[element] || element.slice(1).replace('-', ' ')}
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export default Menu
