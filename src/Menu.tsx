import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import './Menu.css'

const useIsCoarse = () => {
    const [coarse, setCoarse] = useState(() => window.matchMedia('(pointer: coarse)').matches)
    useEffect(() => {
        const mq = window.matchMedia('(pointer: coarse)')
        const handler = (e: MediaQueryListEvent) => setCoarse(e.matches)
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [])
    return coarse
}

const Menu = (props) => {
    const listRef = useRef<HTMLUListElement>(null)
    const isCoarse = useIsCoarse()
    const [activeIndex, setActiveIndex] = useState(isCoarse ? 0 : -1)

    useEffect(() => {
        if (!isCoarse) return
        setActiveIndex(0)
        props.setIndexBackground(props.options[0])
        props.setIsCursorOnMenu(true)
    }, [isCoarse])

    useEffect(() => {
        if (!isCoarse || !listRef.current) return

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
    }, [isCoarse, activeIndex, props.options])

    return (
        <ul className={`Menu ${isCoarse ? 'coarse' : ''}`} ref={listRef}>
            {props.options.map((element, index) => (
                <li key={index} className={isCoarse && index === activeIndex ? 'active' : ''}>
                    <Link
                        to={`/bit${element}`}
                        {...(!isCoarse && {
                            onMouseEnter: () => {
                                props.setIndexBackground(element)
                                props.setIsCursorOnMenu(true)
                            },
                            onMouseLeave: () => {
                                props.setIndexBackground(null)
                                props.setIsCursorOnMenu(false)
                            },
                        })}
                    >
                        {element.slice(1).replace('-', ' ')}
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export default Menu
