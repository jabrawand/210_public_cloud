import { useEffect } from 'react'
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet'
import polyline from '@mapbox/polyline'
import 'leaflet/dist/leaflet.css'

function decodePolyline(encoded) {
    if (!encoded) return []
    return polyline.decode(encoded).map(([lat, lng]) => [lat, lng])
}

function FitBounds({ positions }) {
    const map = useMap()

    useEffect(() => {
        if (positions.length === 0) return
        map.fitBounds(positions, { padding: [32, 32] })
    }, [map, positions])

    return null
}

export default function ActivityMap({ encodedPolyline }) {
    const positions = decodePolyline(encodedPolyline)

    if (positions.length === 0) {
        return (
            <div className='activity-details-map-empty'>
                Keine Routendaten verfügbar
            </div>
        )
    }

    return (
        <MapContainer
            className='activity-details-map'
            center={positions[0]}
            zoom={13}
            scrollWheelZoom={false}
            zoomControl={false}
            attributionControl={false}
        >
            <TileLayer url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' />
            <Polyline
                positions={positions}
                pathOptions={{ color: '#F4A261', weight: 4, opacity: 0.95 }}
            />
            <FitBounds positions={positions} />
        </MapContainer>
    )
}
