import React, { useRef, useEffect } from 'react'
import './Calendar.css'

interface Props {
    width: number
    height: number
}

const Calendar = (props: Props) => {
    const mount = useRef<HTMLCanvasElement>(document.createElement('canvas'))
    let style = {
    }

    useEffect(() => {
        let DAYS_IN_A_WEEK = 7
        let WEEKS_IN_A_YEAR = 52
        let offsetWeek = 5
        let offsetDay = 3
        let offsetMonth = 30
        let size = 10
        let offsetYear = DAYS_IN_A_WEEK * (size + offsetWeek) + 15

        const context: CanvasRenderingContext2D = mount.current.getContext('2d')!
        context.canvas.width = 10000;
        context.canvas.height = 10000;

       


        let base = 1445410800000
        let baseDate = new Date(base)
        let baseYear = baseDate.getFullYear()
        let limit = new Date(Date.now()).getTime() - baseDate.getTime()
        let square;


        let days = baseDate.getDay()
        const startOfYear = new Date(baseDate.getFullYear(), 0, 1);
        const timeDiff = baseDate.getTime() - startOfYear.getTime();

        const daysInYear = timeDiff / (24 * 60 * 60 * 1000) + 1;
        let baseDay = (baseDate.getDay()) % 7  
        let week = 0 
        for(let i = 0; i < daysInYear; i++) {
            if (baseDay == 0) {
                week++
            }
            console.log(baseDay)
            baseDay = (baseDay + 1) % 7
        }

        let currentYear = baseYear

        for (let timestamp = new Date(base).getTime(); timestamp < Date.now(); timestamp += 1000 * 60 * 60 * 24) {
            square = new Date(timestamp)   
            let year = square.getFullYear() - baseYear
            let day = (square.getDay()) % 7    
            
            if (day == 0) {
                week++
            }
            
            let month = square.getMonth()
            

            context.fillStyle = day === 0 ?  "magenta" : day === 6 ?  "#ffd301" : "black"
            context.fillRect((size + offsetWeek) * week + offsetMonth * month, (size + offsetDay) * day + offsetYear * year, size, size)
            
            if (currentYear == square.getFullYear()) {
                days++
            } else {
                currentYear = square.getFullYear()
                days = 0
                week = 0
            }

            console.log(month, day, year)
        }
    }, [])


    return (
        <canvas
            className="Calendar"
            ref={mount}
            style={style}
        />
    )
}

export default Calendar
