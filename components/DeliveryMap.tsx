'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const PRAIA_CENTER: [number, number] = [14.9215, -23.5087]
const DEFAULT_ZOOM = 14

interface Props {
  onLocationSelect: (lat: number, lng: number, address: string) => void
}

export default function DeliveryMap({ onLocationSelect }: Props) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!visible || !containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: PRAIA_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    const icon = L.divIcon({
      html: `<svg viewBox="0 0 24 24" width="32" height="32" fill="#16a34a" stroke="white" stroke-width="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    })

    const reverseGeocode = async (lat: number, lng: number) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
          { headers: { 'Accept-Language': 'pt' } }
        )
        const data = await res.json()
        const addr = data.display_name?.split(',').slice(0, 3).join(',').trim() || `${lat.toFixed(5)}, ${lng.toFixed(5)}`
        onLocationSelect(lat, lng, addr)
      } catch {
        onLocationSelect(lat, lng, `${lat.toFixed(5)}, ${lng.toFixed(5)}`)
      }
    }

    const placeMarker = (latlng: L.LatLng) => {
      if (markerRef.current) {
        markerRef.current.setLatLng(latlng)
      } else {
        markerRef.current = L.marker(latlng, { icon, draggable: true }).addTo(map)
        markerRef.current.on('dragend', () => {
          const pos = markerRef.current!.getLatLng()
          reverseGeocode(pos.lat, pos.lng)
        })
      }
      reverseGeocode(latlng.lat, latlng.lng)
    }

    map.on('click', (e: L.LeafletMouseEvent) => placeMarker(e.latlng))

    mapRef.current = map

    // Fix tile rendering after toggle
    setTimeout(() => map.invalidateSize(), 100)

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  return (
    <div>
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-green-700 hover:text-green-800 font-medium transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {visible ? 'Ocultar mapa' : 'Marcar no mapa'}
      </button>
      {visible && (
        <div className="mt-2 space-y-1">
          <p className="text-[11px] text-gray-400">Toque no mapa para marcar a sua localizacao</p>
          <div
            ref={containerRef}
            className="w-full h-[200px] rounded-xl border border-gray-200 overflow-hidden"
          />
        </div>
      )}
    </div>
  )
}
