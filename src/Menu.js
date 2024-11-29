import React from 'react'
import { Link } from 'react-router-dom'

import './Menu.css'

const Menu = (props) => {
    return (
        <ul className="Menu">
            {props.options.map((element, index) => {
                return (
                    <li key={index}>
                        <Link
                            to={`/bit${element}`}
                            onMouseEnter={() => {
                                props.setIndexBackground(element)
                                props.setIsCursorOnMenu(true)
                            }}
                            onMouseLeave={() => {
                                props.setIndexBackground(null)
                                props.setIsCursorOnMenu(false)
                            }}
                        >
                            {element.slice(1).replace('-', ' ')}
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}

export default Menu
