import React, { useState, useEffect, useRef, useMemo } from 'react'
import './Panama.css'

interface Token {
    start: number
    end: number
    time: number
}

interface TranslationSegment {
    text: string
    start: number
    end: number
}

type Block =
    | { type: 'image'; src: string }
    | {
          type: 'text'
          text: string
          tokens?: Token[]
          translations?: Record<string, TranslationSegment[]>
      }

interface Page {
    audio?: string
    blocks: Block[]
}

interface Manifest {
    language: string
    voice: string
    pages: Page[]
}

const SWIPE_THRESHOLD = 50
const TAP_THRESHOLD = 10
const BOOK_BASE = '/books/panama'

const Panama = () => {
    const [manifest, setManifest] = useState<Manifest | null>(null)
    const [current, setCurrent] = useState(0)
    const [activeKey, setActiveKey] = useState<string | null>(null)
    const [progress, setProgress] = useState(0)
    const [scrubbed, setScrubbed] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const scrubRef = useRef<HTMLDivElement | null>(null)
    const touchStartX = useRef<number | null>(null)
    const swipedRef = useRef(false)

    useEffect(() => {
        let cancel = false
        fetch(`${BOOK_BASE}/de.json`)
            .then((r) => r.json())
            .then((data: Manifest) => {
                if (!cancel) setManifest(data)
            })
        return () => {
            cancel = true
        }
    }, [])

    const page: Page | null = manifest?.pages[current] ?? null

    const flatTokens = useMemo(() => {
        if (!page) return []
        const out: { key: string; time: number }[] = []
        page.blocks.forEach((block, bi) => {
            if (block.type !== 'text' || !block.tokens) return
            block.tokens.forEach((token, ti) => {
                out.push({ key: `${bi}-${ti}`, time: token.time })
            })
        })
        return out
    }, [page])

    const activeSentenceInfo = useMemo(() => {
        if (!activeKey || !page) return null
        const [biStr, tiStr] = activeKey.split('-')
        const bi = parseInt(biStr),
            ti = parseInt(tiStr)
        const block = page.blocks[bi]
        if (
            !block ||
            block.type !== 'text' ||
            !block.tokens ||
            !block.translations?.en
        )
            return null
        const token = block.tokens[ti]
        if (!token) return null
        const seg = block.translations.en.find(
            (s) => token.start >= s.start && token.start < s.end
        )
        return seg
            ? { bi, start: seg.start, end: seg.end, subtitle: seg.text }
            : null
    }, [activeKey, page])

    useEffect(() => {
        if (!manifest) return
        ;[-1, 1].forEach((delta) => {
            const p = manifest.pages[current + delta]
            if (!p) return
            p.blocks
                .filter(
                    (b): b is { type: 'image'; src: string } =>
                        b.type === 'image'
                )
                .forEach((b) => {
                    new Image().src = `${BOOK_BASE}/images/${b.src}`
                })
        })
    }, [current, manifest])

    useEffect(() => {
        setActiveKey(null)
        setProgress(0)
        setScrubbed(false)
        const audio = audioRef.current
        if (!audio) return
        audio.pause()
        audio.currentTime = 0
        if (page?.audio) {
            audio.play().catch(() => {})
        }
    }, [current, page?.audio])

    const goNext = () => {
        if (!manifest) return
        setCurrent((c) => Math.min(c + 1, manifest.pages.length - 1))
    }
    const goPrev = () => setCurrent((c) => Math.max(c - 1, 0))

    const togglePlay = () => {
        const audio = audioRef.current
        if (!audio || !page?.audio) return
        if (audio.paused) audio.play().catch(() => {})
        else audio.pause()
    }

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') goNext()
            if (e.key === 'ArrowLeft') goPrev()
            if (e.key === ' ') {
                e.preventDefault()
                togglePlay()
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [manifest])

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX
        swipedRef.current = false
    }
    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return
        const dx = e.changedTouches[0].clientX - touchStartX.current
        if (dx > SWIPE_THRESHOLD) {
            swipedRef.current = true
            goPrev()
        } else if (dx < -SWIPE_THRESHOLD) {
            swipedRef.current = true
            goNext()
        }
        touchStartX.current = null
    }
    const onContentClick = () => {
        if (swipedRef.current) {
            swipedRef.current = false
            return
        }
        togglePlay()
    }

    const onTimeUpdate = () => {
        const audio = audioRef.current
        if (!audio) return
        const time = audio.currentTime * 1000
        let key: string | null = null
        for (let i = 0; i < flatTokens.length; i++) {
            if (flatTokens[i].time <= time) key = flatTokens[i].key
            else break
        }
        setActiveKey(key)
        const dur = audio.duration
        if (isFinite(dur) && dur > 0) setProgress(audio.currentTime / dur)
    }

    const seekFromPointer = (clientX: number) => {
        const audio = audioRef.current
        const track = scrubRef.current
        if (!audio || !track) return
        const dur = audio.duration
        if (!isFinite(dur) || dur <= 0) return
        const rect = track.getBoundingClientRect()
        const ratio = Math.max(
            0,
            Math.min(1, (clientX - rect.left) / rect.width)
        )
        audio.currentTime = ratio * dur
        setProgress(ratio)
    }

    const onScrubDown = (e: React.PointerEvent<HTMLDivElement>) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        setScrubbed(true)
        seekFromPointer(e.clientX)
    }
    const onScrubMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            seekFromPointer(e.clientX)
        }
    }
    const onScrubUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId)
        }
    }

    if (!manifest || !page) return null

    return (
        <div className="Panama">
            <div className="Panama-pageNumber">
                {current + 1} / {manifest.pages.length}
            </div>
            <div
                className="Panama-content"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                onClick={onContentClick}
            >
                {page.blocks.map((block, bi) =>
                    block.type === 'image' ? (
                        <img
                            key={bi}
                            className="Panama-image"
                            src={`${BOOK_BASE}/images/${block.src}`}
                            alt=""
                        />
                    ) : (
                        <TextBlock
                            key={bi}
                            block={block}
                            blockIndex={bi}
                            activeKey={activeKey}
                            sentenceRange={
                                activeSentenceInfo?.bi === bi
                                    ? {
                                          start: activeSentenceInfo.start,
                                          end: activeSentenceInfo.end,
                                      }
                                    : null
                            }
                        />
                    )
                )}
            </div>
            {page.audio && (
                <audio
                    ref={audioRef}
                    src={`${BOOK_BASE}/${page.audio}`}
                    onTimeUpdate={onTimeUpdate}
                />
            )}
            <div className="Panama-subtitle">
                {activeSentenceInfo && (
                    <span
                        key={`${activeSentenceInfo.bi}-${activeSentenceInfo.start}`}
                        className="Panama-subtitleText"
                    >
                        {activeSentenceInfo.subtitle}
                    </span>
                )}
            </div>
            <div
                ref={scrubRef}
                className="Panama-scrub"
                onPointerDown={onScrubDown}
                onPointerMove={onScrubMove}
                onPointerUp={onScrubUp}
                onPointerCancel={onScrubUp}
            >
                <div
                    className="Panama-scrubFill"
                    style={{ width: `${progress * 100}%` }}
                />
                {scrubbed && (
                    <div
                        className="Panama-scrubThumb"
                        style={{ left: `${progress * 100}%` }}
                    />
                )}
            </div>
        </div>
    )
}

