import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import './BitView.css'
import './prose.css'

const HIDE_DELAY = 10000

const BitView = ({ content, title, shortCode, mode, onToggle }) => {
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        if (mode !== 'gallery') return
        let timer = setTimeout(() => setVisible(false), HIDE_DELAY)
        const onMove = () => {
            setVisible(true)
            clearTimeout(timer)
            timer = setTimeout(() => setVisible(false), HIDE_DELAY)
        }
        window.addEventListener('mousemove', onMove)
        return () => {
            clearTimeout(timer)
            window.removeEventListener('mousemove', onMove)
        }
    }, [mode])

    const handleKey = useCallback(
        (e) => {
            if (e.key === 'i') onToggle()
        },
        [onToggle]
    )

    useEffect(() => {
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [handleKey])

    const hidden = mode === 'gallery' && !visible

    return (
        <>
            <Link
                to="/"
                className={`BackButton${hidden ? ' hidden' : ''}`}
                aria-label="Back to menu"
            >
                <span className="Chevron" />
            </Link>
            <button
                className={`ModeToggle${hidden ? ' hidden' : ''}`}
                onClick={onToggle}
                aria-label={mode === 'gallery' ? 'Open studio' : 'Close studio'}
            >
                <span
                    className={`Cross${mode === 'studio' ? ' rotated' : ''}`}
                />
            </button>
            {mode === 'studio' && (
                <div className="StudioView">
                    <div className="StudioView-content Prose">
                        <ReactMarkdown>{content}</ReactMarkdown>
                        {shortCode && (
                            <div className="StudioView-meta">
                                Code: {shortCode}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default BitView
