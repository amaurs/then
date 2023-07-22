import React from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'

import './Menu.css'

const Menu = (props) => {
    
    const { slug } = useParams()

    return (
        <ul className="Menu">
            {props.options.map((element, index) => {
                return (
                    <li key={index}>
                        <Link
                            to={'/bit' + element}
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
                        {slug === element.slice(1)? <h1 className='Content'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu tortor odio. Donec sed efficitur dui. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vestibulum congue lectus sed sagittis ornare. Donec scelerisque risus eu ante hendrerit elementum. Sed eu ligula nibh. Aliquam dictum accumsan ipsum non gravida. Vestibulum et pulvinar diam. Cras ut lorem ut quam elementum eleifend porttitor a felis. Integer pulvinar et odio quis scelerisque. Praesent mattis quam malesuada lacus tempus commodo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris id ante orci. Donec porta, dui vel congue pellentesque, nulla dolor ullamcorper ligula, sed placerat felis mauris ut lacus. Curabitur urna nibh, viverra in dui ac, ultrices fermentum turpis. Donec congue vulputate dui ut mollis.

Aenean in lacus faucibus, blandit velit viverra, gravida nulla. Pellentesque non efficitur risus. Mauris vel euismod leo. Etiam eget velit condimentum, mollis augue dictum, sodales diam. Curabitur vitae massa quis elit pulvinar congue. In congue vel massa ac malesuada. Cras risus orci, iaculis sed malesuada sed, facilisis et eros.

Proin egestas, ante feugiat convallis porta, nibh ante ultricies metus, vitae ultricies justo dolor quis nulla. Etiam dapibus justo ut tempor semper. Ut rutrum enim lectus, eget scelerisque mauris consectetur vel. Fusce vitae quam eget mi dignissim iaculis. Suspendisse tristique blandit imperdiet. Mauris euismod nisi lacus, nec gravida quam facilisis eu. Vivamus quis turpis id orci hendrerit posuere. Suspendisse at cursus lacus.</h1> : null}
                    </li>
                )
            })}
        </ul>
    )
}

export default Menu
