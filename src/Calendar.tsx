import React, { useRef, useEffect, useState, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import './Calendar.css'
import { useAuth } from './Hooks'

interface Props {
    width: number
    height: number
}

interface _CalendarProps {
    width: number
    height: number
    start: Date
    end: Date
    photos: Map<string, number>
}

interface Color {
    red: number
    green: number
    blue: number
    alpha: number
}

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24
const banditHost = process.env.REACT_APP_API_HOST

const getWeek = (date: Date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1)
    const timeDiff = date.getTime() - startOfYear.getTime()
    const a = timeDiff
    const b = (24 * 60 * 60 * 1000)
    const remainder = a % b
    const quotient = (a - remainder) / b
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

const dayToColor = (year: number, month: number, day: number): Color => {
    const intValue = (year << 9) | (month << 5) | day

    const red = (intValue >> 16) & 255
    const green = (intValue >> 8) & 255
    const blue = intValue & 255

    return { red: red, green: green, blue: blue, alpha: 255 }
}

const colorToDay = (red: number, green: number, blue: number): Date => {
    const intValue = (red << 16) | (green << 8) | blue

    const year = (intValue >> 9) & (2 ** 15 - 1)
    const month = (intValue >> 5) & (2 ** 4 - 1)
    const day = intValue & (2 ** 5 - 1)

    return new Date(year, month, day)
}

const fillRectWithImageData = (
    context: CanvasImageData,
    x: number,
    y: number,
    width: number,
    height: number,
    red: number,
    green: number,
    blue: number,
    alpha: number) => {
    const imageData = context.createImageData(width, height)
    const pixelData = imageData.data

    for (let i = 0; i < pixelData.length; i += 4) {
        pixelData[i] = red
        pixelData[i + 1] = green
        pixelData[i + 2] = blue
        pixelData[i + 3] = alpha
    }

    context.putImageData(imageData, x, y)
}

const formatDate = (date: Date, separator: string): string => {
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)
    
    return `${year}${separator}${month}${separator}${day}`
  }

const getColor = (index: undefined | number): string => {
    return index !== undefined && index > 0? 
        (index > 1? (index > 2? (index > 3? (index > 4? (index > 5? (index > 6? "#7a0177": "#ae017e"): "#dd3497"): "#f768a1"): "#fa9fb5"): "#fcc5c0"): "#feebe2"): "black" // "#080708"
}

const paintCalendar = (
    context: CanvasRenderingContext2D,
    offScreenContext: OffscreenCanvasRenderingContext2D,
    start: number,
    end: number,
    offsetDay: number,
    offsetWeek: number,
    offsetMonth: number,
    offsetYear: number,
    sizeX: number,
    sizeY: number,
    colorMapping: Map<string, number>) => {

    let startDate: Date = new Date(start)
    let week = getWeek(startDate)
    let currentYear = startDate.getFullYear()
    let days = startDate.getDay()
    let square: Date
    let total = 0

    for (let timestamp = start; timestamp < end + MILLISECONDS_IN_A_DAY + 1000 * 60 * 60 * 2; timestamp += MILLISECONDS_IN_A_DAY) {
        square = new Date(timestamp)
        let year = square.getFullYear() - startDate.getFullYear()
        let dayOfTheWeek = square.getDay()
        let month = square.getMonth()
        let color = dayToColor(square.getFullYear(), square.getMonth(), square.getDate())

        if (currentYear != square.getFullYear()) {
            currentYear = square.getFullYear()
            days = 0
            week = 0
        }


        let colorindex = colorMapping.get(formatDate(square, '/'))
        context.fillStyle = getColor(colorindex)


        
        context.fillRect(
            (sizeX + offsetWeek) * week + offsetMonth * month,
            (sizeY + offsetDay) * dayOfTheWeek + offsetYear * year,
            sizeX,
            sizeY
        )

        fillRectWithImageData(
            offScreenContext,
            (sizeX + offsetWeek) * week + offsetMonth * month,
            (sizeY + offsetDay) * dayOfTheWeek + offsetYear * year,
            sizeX,
            sizeY,
            color.red,
            color.green,
            color.blue,
            color.alpha
        )

        total++
        if (currentYear == square.getFullYear()) {
            days++
            if ((dayOfTheWeek + 1) % 7 == 0) {
                week++
            }
        }
    }
}

const partitionIntervals = (startDate: Date, endDate: Date) => {
    const intervals = []

    let currentYear = startDate.getFullYear()
    let currentDate = new Date(startDate)

    while (currentDate <= endDate) {
        const intervalStart = new Date(currentDate)
        let intervalEnd = new Date(currentYear, 11, 31)

        if (intervalEnd > endDate) {
            intervalEnd = new Date(endDate)
        }

        intervals.push({ start: intervalStart, end: intervalEnd })

        currentYear++
        currentDate.setFullYear(currentYear)
        currentDate.setDate(1)
        currentDate.setMonth(0)
    }

    return intervals
}


