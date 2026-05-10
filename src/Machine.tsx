import { useState, useEffect, useRef } from 'react'
import { useAuth, useInterval } from './Hooks'
import Spinner from './Spinner'
import './Machine.css'

type MachineState =
    | 'running'
    | 'stopped'
    | 'pending'
    | 'stopping'
    | 'starting'
    | null

type MachineInfo = {
    publicIp: string
    instanceType: string
    launchTime: Date
}

const TRANSITIONING: MachineState[] = ['pending', 'stopping', 'starting']

const banditHost = import.meta.env.VITE_API_HOST

const formatUptime = (launchTime: Date): string => {
    const totalMinutes = Math.floor((Date.now() - launchTime.getTime()) / 60000)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    if (hours === 0) return `${minutes}m`
    return `${hours}h ${minutes}m`
}

const Machine = () => {
    const { user } = useAuth()
    const [state, setState] = useState<MachineState>(null)
    const [info, setInfo] = useState<MachineInfo | null>(null)
    const [, setTick] = useState(0)

    const [copied, setCopied] = useState(false)
    const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleCopyIp = () => {
        if (!info?.publicIp) return
        navigator.clipboard.writeText(info.publicIp)
        setCopied(true)
        if (copyTimeout.current) clearTimeout(copyTimeout.current)
        copyTimeout.current = setTimeout(() => setCopied(false), 1500)
    }

    const fetchStatus = async () => {
        try {
            const response = await fetch(`${banditHost}/machine/status`, {
                headers: { Authorization: user.token },
                cache: 'no-store',
            })
            const json = await response.json()
            setState(json.state)
            if (json.state === 'running' && json.public_ip) {
                setInfo({
                    publicIp: json.public_ip,
                    instanceType: json.instance_type,
                    launchTime: new Date(json.launch_time),
                })
            } else {
                setInfo(null)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchStatus()
    }, [])

    const isTransitioning = state !== null && TRANSITIONING.includes(state)

    useInterval(fetchStatus, state !== null ? 2500 : null)
    useInterval(() => setTick((t) => t + 1), state === 'running' ? 60000 : null)

    const handleAction = async () => {
        if (state === 'running') {
            setState('stopping')
            setInfo(null)
            await fetch(`${banditHost}/machine/stop`, {
                method: 'POST',
                headers: { Authorization: user.token },
            })
        } else if (state === 'stopped') {
            setState('starting')
            await fetch(`${banditHost}/machine/start`, {
                method: 'POST',
                headers: { Authorization: user.token },
            })
        }
    }

    const label = () => {
        if (isTransitioning || state === null) return <Spinner />
        if (state === 'running') return 'Stop'
        return 'Start'
    }

    return (
        <div className="Machine">
            <span
                className={`Machine-label${
                    isTransitioning || state === null
                        ? ' Machine-label--disabled'
                        : ''
                }`}
                onClick={
                    isTransitioning || state === null ? undefined : handleAction
                }
            >
                {label()}
            </span>
            {state === 'running' && info && (
                <div className="Machine-info">
                    <span
                        className="Machine-info-ip"
                        onDoubleClick={handleCopyIp}
                        title="Double-click to copy"
                    >
                        {copied ? 'copied!' : info.publicIp}
                    </span>
                    <span>{info.instanceType}</span>
                    <span>{formatUptime(info.launchTime)}</span>
                </div>
            )}
        </div>
    )
}

export default Machine