const TextBlock = ({
    block,
    blockIndex,
    activeKey,
    sentenceRange,
}: {
    block: { type: 'text'; text: string; tokens?: Token[] }
    blockIndex: number
    activeKey: string | null
    sentenceRange: { start: number; end: number } | null
}) => {
    const inSentence = (cs: number, ce: number) =>
        sentenceRange
            ? cs < sentenceRange.end && ce > sentenceRange.start
            : false

    if (!block.tokens?.length) {
        return <p className="Panama-text">{block.text}</p>
    }
    const nodes: React.ReactNode[] = []
    let cursor = 0
    block.tokens.forEach((token, ti) => {
        if (cursor < token.start) {
            const gap = block.text.slice(cursor, token.start)
            nodes.push(
                inSentence(cursor, token.start) ? (
                    <span key={`g${cursor}`} className="Panama-sentence">
                        {gap}
                    </span>
                ) : (
                    gap
                )
            )
        }
        const key = `${blockIndex}-${ti}`
        const isActive = activeKey === key
        const inSent = inSentence(token.start, token.end)
        nodes.push(
            <span
                key={key}
                className={[
                    'Panama-word',
                    inSent ? 'Panama-sentence' : '',
                    isActive ? 'Panama-word--active' : '',
                ]
                    .filter(Boolean)
                    .join(' ')}
            >
                {block.text.slice(token.start, token.end)}
            </span>
        )
        cursor = token.end
    })
    if (cursor < block.text.length) {
        const tail = block.text.slice(cursor)
        nodes.push(
            inSentence(cursor, block.text.length) ? (
                <span key="tail" className="Panama-sentence">
                    {tail}
                </span>
            ) : (
                tail
            )
        )
    }
    return <p className="Panama-text">{nodes}</p>
}

export default Panama
