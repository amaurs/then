import React, { useRef, useEffect, useState, Fragment } from 'react'
import './Calendar.css'

interface Props {
    width: number
    height: number
}

interface _CalendarProps {
    width: number
    height: number
    start: Date
    end: Date
}

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24

const getWeek = (date: Date) =>  {
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

const paintCalendar = (
    context: CanvasRenderingContext2D,
    start: number,
    end: number,
    offsetDay: number,
    offsetWeek: number,
    offsetMonth: number,
    offsetYear: number,
    sizeX: number,
    sizeY: number) => {

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

        context.fillRect((sizeX + offsetWeek) * week + offsetMonth * month, (sizeY + offsetDay) * day + offsetYear * year, sizeX, sizeY)
        total++
        if (currentYear == square.getFullYear()) {
            days++
            if ((day + 1) % 7 == 0) {
                week++
            }

        }
    }
}

const partitionIntervals = (startDate: Date, endDate: Date) => {
    const intervals = [];

    let currentYear = startDate.getFullYear();
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const intervalStart = new Date(currentDate);
        let intervalEnd = new Date(currentYear, 11, 31);

        if (intervalEnd > endDate) {
            intervalEnd = new Date(endDate);
        }

        intervals.push({ start: intervalStart, end: intervalEnd });

        currentYear++;
        currentDate.setFullYear(currentYear);
        currentDate.setDate(1);
        currentDate.setMonth(0);
    }

    return intervals;
}


const _Calendar = (props: _CalendarProps) => {
    const mount = useRef<HTMLCanvasElement>(document.createElement('canvas'))

    useEffect(() => {

        let total = 0

        let DAYS_IN_A_WEEK = 7
        let offsetWeek = 5
        let offsetDay = 3
        let offsetMonth = 30
        let size = 10
        let offsetYear = DAYS_IN_A_WEEK * (size + offsetWeek) + 15


        const context: CanvasRenderingContext2D = mount.current.getContext('2d')!
        context.canvas.width = (size + offsetWeek) * 54 - offsetWeek + 11 * offsetMonth
        context.canvas.height = (props.end.getFullYear() - props.start.getFullYear() + 1) * offsetYear - 15 - 17

        context.fillStyle = "white"
        context.fillRect(0, 0, context.canvas.width, context.canvas.height)

        paintCalendar(
            context,
            props.start.getTime() + 1000 * 60 * 60 * 12, // Adding 12 hours to avoid problems with daylight saving.
            props.end.getTime(),
            offsetDay,
            offsetWeek,
            offsetMonth,
            offsetYear,
            size,
            size)

    }, [])

    return (
        <Fragment>
            <h2>{`${props.start.getFullYear()}`}</h2>
            <canvas
                className="Calendar"
                ref={mount}
            />
        </Fragment>
    )
}

const Calendar = (props: Props) => {
    return (
        <Fragment>
            {partitionIntervals(new Date(2019, 5, 3), new Date(Date.now())).map((interval, index) => {
                return <_Calendar
                    height={props.height}
                    width={props.width}
                    start={interval.start}
                    end={interval.end}
                    key={index}></_Calendar>
            })}

        </Fragment>
    )
}

export default Calendar
