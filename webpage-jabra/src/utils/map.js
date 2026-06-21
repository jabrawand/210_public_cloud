import polyline from '@mapbox/polyline'

export function decodePolyline(encoded) {
    if (!encoded) return []
    return polyline.decode(encoded).map(([lat, lng]) => [lat, lng])
}
