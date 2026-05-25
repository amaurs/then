import React, { useEffect, useState } from 'react'
import Colors from '../bits/colors/Colors'
import TravelingSalesman from '../bits/travelingsalesman/TravelingSalesman'
import { getRandomIntegerArray } from '../utils'

const banditHost = import.meta.env.VITE_API_HOST

const NUMBER_COLORS = 500
const SQUARE_SAMPLING = 100

interface BitProps {
    title: string
    delay: number
    style: React.CSSProperties
    width: number
    height: number
}

export const ColorsBit = (props: BitProps) => {
    const [colors, setColors] = useState<number[] | null>(null)

    useEffect(() => {
        let cancel = false
        const cityPoints = getRandomIntegerArray(NUMBER_COLORS * 3, 0, 256)
        const url = `${banditHost}/solve?cities=${JSON.stringify(
            cityPoints
        )}&dimension=3`
        fetch(url)
            .then((r) => r.json())
            .then((json) => {
                if (!cancel) setColors(json)
            })
            .catch((e) => console.log('colors fetch failed', e))
        return () => {
            cancel = true
        }
    }, [])

    if (!colors) return null
    return <Colors {...props} colors={colors} />
}

export const TravelingSalesmanBit = (props: BitProps) => {
    const [cities, setCities] = useState<{
        cities: number[]
        hasFetched: boolean
    } | null>(null)

    useEffect(() => {
        let cancel = false
        const cityPoints = getRandomIntegerArray(
            NUMBER_COLORS * 2,
            1,
            SQUARE_SAMPLING
        )
        const url = `${banditHost}/solve?cities=${JSON.stringify(
            cityPoints
        )}&dimension=2`
        fetch(url)
            .then((r) => r.json())
            .then((json) => {
                if (!cancel) setCities({ cities: json, hasFetched: true })
            })
            .catch((e) => console.log('traveling salesman fetch failed', e))
        return () => {
            cancel = true
        }
    }, [])

    if (!cities) return null
    return (
        <TravelingSalesman
            {...props}
            cities={cities}
            numberColors={NUMBER_COLORS}
            squareSampling={SQUARE_SAMPLING}
        />
    )
}
