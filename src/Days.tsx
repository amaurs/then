import React, { useState, useEffect } from 'react'

interface Data {
    message: string
}

const banditHost = process.env.REACT_APP_API_HOST

const Days = () => {
    const [data, setData] = useState<Data | undefined>(undefined)

    useEffect(() => {
        let cancel = false
        const fetchPost = async (url: string) => {
            try {
                let payload = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
                let response = await fetch(url, payload)
                let json = await response.json()
                if (!cancel) {
                    setData(json)
                }
            } catch (error) {
                console.log('Call to post endpoint failed.', error)
            }
        }
        fetchPost(`${banditHost}/flora`)
        return () => {
            cancel = true
        }
    }, [])

    if (data === undefined) {
        return null
    }

    return (
        <div className="Flyer">
            <h2>{data.message}</h2>
        </div>
    )
}

export default Days
