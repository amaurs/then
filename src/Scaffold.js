import React, { useEffect, useState } from 'react'
import { useLocalStorage } from './Hooks.js'
import Home from './Home.js'
import { getRandomIntegerArray } from './tools'

import { ThemeContext, themes } from './ThemeContext.js'

const banditHost = process.env.REACT_APP_API_HOST
const squareSampling = 100
const numberColors = 500

const Then = () => {
    localStorage.clear()
    const [theme, setTheme] = useLocalStorage('theme', themes.light)
    const [masterData, setMasterData] = useState({})

    const toggleTheme = (themeName) => {
        if (themeName === 'konami') {
            setTheme(themes.konami)
        } else {
            setTheme(theme.name !== 'light' ? themes.light : themes.dark)
        }
    }

    useEffect(() => {
        let cancel = false
        const fetchCodes = async (url) => {
            try {
                let response = await fetch(url)
                let json = await response.json()

                if (!cancel) {
                    let projects = json.colors.map((element) => {
                        let final = element.resolutions.filter(
                            (e) => e.resolution == element.default
                        )
                        let finalElement
                        if (final.length === 0) {
                            finalElement = element.resolutions[0]
                        } else {
                            finalElement = final[0]
                        }

                        return {
                            slug: element.slug,
                            description: element.description,
                            ...finalElement,
                        }
                    })

                    setMasterData({
                        ...masterData,
                        colorsData: { data: projects, used: false },
                    })
                }
            } catch (error) {
                console.log(error)
            }
        }

        if (masterData.colorsData === undefined) {
            fetchCodes(`${banditHost}/colors`)
        }

        return () => {
            cancel = true
        }
    }, [masterData])

    useEffect(() => {
        let cancel = false
        const fetchCodes = async (url) => {
            try {
                console.log('Fetching codes.')
                let response = await fetch(url)
                let json = await response.json()

                if (!cancel) {
                    setMasterData({ ...masterData, ...json })
                }
            } catch (error) {
                console.log('Error while loading qr routes.', error)
            }
        }

        if (masterData.codes === undefined) {
            fetchCodes(`${banditHost}/codes`)
        }

        return () => {
            cancel = true
        }
    }, [masterData])

    useEffect(() => {
        let cancel = false
        const fetchCitiesSolution = async (
            url,
            numberColors,
            squareSampling
        ) => {
            try {
                let payload = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }

                let cityPoints = getRandomIntegerArray(
                    numberColors * 2,
                    1,
                    squareSampling
                )
                let citiesUrl =
                    url +
                    '/solve?cities=' +
                    JSON.stringify(cityPoints) +
                    '&dimension=' +
                    2

                let response = await fetch(citiesUrl, payload)
                let json = await response.json()
                if (!cancel) {
                    setMasterData({
                        ...masterData,
                        travelingSalesmanData: {
                            cities: json,
                            hasFetched: true,
                        },
                    })
                }
            } catch (error) {
                console.log('Call to order endpoint failed.', error)
            }
        }

        if (masterData.travelingSalesmanData === undefined) {
            fetchCitiesSolution(banditHost, numberColors, squareSampling)
        }

        return () => {
            cancel = true
        }
    }, [masterData])

    // Replicated code, should be refactored
    useEffect(() => {
        let cancel = false
        const fetchCitiesSolution = async (
            url,
            numberColors,
            squareSampling
        ) => {
            try {
                let payload = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }

                let cityPoints = getRandomIntegerArray(numberColors * 3, 0, 256)
                let citiesUrl =
                    url +
                    '/solve?cities=' +
                    JSON.stringify(cityPoints) +
                    '&dimension=' +
                    3

                let response = await fetch(citiesUrl, payload)
                let json = await response.json()
                if (!cancel) {
                    setMasterData({
                        ...masterData,
                        travelingSalesmanColors: json,
                    })
                }
            } catch (error) {
                console.log('Call to order endpoint failed.', error)
            }
        }

        if (masterData.travelingSalesmanColors === undefined) {
            fetchCitiesSolution(banditHost, numberColors, squareSampling)
        }

        return () => {
            cancel = true
        }
    }, [masterData])

    useEffect(() => {
        let cancel = false
        // const fetchImages = async (url: string, rowNumber: number) => {
        const fetchImages = async (url, rowNumber) => {
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
                    //let rows: Array<Array<Image>> = [...Array(rowNumber)].map(() => []);
                    let rows = [...Array(rowNumber)].map(() => [])
                    // json["images"].map((image: Image, index: number) => {
                    json['images'].map((image, index) => {
                        rows[index % rowNumber].push(image)
                    })

                    setMasterData({ ...masterData, photography: rows })
                }
            } catch (error) {
                console.log('Call to order endpoint failed.', error)
            }
        }

        if (masterData.photography === undefined) {
            fetchImages(banditHost + '/photography', 1)
        }

        return () => {
            cancel = true
        }
    }, [masterData])

    useEffect(() => {
        // let cancel: boolean = false;
        let cancel = false
        // const fetchCitiesSolution = async (url: string) => {
        const fetchCitiesSolution = async (url) => {
            try {
                let payload = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        point_set: 'moebius',
                        n_cities: '500',
                    }),
                }

                let response = await fetch(url, payload)
                let json = await response.json()
                if (!cancel) {
                    setMasterData({
                        ...masterData,
                        anaglyph: { points: json, hasFetched: true },
                    })
                }
            } catch (error) {
                console.log('Call to order endpoint failed.', error)
            }
        }

        if (masterData.anaglyph === undefined) {
            fetchCitiesSolution(banditHost)
        }

        return () => {
            cancel = true
        }
    }, [masterData])

    useEffect(() => {
        let cancel = false
        const getPhrase = async (url) => {
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
                    let bolero = json.sentence
                        .split(' ')
                        .filter((word) => '' !== word)
                        .map((word) => (word === 'i' ? 'I' : word))
                        .map((word, index) =>
                            index === 0
                                ? word.charAt(0).toUpperCase() + word.slice(1)
                                : word
                        )
                        .reduce((a, b) => a + ' ' + b, '')

                    setMasterData({ ...masterData, bolero: bolero })
                }
            } catch (error) {
                console.log('Call to order endpoint failed.', error)
            }
        }

        if (masterData.bolero === undefined) {
            getPhrase(banditHost + '/boleros/en')
        }

        return () => {
            cancel = true
        }
    }, [masterData])

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <Home masterData={masterData} setMasterData={setMasterData} />
        </ThemeContext.Provider>
    )
}

export default Then
