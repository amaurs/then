import React, { useEffect, useState, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useAuth } from './Hooks'
import './Album.css'

const banditHost = process.env.REACT_APP_API_HOST

const Album = () => {
    const { year, month, day } = useParams()
    const [photos, setPhotos] = useState<Array<string> | undefined>(undefined)
    const navigate = useNavigate()
    const { user } = useAuth()

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
                    setPhotos(json.photos)
                }
            } catch (error) {
                console.log(error)
                navigate('/login')
            }
        }

        fetchNames(`${banditHost}/calendars/amaurs/${year}-${month}-${day}`)

        return () => {
            cancel = true
        }
    }, [])

    const date = new Date(Date.parse(`${year}-${month}-${day}`))

    if (photos === undefined) {
        return null
    } else if (photos.length === 0) {
        navigate(`/calendar`)
    }

    

    return (
        <div className="Column">
            <h1>
                {date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                })}
            </h1>
            {photos!.map((photo, index) => {
                return <img src={photo} key={index}></img>
            })}
        </div>
    )
}

export default Album
