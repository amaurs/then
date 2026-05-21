import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Then from './Then'
import { useInterval } from './Hooks'

import './Menu.css'

const displayNames = {
    '/autostereogram': 'magic eye',
}

const defaultLinkTo = (option: string) => `/bit${option}`
const noop = () => {}

const Menu = (props: {
    options: string[]
    setIndexBackground?: (key: string) => void
    linkTo?: (option: string) => string
    style?: React.CSSProperties
    screensaver?: {
        active: boolean
        rotationInterval?: number
    }
    onScroll?: () => void
}) => {
    const listRef = useRef<HTMLUListElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const prevScreensaverActiveRef = useRef(false)
    const screensaverIdxRef = useRef(0)
    const absorbClickRef = useRef(false)
    const programmaticScrollRef = useRef(false)
    const setIndexBackground = props.setIndexBackground ?? noop
    const linkTo = props.linkTo ?? defaultLinkTo

    useEffect(() => {
        setIndexBackground(props.options[0])
    }, [])

    useEffect(() => {
        if (!listRef.current) return

        let ticking = false
        const handleScroll = () => {
            if (programmaticScrollRef.current) return
            props.onScroll?.()
            if (ticking) return
            ticking = true
            requestAnimationFrame(() => {
                const items = listRef.current?.querySelectorAll('li')
                if (!items) {
                    ticking = false
                    return
                }
                const center = window.innerHeight / 2
                let closest = 0
                let minDist = Infinity
                items.forEach((li, i) => {
                    const rect = li.getBoundingClientRect()
                    const dist = Math.abs(rect.top + rect.height / 2 - center)
                    if (dist < minDist) {
                        minDist = dist
                        closest = i
                    }
                })
                if (closest !== activeIndex) {
                    setActiveIndex(closest)
                    setIndexBackground(props.options[closest])
                }
                ticking = false
            })
        }

        const el = listRef.current
        el.addEventListener('scroll', handleScroll, { passive: true })
        return () => el.removeEventListener('scroll', handleScroll)
    }, [activeIndex, props.options])

    const rotationInterval = props.screensaver?.rotationInterval ?? 10_000
    useInterval(
        () => {
            const len = props.options.length
            let nextIdx = Math.floor(Math.random() * len)
            if (nextIdx === screensaverIdxRef.current && len > 1) {
                nextIdx = (nextIdx + 1) % len
            }
            screensaverIdxRef.current = nextIdx
            setIndexBackground(props.options[nextIdx])
        },
        props.screensaver?.active ? rotationInterval : null
    )

    useLayoutEffect(() => {
        const isActive = props.screensaver?.active ?? false
        const wasActive = prevScreensaverActiveRef.current
        prevScreensaverActiveRef.current = isActive

        if (!wasActive && isActive) {
            screensaverIdxRef.current = activeIndex
        }

        if (wasActive && !isActive) {
            const idx = screensaverIdxRef.current
            setActiveIndex(idx)
            const list = listRef.current
            const li = list?.querySelectorAll('li')[idx] as
                | HTMLElement
                | undefined
            if (li && list) {
                programmaticScrollRef.current = true
                list.scrollTop =
                    li.offsetTop - list.clientHeight / 2 + li.offsetHeight / 2
                setTimeout(() => {
                    programmaticScrollRef.current = false
                }, 200)
            }
            absorbClickRef.current = true
            setTimeout(() => {
                absorbClickRef.current = false
            }, 400)
        }
    })

    return (
        <>
            <ul
                className="Menu"
                ref={listRef}
                onClickCapture={(e) => {
                    if (absorbClickRef.current) {
                        e.preventDefault()
                        e.stopPropagation()
                        absorbClickRef.current = false
                    }
                }}
                style={{
                    ...props.style,
                    opacity: props.screensaver?.active ? 0 : 1,
                    pointerEvents: props.screensaver?.active ? 'none' : 'auto',
                }}
            >
                {props.options.map((element, index) => (
                    <li
                        key={index}
                        className={index === activeIndex ? 'active' : ''}
                    >
                        <Link to={linkTo(element)}>
                            {displayNames[element] ||
                                element.slice(1).replace('-', ' ')}
                        </Link>
                    </li>
                ))}
            </ul>
            {props.screensaver?.active && <Then />}
        </>
    )
}

export default Menu