const _Calendar = (props: _CalendarProps) => {
    const mount = useRef<HTMLCanvasElement>(document.createElement('canvas'))
    const [date, setDate] = useState<Date>()
    const navigate = useNavigate()

    useEffect(() => {
        let DAYS_IN_A_WEEK = 7
        let offsetWeek = 5
        let offsetDay = 3
        let offsetMonth = 30
        let size = 10
        let offsetYear = DAYS_IN_A_WEEK * (size + offsetWeek) + 15
        
        const context: CanvasRenderingContext2D = mount.current.getContext('2d')!
        context.imageSmoothingEnabled = false
        context.canvas.width = (size + offsetWeek) * 54 - offsetWeek + 11 * offsetMonth
        context.canvas.height = (props.end.getFullYear() - props.start.getFullYear() + 1) * offsetYear - 15 - 17

        const offScreenContext = new OffscreenCanvas(context.canvas.width, context.canvas.height).getContext("2d")! // or webgl, etc.

        const handleMouseMove = (e: MouseEvent) => {
            const offsetX = e.offsetX
            const offsetY = e.offsetY

            const pixelData = offScreenContext.getImageData(offsetX, offsetY, 2, 2).data
            const red = pixelData[0]
            const green = pixelData[1]
            const blue = pixelData[2]
            const alpha = pixelData[3]

            let day = !(red == 255 && green == 255 && blue == 255 && alpha == 255) ? colorToDay(red, green, blue) : undefined

            setDate(day)
        }

        const handleMouseClick = (e: MouseEvent) => {
            const offsetX = e.offsetX
            const offsetY = e.offsetY

            const pixelData = offScreenContext.getImageData(offsetX, offsetY, 2, 2).data
            const red = pixelData[0]
            const green = pixelData[1]
            const blue = pixelData[2]
            const alpha = pixelData[3]

            let day = !(red == 255 && green == 255 && blue == 255 && alpha == 255) ? colorToDay(red, green, blue) : undefined

            if (day !== undefined) {
                const otherPixelData = context.getImageData(offsetX, offsetY, 2, 2).data
                // TODO: This is right now hardcoded to color black, should make it configurable.
                if (!(otherPixelData[0] == 0 && otherPixelData[1] == 0 && otherPixelData[2] == 0)) {
                    navigate(`/calendar/${formatDate(day, '/')}`)
                }
            }
        }

        const handleMouseOut = (e: MouseEvent) => {
            setDate(undefined)
        }


        context.fillStyle = "white"
        offScreenContext.fillStyle = "white"
        context.fillRect(0, 0, context.canvas.width, context.canvas.height)
        offScreenContext.fillRect(0, 0, context.canvas.width, context.canvas.height)

        paintCalendar(
            context,
            offScreenContext,
            props.start.getTime() + 1000 * 60 * 60 * 12, // Adding 12 hours to avoid problems with daylight saving.
            props.end.getTime(),
            offsetDay,
            offsetWeek,
            offsetMonth,
            offsetYear,
            size,
            size,
            props.photos)
        mount.current.addEventListener('mousemove', handleMouseMove)
        mount.current.addEventListener('mouseout', handleMouseOut)
        mount.current.addEventListener('click', handleMouseClick)


        return () => {
            if (mount.current) {
                mount.current.removeEventListener('mousemove', handleMouseMove)
                mount.current.removeEventListener('mouseout', handleMouseOut)
                mount.current.removeEventListener('click', handleMouseClick)
            }
        }

    }, [])


    return (
        <Fragment>
            <h1>{`${date && date.getFullYear() === props.start.getFullYear() ? date.toLocaleDateString('en-US', { weekday: "long", year: "numeric", month: "short", day: "numeric" }) : props.start.getFullYear()}`}</h1>

            <canvas
                className="Calendar"
                ref={mount}
            />
        </Fragment>
    )
}


const Calendar = (props: Props) => {
    const [start, setStart] = useState<Date>()
    const [photos, setPhotos] =  useState<any>()
    const { user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        let cancel = false
        const fetchNames = async (url: string) => {
            try {
                let payload = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': user.token,
                    }
                }

                let response = await fetch(url, payload)
                let json = await response.json()

                if (!cancel) {
                    setStart(new Date(json.start.year, json.start.month - 1, json.start.day))
                    setPhotos(new Map(json.photos))
                }
            } catch (error) {
                console.log(error)
                navigate('/login')
            }
        }

        fetchNames(`${banditHost}/calendar/amaurs`)
    
        return () => {
            cancel = true
        }
    }, [])

    if (start === undefined) {
        return null
    }
    return (
        <Fragment>
            {partitionIntervals(start, new Date(Date.now())).reverse().map((interval, index) => {
                return <_Calendar
                    height={props.height}
                    width={props.width}
                    start={interval.start}
                    end={interval.end}
                    photos={photos}
                    key={index}></_Calendar>
            })}

        </Fragment>
    )
}

export default Calendar
