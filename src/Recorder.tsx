import React, { useRef, useState, Suspense } from 'react'
import { recordableBits } from './recorder/bitRegistry'
import { useRecording } from './recorder/useRecording'
import { BitSpeedContext } from './Hooks'
import './Recorder.css'

const FORMATS = {
    square: { width: 1080, height: 1080 },
    portrait: { width: 1080, height: 1920 },
} as const

const DURATIONS = [5, 10, 15, 30] as const

type Format = keyof typeof FORMATS

const BACKGROUND_COLOR = 'white'

const Recorder = () => {
    const [bitSlug, setBitSlug] = useState(recordableBits[0].slug)
    const [format, setFormat] = useState<Format>('square')
    const [duration, setDuration] = useState<number>(10)
    const [speed, setSpeed] = useState<number>(1)
    const [recordingKey, setRecordingKey] = useState(0)

    const bitContainerRef = useRef<HTMLDivElement>(null)
    const intermediateRef = useRef<HTMLCanvasElement>(null)
    const progressFillRef = useRef<HTMLDivElement>(null)

    const { width, height } = FORMATS[format]
    const bit = recordableBits.find((b) => b.slug === bitSlug)!
    const BitComponent = bit.Component

    const { status, start } = useRecording({
        bitContainerRef,
        intermediateRef,
        progressFillRef,
        backgroundColor: BACKGROUND_COLOR,
        bitSlug,
        format,
    })

    const handleRecord = () => {
        setRecordingKey((k) => k + 1)
        setTimeout(() => start(duration), 300)
    }

    const controlsDisabled = status === 'recording' || status === 'encoding'

    return (
        <div className="Recorder">
            <div className="Recorder-header">
                <select
                    className="Recorder-bitPicker"
                    value={bitSlug}
                    onChange={(e) => setBitSlug(e.target.value)}
                    disabled={controlsDisabled}
                >
                    {recordableBits.map((b) => (
                        <option key={b.slug} value={b.slug}>
                            {b.name}
                        </option>
                    ))}
                </select>
                <div className="Recorder-group">
                    {(Object.keys(FORMATS) as Format[]).map((f) => (
                        <button
                            key={f}
                            className={`Recorder-toggle${
                                format === f ? ' active' : ''
                            }`}
                            onClick={() => setFormat(f)}
                            disabled={controlsDisabled}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="Recorder-group">
                    {DURATIONS.map((d) => (
                        <button
                            key={d}
                            className={`Recorder-toggle${
                                duration === d ? ' active' : ''
                            }`}
                            onClick={() => setDuration(d)}
                            disabled={controlsDisabled}
                        >
                            {d}s
                        </button>
                    ))}
                </div>
            </div>
            <div className="Recorder-speedRow">
                <input
                    type="range"
                    min={0}
                    max={3}
                    step={0.05}
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    disabled={controlsDisabled}
                    className="Recorder-speedSlider"
                    aria-label="speed"
                />
                <span className="Recorder-speedValue">{speed.toFixed(2)}×</span>
            </div>

            <div className="Recorder-stage">
                <div className={`Recorder-frame Recorder-frame-${format}`}>
                    <canvas
                        ref={intermediateRef}
                        width={width}
                        height={height}
                        className="Recorder-preview"
                    />
                </div>
            </div>

            <BitSpeedContext.Provider value={speed}>
                <div
                    ref={bitContainerRef}
                    className="Recorder-bitHost"
                    style={{ width, height }}
                >
                    <Suspense fallback={null}>
                        <BitComponent
                            key={`${bitSlug}-${recordingKey}`}
                            title={bit.name}
                            delay={0}
                            style={{}}
                            width={width}
                            height={height}
                            {...(bit.extraProps ?? {})}
                        />
                    </Suspense>
                </div>
            </BitSpeedContext.Provider>

            <div className="Recorder-footer">
                <button
                    className={`Recorder-record Recorder-record-${status}`}
                    onClick={handleRecord}
                    disabled={controlsDisabled}
                >
                    <svg
                        className="Recorder-recordIcon"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                        <circle cx="12" cy="12" r="6" fill="currentColor" />
                    </svg>
                    <span>rec</span>
                </button>
            </div>
            <div className="Recorder-progress">
                <div ref={progressFillRef} className="Recorder-progressFill" />
            </div>
        </div>
    )
}

export default Recorder
