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
}

const Wigglegram = (props: PhotoProps) => {
    return (
        <div className="WigglegramWrapper">
            <h2>{props.title}</h2>
            <h3>{props.subtitle}</h3>
            <div className="WigglegramContainer">
                <img className="Wigglegram" src={props.left} />
                <img className="Wigglegram" src={props.right} />
            </div>
            <p>{props.location}</p>
        </div>
    )
}

const Anaglyph = (props: PhotoProps) => {
    return (
        <div className="AnaglyphWrapper">
            <h3>{props.subtitle}</h3>
            <div className="AnaglyphContainer">
                <img className="AnaglyphLeft" src={props.left} />
                <img className="AnaglyphRight" src={props.right} />
            </div>
            <p>{props.location ? props.location : '0.0, 0.0'}</p>
        </div>
    )
}

const SideBySide = (props: PhotoProps) => {
    return (
        <div className="SideWrapper">
            <h2>{props.title}</h2>
            <h3>{props.subtitle}</h3>
            <div className="SideContainer">
                <img className="Side" src={props.left} />
                <img className="Side" src={props.right} />
            </div>
            <p>{props.location ? props.location : '0.0, 0.0'}</p>
        </div>
    )
}

const About = (props: Props) => {
    let [posts, setPosts] = useState<Array<string> | undefined>(undefined)

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

    return (
        <Fragment>
            <h1>Confines of Existence</h1>

            <h2>March 23, 2016. Havana, Cuba</h2>
            <p>
                I would never have imagined that, on my thirtieth birthday,
                chance would take me to a place like the Necropolis, in Havana,
                Cuba. With the intention of capturing the particularity of that
                moment, I photographed a grave with the Holga 3D that I had on
                hand. The following year, driven by a strange fascination, I
                repeated the ritual: this time I went to the Dolores cemetery in
                Mexico City. Some time later I came to the conclusion that the
                unconscious, intentionality and chance weave a network that
                drives creation: without knowing it, with the photo taken in
                Havana, I inaugurated a tradition that would continue in
                consecutive years.
            </p>
            <p>
                The paradox of visiting cemeteries, when celebrating the
                beginning of my life, led me to reflect on life and death as two
                inescapable pillars of our existence. The repetition of the act
                strengthened my bond with photography as a creative process and
                became a means of exploring the transience of time, the
                uniqueness of impermanence, and the transcendence of memories.
                Just as each visit to the cemetery is an unrepeatable
                experience, each photograph in this series tells a unique story:
                it is a close encounter with the duality of existence, and at
                the same time, a reflection on the finiteness of our time in
                this world.
            </p>
            <p>
                My approach to this type of format arose when, browsing the
                Internet, I discovered animated gifs. Curiosity led me to
                investigate more about the creation of these images, and soon
                after, I acquired the Holga 3D, a camera that became one of my
                main creative tools. This modality represents for me something
                more than a simple two-dimensional image; it's a more
                comprehensive capture of significant moments. The 3D format
                immortalizes the essence and movement of each moment with a
                depth that goes beyond the limits of a conventional photograph.
            </p>
            <p>
                Paradoxically, 3D photography led me to analogue photography in
                2011, marking a milestone in my artistic career.
            </p>
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

            {info.map((photoProps) => Wigglegram(photoProps))}
        </Fragment>
    )
}

export default About
