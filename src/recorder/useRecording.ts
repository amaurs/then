import { useCallback, useEffect, useRef, useState, RefObject } from 'react'

export type RecordingStatus = 'idle' | 'recording' | 'encoding' | 'done'

interface UseRecordingOptions {
    bitContainerRef: RefObject<HTMLDivElement>
    intermediateRef: RefObject<HTMLCanvasElement>
    progressFillRef: RefObject<HTMLDivElement>
    backgroundColor: string
    bitSlug: string
    format: 'square' | 'portrait'
}

const MP4_TYPES = [
    'video/mp4;codecs=avc1.42E01E',
    'video/mp4;codecs=h264',
    'video/mp4',
]

const WEBM_TYPES = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
]

const pickMimeType = (): string => {
    for (const t of [...MP4_TYPES, ...WEBM_TYPES]) {
        if (MediaRecorder.isTypeSupported(t)) return t
    }
    return ''
}

const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
}

let ffmpegInstance: any = null
let ffmpegLoading: Promise<any> | null = null

const getFFmpeg = async () => {
    if (ffmpegInstance) return ffmpegInstance
    if (ffmpegLoading) return ffmpegLoading
    ffmpegLoading = (async () => {
        const { FFmpeg } = await import('@ffmpeg/ffmpeg')
        const { toBlobURL } = await import('@ffmpeg/util')
        const ffmpeg = new FFmpeg()
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd'
        await ffmpeg.load({
            coreURL: await toBlobURL(
                `${baseURL}/ffmpeg-core.js`,
                'text/javascript'
            ),
            wasmURL: await toBlobURL(
                `${baseURL}/ffmpeg-core.wasm`,
                'application/wasm'
            ),
        })
        ffmpegInstance = ffmpeg
        return ffmpeg
    })()
    return ffmpegLoading
}

const transcodeToMp4 = async (input: Blob, ext: string): Promise<Blob> => {
    const { fetchFile } = await import('@ffmpeg/util')
    const ffmpeg = await getFFmpeg()
    const inputName = `input.${ext}`
    await ffmpeg.writeFile(inputName, await fetchFile(input))
    await ffmpeg.exec([
        '-i',
        inputName,
        '-c:v',
        'libx264',
        '-preset',
        'fast',
        '-crf',
        '20',
        '-pix_fmt',
        'yuv420p',
        '-movflags',
        '+faststart',
        'output.mp4',
    ])
    const data = await ffmpeg.readFile('output.mp4')
    return new Blob([data], { type: 'video/mp4' })
}

const drawLetterboxed = (
    target: HTMLCanvasElement,
    source: HTMLCanvasElement,
    background: string
) => {
    const ctx = target.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = background
    ctx.fillRect(0, 0, target.width, target.height)
    if (source.width === 0 || source.height === 0) return
    const sourceAspect = source.width / source.height
    const targetAspect = target.width / target.height
    let dw: number, dh: number, dx: number, dy: number
    if (sourceAspect > targetAspect) {
        dw = target.width
        dh = target.width / sourceAspect
        dx = 0
        dy = (target.height - dh) / 2
    } else {
        dh = target.height
        dw = target.height * sourceAspect
        dx = (target.width - dw) / 2
        dy = 0
    }
    ctx.drawImage(source, dx, dy, dw, dh)
}

export const useRecording = ({
    bitContainerRef,
    intermediateRef,
    progressFillRef,
    backgroundColor,
    bitSlug,
    format,
}: UseRecordingOptions) => {
    const [status, setStatus] = useState<RecordingStatus>('idle')
    const backgroundRef = useRef(backgroundColor)

    const setProgressWidth = (p: number) => {
        const el = progressFillRef.current
        if (el) el.style.width = `${p * 100}%`
    }

    useEffect(() => {
        backgroundRef.current = backgroundColor
    }, [backgroundColor])

    useEffect(() => {
        let frameId: number | null = null
        const draw = () => {
            const target = intermediateRef.current
            const source = bitContainerRef.current?.querySelector('canvas')
            if (target && source instanceof HTMLCanvasElement) {
                drawLetterboxed(target, source, backgroundRef.current)
            }
            frameId = requestAnimationFrame(draw)
        }
        frameId = requestAnimationFrame(draw)
        return () => {
            if (frameId !== null) cancelAnimationFrame(frameId)
        }
    }, [bitContainerRef, intermediateRef])

    const start = useCallback(
        (durationSeconds: number) => {
            const target = intermediateRef.current
            if (!target) return
            const mimeType = pickMimeType()
            if (!mimeType) {
                console.error('No supported MediaRecorder mime type')
                return
            }
            const stream = target.captureStream(30)
            const chunks: Blob[] = []
            let recorder: MediaRecorder
            try {
                recorder = new MediaRecorder(stream, {
                    mimeType,
                    videoBitsPerSecond: 8_000_000,
                })
            } catch (e) {
                console.error('MediaRecorder failed', e)
                return
            }
            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) chunks.push(e.data)
            }
            recorder.onstop = async () => {
                const blob = new Blob(chunks, { type: mimeType })
                const isMp4 = mimeType.startsWith('video/mp4')
                const stamp = new Date()
                    .toISOString()
                    .replace(/[:.]/g, '-')
                    .slice(0, 19)
                const baseName = `${bitSlug}-${format}-${stamp}`
                if (isMp4) {
                    triggerDownload(blob, `${baseName}.mp4`)
                    setStatus('idle')
                    setProgressWidth(0)
                    return
                }
                setStatus('encoding')
                try {
                    const ext = mimeType.includes('webm') ? 'webm' : 'bin'
                    const mp4 = await transcodeToMp4(blob, ext)
                    triggerDownload(mp4, `${baseName}.mp4`)
                    setStatus('idle')
                    setProgressWidth(0)
                } catch (e) {
                    console.error('Transcode failed', e)
                    setStatus('idle')
                    setProgressWidth(0)
                }
            }
            recorder.start()
            setStatus('recording')
            setProgressWidth(0)
            const startedAt = performance.now()
            const durationMs = durationSeconds * 1000
            let stopped = false
            const tick = () => {
                if (stopped) return
                const elapsed = performance.now() - startedAt
                const p = Math.min(1, elapsed / durationMs)
                setProgressWidth(p)
                if (p >= 1) {
                    stopped = true
                    if (recorder.state !== 'inactive') recorder.stop()
                    return
                }
                requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
        },
        [intermediateRef, progressFillRef, bitSlug, format]
    )

    return { status, start }
}
