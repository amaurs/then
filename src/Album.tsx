import React, { useEffect, useState, Fragment } from 'react'
import { useParams } from 'react-router-dom'

const banditHost = process.env.REACT_APP_API_HOST

const Album = () => {
    const { year, month, day } = useParams()
    const [photos, setPhotos] =  useState<Array<string>>([])

    useEffect(() => {
        let cancel = false
        const fetchNames = async (url: string) => {
            try {
                let response = await fetch(url)
                let json = await response.json()

                if (!cancel) {
                    setPhotos(json.photos)
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchNames(`${banditHost}/calendars/amaurs/${year}-${month}-${day}`)
    
        return () => {
            cancel = true
        }
    }, [])

    const date = new Date(Date.parse(`${year}-${month}-${day}`))

    return (
        <Fragment>
            <h1>{date.toLocaleDateString('en-US', { weekday: "long", year: "numeric", month: "short", day: "numeric" })}</h1>
            {photos.map((photo, index) => { return <img src={photo} key={index}></img>})}
        </Fragment>
    )
}

export default Album