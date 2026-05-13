import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import posts from './posts'
import './prose.css'

const Post = () => {
    const { slug } = useParams()
    const [content, setContent] = useState('')

    useEffect(() => {
        const post = posts.find((p) => p.slug === slug)
        if (!post) return
        fetch(post.url)
            .then((res) => res.text())
            .then(setContent)
    }, [slug])

    return (
        <div className="Prose">
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    )
}

export default Post
