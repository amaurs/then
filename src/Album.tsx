import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from './Hooks'
import { useCalendarDates } from './CalendarContext'
import './Album.css'

const banditHost = import.meta.env.VITE_API_HOST

interface DaySection {
    date: string
    photos: string[]
}

const formatDateHeading = (dateStr: string) => {
    const [y, m, d] = dateStr.split('/')
    const date = new Date(+y, +m - 1, +d)
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })
}

const Album = () => {
    const { year, month, day } = useParams()
    const currentDate = `${year}/${month}/${day}`
    const [sections, setSections] = useState<DaySection[]>([])
    const [loadingTop, setLoadingTop] = useState(false)
    const [loadingBottom, setLoadingBottom] = useState(false)
    const [noMorePrev, setNoMorePrev] = useState(false)
    const [noMoreNext, setNoMoreNext] = useState(false)
    const navigate = useNavigate()
    const { user } = useAuth()
    const { sortedDates } = useCalendarDates()
    const topSentinelRef = useRef<HTMLDivElement>(null)
    const bottomSentinelRef = useRef<HTMLDivElement>(null)
    const dividerRefs = useRef<Map<string, HTMLElement>>(new Map())
    const scrollRestorationRef = useRef<{ height: number } | null>(null)

    const fetchDay = useCallback(async (dateStr: string): Promise<string[] | null> => {
        try {
            const res = await fetch(`${banditHost}/calendars/amaurs/${dateStr.replace(/\//g, '-')}`, {
                headers: { 'Content-Type': 'application/json', 'Authorization': user.token },
            })
            if (!res.ok) return null
            const json = await res.json()
            return json.photos
        } catch {
            return null
        }
    }, [user.token])

    const getAdjacentDate = useCallback((dateStr: string, direction: 1 | -1): string | null => {
        const idx = sortedDates.indexOf(dateStr)
        if (idx === -1) return null
        const nextIdx = idx + direction
        if (nextIdx < 0 || nextIdx >= sortedDates.length) return null
        return sortedDates[nextIdx]
    }, [sortedDates])

    // Initial load
    useEffect(() => {
        let cancel = false
        fetchDay(currentDate).then(photos => {
            if (cancel || !photos) return
            if (photos.length === 0) { navigate('/calendar'); return }
            setSections([{ date: currentDate, photos }])
            // Check boundaries
            if (sortedDates.length > 0) {
                const idx = sortedDates.indexOf(currentDate)
                if (idx <= 0) setNoMorePrev(true)
                if (idx === -1 || idx >= sortedDates.length - 1) setNoMoreNext(true)
            }
        })
        return () => { cancel = true }
    }, [currentDate])

    // Load next day (scroll down)
    const loadNext = useCallback(async () => {
        if (loadingBottom || noMoreNext || sections.length === 0) return
        const lastDate = sections[sections.length - 1].date
        const nextDate = getAdjacentDate(lastDate, 1)
        if (!nextDate) { setNoMoreNext(true); return }
        setLoadingBottom(true)
        const photos = await fetchDay(nextDate)
        if (photos) {
            setSections(prev => [...prev, { date: nextDate, photos }])
            if (getAdjacentDate(nextDate, 1) === null) setNoMoreNext(true)
        }
        setLoadingBottom(false)
    }, [loadingBottom, noMoreNext, sections, getAdjacentDate, fetchDay])

    // Load previous day (scroll up)
    const loadPrev = useCallback(async () => {
        if (loadingTop || noMorePrev || sections.length === 0) return
        const firstDate = sections[0].date
        const prevDate = getAdjacentDate(firstDate, -1)
        if (!prevDate) { setNoMorePrev(true); return }
        setLoadingTop(true)
        scrollRestorationRef.current = { height: document.documentElement.scrollHeight }
        const photos = await fetchDay(prevDate)
        if (photos) {
            setSections(prev => [{ date: prevDate, photos }, ...prev])
            if (getAdjacentDate(prevDate, -1) === null) setNoMorePrev(true)
        }
        setLoadingTop(false)
    }, [loadingTop, noMorePrev, sections, getAdjacentDate, fetchDay])

    // Preserve scroll position after prepending
    useEffect(() => {
        if (scrollRestorationRef.current) {
            const prevHeight = scrollRestorationRef.current.height
            const newHeight = document.documentElement.scrollHeight
            window.scrollTo(0, window.scrollY + (newHeight - prevHeight))
            scrollRestorationRef.current = null
        }
    }, [sections])

    // IntersectionObserver for bottom sentinel
    useEffect(() => {
        const el = bottomSentinelRef.current
        if (!el) return
        const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) loadNext()
        }, { rootMargin: '200px' })
        obs.observe(el)
        return () => obs.disconnect()
    }, [loadNext])

    // IntersectionObserver for top sentinel
    useEffect(() => {
        const el = topSentinelRef.current
        if (!el) return
        const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) loadPrev()
        }, { rootMargin: '200px' })
        obs.observe(el)
        return () => obs.disconnect()
    }, [loadPrev])

    // URL update via IntersectionObserver on date dividers
    useEffect(() => {
        if (sections.length === 0) return
        const obs = new IntersectionObserver(entries => {
            // Find the topmost visible divider
            const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
            if (visible.length > 0) {
                const date = visible[0].target.getAttribute('data-date-divider')
                if (date) {
                    window.history.replaceState(null, '', `/calendar/${date}`)
                }
            }
        }, { rootMargin: '-10% 0px -80% 0px' })

        dividerRefs.current.forEach(el => obs.observe(el))
        return () => obs.disconnect()
    }, [sections])

    if (sections.length === 0) return null

    return (
        <div className="Column">
            <div ref={topSentinelRef} />
            {loadingTop && <div className="Album-loading">Loading...</div>}
            {sections.map(section => (
                <div key={section.date}>
                    <h2
                        data-date-divider={section.date}
                        ref={el => { if (el) dividerRefs.current.set(section.date, el); else dividerRefs.current.delete(section.date) }}
                    >
                        {formatDateHeading(section.date)}
                    </h2>
                    {section.photos.map((photo, i) => (
                        <img src={photo} key={i} />
                    ))}
                </div>
            ))}
            {loadingBottom && <div className="Album-loading">Loading...</div>}
            <div ref={bottomSentinelRef} />
        </div>
    )
}

export default Album
