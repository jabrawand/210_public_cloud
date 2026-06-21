import { describe, it, expect } from 'vitest'
import { decodePolyline } from '../../src/utils/map'

describe('decodePolyline', () => {
    it('returns empty array for missing polyline', () => {
        expect(decodePolyline(null)).toEqual([])
        expect(decodePolyline('')).toEqual([])
    })

    it('decodes encoded polyline to lat/lng pairs', () => {
        const encoded = '_p~iF~ps|U_ulLnnqC_mqNvxq`@'
        const result = decodePolyline(encoded)

        expect(result.length).toBeGreaterThan(0)
        expect(result[0]).toHaveLength(2)
        expect(typeof result[0][0]).toBe('number')
        expect(typeof result[0][1]).toBe('number')
    })
})
