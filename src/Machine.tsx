import { useState, useEffect } from 'react'
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

const TRANSITIONING: MachineState[] = ['pending', 'stopping', 'starting']

const banditHost = import.meta.env.VITE_API_HOST

const Machine = () => {
    const { user } = useAuth()
    const [state, setState] = useState<MachineState>(null)

    const fetchStatus = async () => {
        try {
            const response = await fetch(`${banditHost}/machine/status`, {
                headers: { Authorization: user.token },
            })
            const json = await response.json()
            setState(json.state)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchStatus()
    }, [])

    const isTransitioning = state !== null && TRANSITIONING.includes(state)

    useInterval(fetchStatus, isTransitioning ? 2500 : null)

    const handleAction = async () => {
        if (state === 'running') {
            setState('stopping')
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
                className="Machine-label"
                onClick={
                    isTransitioning || state === null ? undefined : handleAction
                }
                style={
                    isTransitioning || state === null
                        ? { cursor: 'default' }
                        : undefined
                }
            >
                {label()}
            </span>
        </div>
    )
}

export default Machine
