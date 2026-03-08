import React from 'react'
import ReactMarkdown from 'react-markdown'
import './BitView.css'

const BitView = ({ content, title, shortCode, mode, onToggle }) => (
    <>
        <button className="ModeToggle" onClick={onToggle}>
            {mode === 'gallery' ? 'Studio' : 'Gallery'}
        </button>
        {mode === 'studio' && (
            <div className="StudioView">
                <div className="StudioView-content">
                    <ReactMarkdown>{content}</ReactMarkdown>
                    {shortCode && (
                        <div className="StudioView-meta">Code: {shortCode}</div>
                    )}
                </div>
            </div>
        )}
    </>
)

export default BitView
