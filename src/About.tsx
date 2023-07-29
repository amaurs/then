import React, { useState, Fragment } from 'react'
import l2016 from './assets/2016/left.jpg'
import r2016 from './assets/2016/right.jpg'
import l2017 from './assets/2017/left.jpg'
import r2017 from './assets/2017/right.jpg'
import l2018 from './assets/2018/left.jpg'
import r2018 from './assets/2018/right.jpg'
import r2019 from './assets/2019/left.jpg'
import l2019 from './assets/2019/right.jpg'
import r2020 from './assets/2020/left.jpg'
import l2020 from './assets/2020/right.jpg'
import l2021 from './assets/2021/left.jpg'
import r2021 from './assets/2021/right.jpg'
import l2022 from './assets/2022/left.jpg'
import r2022 from './assets/2022/right.jpg'
import r2023 from './assets/2023/left.jpg'
import l2023 from './assets/2023/right.jpg'

import './About.css'

interface Props {
    title: string
    url: string
}

interface PhotoProps {
    title: string
    location: string
    subtitle: string
    left: string
    right: string
    class: string
}

const Photo = (props: PhotoProps, i: number, handleClick: () => void) => {
    return (
        <div className={`${props.class}Container`} key={i}>
            <h2>{props.title}</h2>
            <h3>{props.subtitle}</h3>
            <div className={`${props.class}`} onClick={handleClick}>
                <img className={`${props.class}Left`} src={props.left} />
                <img className={`${props.class}Right`} src={props.right} />
            </div>
            <p className="thick">{props.location}</p>
        </div>
    )
}

const About = (props: Props) => {
    const modes = ['Anaglyph', 'Wigglegram']

    let [modeIndex, setModeIndex] = useState<number>(0)

    let info = [
        {
            title: '2016',
            location: '23°07\'21.6"N 82°23\'56.6"W',
            subtitle: 'Necropolis. Vedado, Havana',
            left: l2016,
            right: r2016,
        },
        {
            title: '2017',
            location: '19°06\'31.4"N 99°45\'44.6"W',
            subtitle: 'Nevado de Toluca. Toluca, State of Mexico',
            left: l2017,
            right: r2017,
        },
        {
            title: '2018',
            location: '19°24\'29.0"N 99°12\'19.3"W',
            subtitle: 'Panteón de Dolores. Miguel Hidalgo, Mexico City',
            left: l2018,
            right: r2018,
        },
        {
            title: '2019',
            location: '37°47\'52.1"N 122°27\'54.4"W',
            subtitle: 'Presidio. San Francisco, California',
            left: l2019,
            right: r2019,
        },
        {
            title: '2020',
            location: '37°44\'17.8"N 122°27\'15.1"W',
            subtitle: 'Mt. Davidson Cross. San Francisco, California',
            left: l2020,
            right: r2020,
        },
        {
            title: '2021',
            location: '40°38\'51.6"N 73°59\'20.2"W',
            subtitle: 'Greenwood Cemetery. Brooklyn, New York',
            left: l2021,
            right: r2021,
        },
        {
            title: '2022',
            location: '19°21\'33.1"N 99°09\'53.6"W',
            subtitle: 'Xoco Cemetery. Coyoacan, Mexico City',
            left: l2022,
            right: r2022,
        },
        {
            title: '2023',
            location: '29°59\'07.2"N 90°06\'23.5"W',
            subtitle: 'Holt Cemetery. New Orleans, Louisiana',
            left: l2023,
            right: r2023,
        },
    ]

    const toggleMode = () => {
        setModeIndex((modeIndex + 1) % modes.length)
    }

    return (
        <div className="Column">
            <h1>Confines of Existence</h1>

            <p>
                On the day of my thirtieth birthday, as I wandered through the
                streets of Havana, I unexpectedly came across the Necropolis of
                Colon. Armed with a stereoscopic camera crafted from a
                couple of disposable cameras, I captured images of the exquisite
                statues.The following year, during a hike in the crater of an
                inactive volcano situated to the east of my hometown, Mexico
                City, I found a tomb, this time better prepared with a
                proper stereoscopic camera. These two moments would lay the
                foundation of a personal ritual that I would follow in the years
                to come.
            </p>
            <p>
                This tradition strengthened my bond with photography as a
                creative process and became a means of exploring the transience
                of time, the uniqueness of impermanence, and the transcendence
                of memories. Just as each visit to a cemetery is an unrepeatable
                experience, each photograph in this series tells a unique story:
                it is a close encounter with the duality of existence, and at
                the same time, a reflection on the finiteness of our lives.
            </p>
            <p>
                Being a child who grew up in the nineties, before the internet
                era, I vividly recall my fascination with anaglyphs when I first
                came into contact with them. As I matured, this enchantment
                became the very gateway into the world of photography. The
                decision to employ this format for my artworks arises from that
                enduring passion, acting as a vehicle to recollect intricate
                details of my own reflection year over year.
            </p>
            
            <p className='right noPadding'>
                <a className='signature' href="https://instagram.com/_amaurs">Amaury Acosta</a>
            </p>
            <p className='right'>
                San Francisco 2023
            </p>

            <div>
                {info.map((photoProps, i) =>
                    Photo(
                        { ...photoProps, class: modes[modeIndex] },
                        i,
                        toggleMode
                    )
                )}
            </div>

            <svg width="0" height="0">
                <defs>
                    <filter id="cyan">
                        <feColorMatrix
                            type="matrix"
                            values={[
                                0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0,
                                0, 0, 1, 0,
                            ].join(' ')}
                        />
                    </filter>
                    <filter id="red">
                        <feColorMatrix
                            type="matrix"
                            values={[
                                1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                0, 0, 1, 0,
                            ].join(' ')}
                        />
                    </filter>
                </defs>
            </svg>
        </div>
    )
}

export default About
