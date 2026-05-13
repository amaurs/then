import React from 'react'
import { Link } from 'react-router-dom'
import posts from './posts'

import './prose.css'

const Blog = () => {
    return (
        <div className="Prose">
            <h1>Else</h1>
            <ul>
                {posts.map(({ slug }) => (
                    <li key={slug}>
                        <Link to={'/posts/' + slug}>
                            {slug.replaceAll('-', ' ').replaceAll('.md', '')}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Blog
