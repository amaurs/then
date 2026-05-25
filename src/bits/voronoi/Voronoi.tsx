import React, { useRef, useState, useEffect, useContext } from 'react'
import robot from '../../assets/our-lady.jpg'
import { getCentroids } from '../../utils'
import { getRandomInt, getXYfromIndex, getBrightness } from '../../utils'
import './Voronoi.css'
import * as d3 from 'd3'
import { Delaunay } from 'd3-delaunay'
import { useTimeout, useAnimationLoop } from '../../Hooks'
import Loader from '../../Presentation'
import { ThemeContext } from '../../ThemeContext'

import './Voronoi.css'

import CSS from 'csstype'

interface Props {
    title: string
    delay: number
    style: CSS.Properties
    width: number
    height: number
}

interface City {
    x: number
    y: number
    r: number
    g: number
    b: number
}

interface Cities {
    totalData: Array<City>
    imageWidth: number
    imageHeight: number
    sites: Array<City>
}

const Voronoi = (props: Props) => {
    let canvas = useRef<HTMLCanvasElement>(document.createElement('canvas'))
    const theme = useContext(ThemeContext)
    let [cities, setCities] = useState<Cities | undefined>(undefined)
    const [canvasWidth, setCanvasWidth] = useState(0)
    const [canvasHeight, setCanvasHeight] = useState(0)
    const [presenting, setPresenting] = useState(props.delay > 0)
    const [done, setDone] = useState(false)

    useTimeout(() => {
        setPresenting(false)
    }, props.delay)

    useEffect(() => {
        let cancel = false

        if (props.width > 0 && props.height > 0) {
            const onLoad = (event: Event) => {
                if (!cancel) {
                    const image = event.currentTarget as HTMLImageElement
                    const canvas = document.createElement('canvas')
                    canvas.width = image.width
                    canvas.height = image.height
                    const context: CanvasRenderingContext2D =
                        canvas.getContext('2d')!
                    context.drawImage(image, 0, 0)
                    let imageData = context.getImageData(
                        0,
                        0,
                        image.width,
                        image.height
                    )
                    let totalData: Array<City> = []
                    for (
                        let index = 0;
                        index < image.width * image.height;
                        index++
                    ) {
                        let pixel = getXYfromIndex(index, image.width)
                        totalData.push({
                            x: pixel[0],
                            y: pixel[1],
                            r: imageData.data[index * 4],
                            g: imageData.data[index * 4 + 1],
                            b: imageData.data[index * 4 + 2],
                        })
                    }
                    const total = 5000
                    let sites = []
                    /** I use the rejection algorithm to get points with the most brightness. **/
                    let numPoints = 0
                    while (numPoints < total) {
                        let index = getRandomInt(0, image.width * image.height)
                        let site = totalData[index]
                        let brightness = getBrightness(site.r, site.g, site.b)
                        if (Math.random() >= brightness) {
                            sites.push(site)
                            numPoints++
                        }
                    }

                    let imageAspectRatio = image.width / image.height
                    let windowAspectRatio = props.width / props.height
                    let box
                    if (windowAspectRatio < 1) {
                        box = [imageAspectRatio * props.height, props.height]
                    } else {
                        box = [props.width, props.width / imageAspectRatio]
                    }

                    setCities({
                        totalData: totalData,
                        imageWidth: image.width,
                        imageHeight: image.height,
                        sites: sites,
                    })
                    setCanvasWidth(box[0])
                    setCanvasHeight(box[1])
                }
            }

            let image = new Image()
            image.src = robot
            image.onload = onLoad
        }

        return () => {
            cancel = true
        }
    }, [props.width, props.height])

    const updatesRef = useRef(0)
    const citiesCopyRef = useRef<Cities | undefined>(undefined)
    useEffect(() => {
        updatesRef.current = 0
        citiesCopyRef.current = cities
            ? JSON.parse(JSON.stringify(cities))
            : undefined
        setDone(false)
    }, [cities, presenting, theme])

    const voronoiRunning = cities !== undefined && !presenting && !done
    useAnimationLoop(voronoiRunning ? 10 : null, () => {
        const getRadius = (d: City) => {
            return 2 + 1 * getBrightness(d.r, d.g, d.b)
        }

        const sitesUpdate = (
            sites: Array<City>,
            imageData: Array<City>,
            width: number,
            height: number
        ): Array<City> => {
            const delaunay = Delaunay.from(
                sites,
                (d) => d.x,
                (d) => d.y
            )
            const voronoi = delaunay.voronoi([0, 0, width, height])
            const diagram = voronoi.cellPolygons()
            return getCentroids(diagram).map((centroid) => {
                let closestIndex =
                    Math.floor(centroid[1]) * width + Math.floor(centroid[0])
                let closestPixel = imageData[closestIndex]
                return {
                    x: centroid[0],
                    y: centroid[1],
                    r: closestPixel.r,
                    g: closestPixel.g,
                    b: closestPixel.b,
                }
            })
        }

        const citiesCopy = citiesCopyRef.current!
        const context: CanvasRenderingContext2D =
            canvas.current.getContext('2d')!
        let canvasWidth = canvas.current.width
        let canvasHeight = canvas.current.height
        context.clearRect(0, 0, canvasWidth, canvasHeight)

        citiesCopy.sites.forEach(function (d: City) {
            context.beginPath()
            if (theme.theme.name === 'light') {
                context.fillStyle = `${d3.rgb(+d.r, +d.g, +d.b)}`
            } else if (theme.theme.name === 'dark') {
                context.fillStyle = `${d3.rgb(
                    255 - +d.r,
                    255 - +d.g,
                    255 - +d.b
                )}`
            } else {
                context.fillStyle = `rgba(255, 0, 255, ${getBrightness(
                    +d.r,
                    +d.g,
                    +d.b
                )})`
            }
            let x = (+d.x / citiesCopy.imageWidth) * canvasWidth
            let y = (+d.y / citiesCopy.imageHeight) * canvasHeight
            let r = (getRadius(d) * canvasWidth) / 800
            context.arc(x, y, r, 0, 2 * Math.PI)
            context.fill()
        })
        if (updatesRef.current < 10) {
            citiesCopy.sites = sitesUpdate(
                citiesCopy.sites,
                citiesCopy.totalData,
                citiesCopy.imageWidth,
                citiesCopy.imageHeight
            )
            updatesRef.current += 1
        } else {
            setDone(true)
        }
    })

    let isVertical = props.height / props.width < 1

    let style = {}

    if (presenting) {
        return <Loader title={props.title} />
    } else {
        return (
            <canvas
                className="Voronoi"
                style={{ ...props.style, ...style }}
                width={canvasWidth + 'px'}
                height={canvasHeight + 'px'}
                ref={canvas}
            />
        )
    }
}

export default Voronoi
