'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  onDetected: (barcode: string) => void
  active: boolean
}

export default function BarcodeScanner({ onDetected, active }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const lastCode = useRef('')
  const lastTime = useRef(0)
  const [error, setError] = useState('')
  const readerRef = useRef<any>(null)

  useEffect(() => {
    if (!active) return

    let stopped = false

    async function start() {
      try {
        const { BrowserMultiFormatReader } = await import('@zxing/browser')
        const reader = new BrowserMultiFormatReader()
        readerRef.current = reader

        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter((d) => d.kind === 'videoinput')
        // Prefer back camera
        const backCam = videoDevices.find((d) => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('rear') || d.label.toLowerCase().includes('environment'))
        const deviceId = backCam?.deviceId || undefined

        if (stopped) return

        await reader.decodeFromVideoDevice(
          deviceId || undefined,
          videoRef.current!,
          (result) => {
            if (!result) return
            const code = result.getText()
            const now = Date.now()
            // Debounce: ignore same code within 2 seconds
            if (code === lastCode.current && now - lastTime.current < 2000) return
            lastCode.current = code
            lastTime.current = now
            onDetected(code)
          }
        )
      } catch (err: any) {
        if (!stopped) {
          setError(err.message || 'Camera nao disponivel')
        }
      }
    }

    start()

    return () => {
      stopped = true
      if (readerRef.current) {
        try { readerRef.current.reset() } catch {}
      }
    }
  }, [active, onDetected])

  if (error) {
    return (
      <div className="bg-gray-800 rounded-2xl p-6 text-center">
        <p className="text-red-400 text-sm mb-2">Camera nao disponivel</p>
        <p className="text-gray-500 text-xs">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-black" style={{ height: '55vh' }}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        muted
        autoPlay
      />

      {/* Scan overlay */}
      {active && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Darkened edges */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Clear scan area */}
          <div className="relative w-64 h-40 z-10">
            {/* Cut out the center */}
            <div className="absolute inset-0 border-2 border-white/30 rounded-xl" />

            {/* Green corner brackets */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-green-500 rounded-tl-lg" style={{ borderTopWidth: 3, borderLeftWidth: 3 }} />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-green-500 rounded-tr-lg" style={{ borderTopWidth: 3, borderRightWidth: 3 }} />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-green-500 rounded-bl-lg" style={{ borderBottomWidth: 3, borderLeftWidth: 3 }} />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-green-500 rounded-br-lg" style={{ borderBottomWidth: 3, borderRightWidth: 3 }} />

            {/* Animated scan line */}
            <div className="absolute left-2 right-2 h-0.5 bg-green-500/80 rounded-full animate-scan" />
          </div>

          <p className="absolute bottom-6 text-white/70 text-xs z-10">
            Aponte para o codigo de barras
          </p>
        </div>
      )}
    </div>
  )
}
