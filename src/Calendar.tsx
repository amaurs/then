import React, { useRef, useEffect, useState, Fragment } from 'react'
import './Calendar.css'

interface Props {
    width: number
    height: number
}

const Calendar = (props: Props) => {
    const mount = useRef<HTMLCanvasElement>(document.createElement('canvas'))
    const [totalDays, setTotalDays] = useState(0)

    let style = {
    }

    useEffect(() => {
        function getWeek(date: Date) {
            const startOfYear = new Date(date.getFullYear(), 0, 1)
            const timeDiff = date.getTime() - startOfYear.getTime()
            const a = timeDiff
            const b = (24 * 60 * 60 * 1000)
            const remainder = a % b;
            const quotient = (a - remainder) / b;
            const daysInYear = quotient

            let week = 0
            let day = startOfYear.getDay()

            for (let i = 0; i < daysInYear; i++) {
                day = (day + 1) % 7
                if (day == 0) {
                    week++
                }
            }

            return week
        }
        let total = 0

        function paintCalendar(context: CanvasRenderingContext2D, start: number, end: number, offsetDay: number, offsetWeek: number, offsetMonth: number, offsetYear: number, sizeX: number, sizeY: number) {

            let startDate: Date = new Date(start)
            let week = getWeek(startDate)
            let currentYear = startDate.getFullYear()
            let days = startDate.getDay()
            let square: Date
            let total = 0

            for (let timestamp = start; timestamp < end + MILLISECONDS_IN_A_DAY + 1000 * 60 * 60 * 2; timestamp += MILLISECONDS_IN_A_DAY) {
                square = new Date(timestamp)
                let year = square.getFullYear() - startDate.getFullYear()
                let day = square.getDay()
                let month = square.getMonth()
                context.fillStyle = day === 0 ? "magenta" : day === 6 ? "#ffd301" : "black"

                if (currentYear != square.getFullYear()) {
                    currentYear = square.getFullYear()
                    days = 0
                    week = 0
                }

                context.fillRect((size + offsetWeek) * week + offsetMonth * month, (size + offsetDay) * day + offsetYear * year, sizeX, sizeY)
                total++
                if (currentYear == square.getFullYear()) {
                    days++
                    if ((day + 1) % 7 == 0) {
                        week++
                    }

                }
            }

            return total
        }


        let MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24
        let DAYS_IN_A_WEEK = 7
        let offsetWeek = 5
        let offsetDay = 3
        let offsetMonth = 30
        let size = 10
        let offsetYear = DAYS_IN_A_WEEK * (size + offsetWeek) + 15

        let start = new Date(1991, 9, 3)
        let end = new Date(Date.now())

        const context: CanvasRenderingContext2D = mount.current.getContext('2d')!
        context.canvas.width = (size + offsetWeek) * 54 - offsetWeek + 11 * offsetMonth
        context.canvas.height = (end.getFullYear() - start.getFullYear() + 1) * offsetYear - 15 - 17

        context.fillStyle = "white"
        context.fillRect(0, 0, context.canvas.width, context.canvas.height)

        let totalD = paintCalendar(
            context,
            start.getTime() + 1000 * 60 * 60 * 12, // Adding 12 hours to avoid problems with daylight saving.
            end.getTime(),
            offsetDay,
            offsetWeek,
            offsetMonth,
            offsetYear,
            size,
            size)

        setTotalDays(totalD)

    }, [])

    return (
        <Fragment>
            <h2>{`Total days: ${totalDays}`}</h2>
            <canvas
                className="Calendar"
                ref={mount}
                style={style}
            />
        </Fragment>
    )
}

export default Calendar
