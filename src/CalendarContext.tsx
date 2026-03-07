import { createContext, useContext, useState, useMemo } from 'react'

interface CalendarData {
    sortedDates: string[]
    setSortedDates: (dates: string[]) => void
}

const CalendarContext = createContext<CalendarData>({ sortedDates: [], setSortedDates: () => {} })

export const CalendarProvider = ({ children }: { children: React.ReactNode }) => {
    const [sortedDates, setSortedDates] = useState<string[]>([])
    const value = useMemo(() => ({ sortedDates, setSortedDates }), [sortedDates])
    return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>
}

export const useCalendarDates = () => useContext(CalendarContext)
