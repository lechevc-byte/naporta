'use client'

import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat, NotFoundException } from '@zxing/library'

interface Props {
  onDetected: (barcode: string) => void
  active: boolean
}

export default function BarcodeScanner({ onDetected, active }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const lastCode = useRef('')
  const lastTime = useRef(0)
  const [error, setError] = useState('')
  const readerRef = useRef<BrowserMultiFormatReader | null>(null)

  useEffect(() => {
    if (!active) return

    let stopped = false

    const hints = new Map()
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.CODE_128,
      BarcodeFormat.QR_CODE,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
    ])
    hints.set(DecodeHintType.TRY_HARDER, true)

    const codeReader = new BrowserMultiFormatReader(hints)
    readerRef.current = codeReader

    async function startScan(exactFacing: boolean) {
      if (stopped || !videoRef.current) return

      const constraints = {
        video: {
          facingMode: exactFacing ? { exact: 'environment' as const } : { ideal: 'environment' as const },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      }

      try {
        await codeReader.decodeFromConstraints(
          constraints,
          videoRef.current,
          (result, err) => {
            if (result) {
              const code = result.getText()
              const now = Date.now()
              if (code === lastCode.current && now - lastTime.current < 2000) return
              lastCode.current = code
              lastTime.current = now
              onDetected(code)
            }
            if (err && !(err instanceof NotFoundException)) {
              // Real error, not just "no barcode in frame"
              console.error('Scan error:', err)
            }
          }
        )
      } catch (e: any) {
        if (stopped) return
        // If exact: environment fails (desktop/iOS), retry with ideal
        if (exactFacing) {
          console.warn('Exact environment failed, falling back to ideal')
          await startScan(false)
        } else {
          setError(e.message || 'Camera nao disponivel')
        }
      }
    }

    startScan(true)

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

      {active && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative w-64 h-40 z-10">
            <div className="absolute inset-0 border-2 border-white/30 rounded-xl" />
            <div className="absolute top-0 left-0 w-6 h-6 rounded-tl-lg" style={{ borderTop: '3px solid #22c55e', borderLeft: '3px solid #22c55e' }} />
            <div className="absolute top-0 right-0 w-6 h-6 rounded-tr-lg" style={{ borderTop: '3px solid #22c55e', borderRight: '3px solid #22c55e' }} />
            <div className="absolute bottom-0 left-0 w-6 h-6 rounded-bl-lg" style={{ borderBottom: '3px solid #22c55e', borderLeft: '3px solid #22c55e' }} />
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-br-lg" style={{ borderBottom: '3px solid #22c55e', borderRight: '3px solid #22c55e' }} />
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
