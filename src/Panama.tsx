import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useRef,
    useMemo,
} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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

const SNAP_RATIO = 0.3
const BOOK_BASE = '/books/panama'

const Panama = () => {
    const { page: pageParam } = useParams<{ page?: string }>()
    const navigate = useNavigate()
    const [manifest, setManifest] = useState<Manifest | null>(null)
    const [current, setCurrent] = useState(() => {
        const n = parseInt(pageParam ?? '1', 10)
        return isNaN(n) || n < 1 ? 0 : n - 1
    })
    const [centerSlot, setCenterSlot] = useState(1)
    const [activeKey, setActiveKey] = useState<string | null>(null)
    const [progress, setProgress] = useState(0)
    const [scrubbed, setScrubbed] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const scrubRef = useRef<HTMLDivElement | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const dragOffsetRef = useRef(0)
    const touchStartX = useRef<number | null>(null)
    const touchStartY = useRef<number | null>(null)
    const isDragging = useRef(false)
    const isAnimating = useRef(false)
    const snapCallbackRef = useRef<(() => void) | null>(null)
    const touchHandledRef = useRef(false)

    useEffect(() => {
        let cancel = false
        fetch(`${BOOK_BASE}/de.json`)
            .then((r) => r.json())
            .then((data: Manifest) => {
                if (!cancel) {
                    setManifest(data)
                    setCurrent((c) => Math.min(c, data.pages.length - 1))
                }
            })
        return () => {
            cancel = true
        }
    }, [])

    useEffect(() => {
        navigate(`/panama/${current + 1}`, { replace: true })
    }, [current])

    const page: Page | null = manifest?.pages[current] ?? null

    // Which page each slot shows, relative to centerSlot:
    //   rel 0 → current, rel 1 → next, rel 2 → prev
    const slotRelative = (slot: number) => (((slot - centerSlot) % 3) + 3) % 3

    const slotPage = (slot: number): Page | null => {
        if (!manifest) return null
        const rel = slotRelative(slot)
        const idx = rel === 0 ? current : rel === 1 ? current + 1 : current - 1
        return manifest.pages[idx] ?? null
    }

    const slotLeft = (slot: number): string => {
        const rel = slotRelative(slot)
        if (rel === 0) return '0%'
        if (rel === 1) return '100%'
        return '-100%'
    }

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
                    const img = new Image()
                    img.src = `${BOOK_BASE}/images/${b.src}`
                    img.decode().catch(() => {})
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

    const applyTransform = (offset: number, animated: boolean) => {
        const container = containerRef.current
        if (!container) return
        dragOffsetRef.current = offset
        container.style.transition = animated
            ? 'transform 0.3s ease-out'
            : 'none'
        container.style.transform = `translateX(${offset}px)`
    }

    const goNext = () => {
        if (!manifest) return
        setCenterSlot((cs) => (cs + 1) % 3)
        setCurrent((c) => Math.min(c + 1, manifest.pages.length - 1))
    }
    const goPrev = () => {
        setCenterSlot((cs) => (cs + 2) % 3)
        setCurrent((c) => Math.max(c - 1, 0))
    }

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
        if (isAnimating.current) return
        touchStartX.current = e.touches[0].clientX
        touchStartY.current = e.touches[0].clientY
        isDragging.current = false
        touchHandledRef.current = false
    }

    const onTouchMove = (e: React.TouchEvent) => {
        if (touchStartX.current === null || touchStartY.current === null) return
        const dx = e.touches[0].clientX - touchStartX.current
        const dy = e.touches[0].clientY - touchStartY.current
        if (!isDragging.current) {
            if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return
            if (Math.abs(dy) >= Math.abs(dx)) return
            isDragging.current = true
        }
        let offset = dx
        if (!manifest) return
        if (dx > 0 && current === 0) offset = Math.min(dx * 0.25, 40)
        else if (dx < 0 && current === manifest.pages.length - 1)
            offset = Math.max(dx * 0.25, -40)
        applyTransform(offset, false)
    }

    const onTouchEnd = () => {
        touchHandledRef.current = true
        if (!isDragging.current) {
            touchStartX.current = null
            togglePlay()
            return
        }
        isDragging.current = false
        touchStartX.current = null
        const offset = dragOffsetRef.current
        const W = window.innerWidth
        if (
            offset < -W * SNAP_RATIO &&
            manifest &&
            current < manifest.pages.length - 1
        ) {
            snapCallbackRef.current = goNext
            isAnimating.current = true
            applyTransform(-W, true)
        } else if (offset > W * SNAP_RATIO && current > 0) {
            snapCallbackRef.current = goPrev
            isAnimating.current = true
            applyTransform(W, true)
        } else {
            isAnimating.current = true
            applyTransform(0, true)
        }
    }

    const onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
        if (e.target !== containerRef.current || e.propertyName !== 'transform')
            return
        const cb = snapCallbackRef.current
        snapCallbackRef.current = null
        if (cb) {
            cb() // centerSlot + current update; useLayoutEffect resets container
        } else {
            applyTransform(0, false)
            isAnimating.current = false
        }
    }

    // After navigation, the slot that was already showing the destination page
    // becomes the new center — React reuses its DOM elements (same img src, no
    // redecode). We only reset the container offset here.
    useLayoutEffect(() => {
        const container = containerRef.current
        if (!container) return
        container.style.transition = 'none'
        container.style.transform = 'translateX(0)'
        isAnimating.current = false
    }, [centerSlot])

    const onContentClick = () => {
        if (touchHandledRef.current) {
            touchHandledRef.current = false
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

    const renderBlocks = (
        p: Page,
        ak: string | null,
        asi: { bi: number; start: number; end: number } | null
    ) =>
        p.blocks.map((block, bi) =>
            block.type === 'image' ? (
                <img
                    key={bi}
                    className="Panama-image"
                    src={`${BOOK_BASE}/images/${block.src}`}
                    alt=""
                    decoding="sync"
                />
            ) : (
                <TextBlock
                    key={bi}
                    block={block}
                    blockIndex={bi}
                    activeKey={ak}
                    sentenceRange={
                        asi?.bi === bi
                            ? { start: asi.start, end: asi.end }
                            : null
                    }
                />
            )
        )

    if (!manifest || !page) return null

    return (
        <div className="Panama">
            <div className="Panama-pageNumber">
                {current + 1} / {manifest.pages.length}
            </div>
            <div
                className="Panama-viewport"
                onClick={onContentClick}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div
                    ref={containerRef}
                    className="Panama-container"
                    onTransitionEnd={onTransitionEnd}
                >
                    {[0, 1, 2].map((slot) => {
                        const p = slotPage(slot)
                        const isCenter = slot === centerSlot
                        return (
                            <div
                                key={slot}
                                className="Panama-slide"
                                style={{ left: slotLeft(slot) }}
                            >
                                {p && (
                                    <div className="Panama-content">
                                        {renderBlocks(
                                            p,
                                            isCenter ? activeKey : null,
                                            isCenter ? activeSentenceInfo : null
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
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
                onTouchStart={(e) => e.stopPropagation()}
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
