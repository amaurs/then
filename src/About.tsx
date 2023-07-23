import React, { useState, Fragment } from 'react'
import l2019 from './assets/left.jpg'
import r2019 from './assets/right.jpg'

import './About.css'

interface Props {
    title: string
    url: string
}

const About = (props: Props) => {
    let [posts, setPosts] = useState<Array<string> | undefined>(undefined)

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
            <svg width="100%" height="100%">
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

            <div className="WigglegramWrapper">
                <div className="WigglegramContainer">
                    <img className="Wigglegram" src={r2019} />
                    <img className="Wigglegram" src={l2019} />
                </div>
            </div>

            <div className="SideWrapper">
                <div className="SideContainer">
                    <img className="Side" src={r2019} />
                    <img className="Side" src={l2019} />
                </div>
            </div>

            <div className="AnaglyphWrapper">
                <div className="AnaglyphContainer">
                    <img className="AnaglyphLeft" src={r2019} />
                    <img className="AnaglyphRight" src={l2019} />
                </div>
            </div>
        </Fragment>
    )
}

export default About
