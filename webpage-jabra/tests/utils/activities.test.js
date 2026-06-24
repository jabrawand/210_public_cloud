import { describe, it, expect } from 'vitest'
import {
    formatDuration,
    formatDistance,
    matchesFilter,
    formatActivityDetails,
} from '../../src/utils/activities'

describe('formatDuration', () => {
    it('formats seconds as H:MM:SS', () => {
        expect(formatDuration(3661)).toBe('1:01:01')
    })

    it('returns empty string for falsy input', () => {
        expect(formatDuration(0)).toBe('')
        expect(formatDuration(null)).toBe('')
    })
})

describe('formatDistance', () => {
    it('formats meters below 1000 as meters', () => {
        expect(formatDistance(500)).toBe('500 m')
    })

    it('formats kilometers with one decimal by default', () => {
        expect(formatDistance(42195)).toBe('42.2 km')
    })

    it('supports custom decimal places', () => {
        expect(formatDistance(42195, 2)).toBe('42.20 km')
    })
})

describe('matchesFilter', () => {
    it('returns true for filter "all"', () => {
        expect(matchesFilter('Run', 'all')).toBe(true)
    })

    it('matches swim sport types', () => {
        expect(matchesFilter('Swim', 'swim')).toBe(true)
        expect(matchesFilter('Run', 'swim')).toBe(false)
    })

    it('matches bike and ride sport types', () => {
        expect(matchesFilter('Ride', 'bike')).toBe(true)
        expect(matchesFilter('VirtualRide', 'bike')).toBe(true)
        expect(matchesFilter('Run', 'bike')).toBe(false)
    })

    it('matches run sport types', () => {
        expect(matchesFilter('Run', 'run')).toBe(true)
        expect(matchesFilter('TrailRun', 'run')).toBe(true)
        expect(matchesFilter('Swim', 'run')).toBe(false)
    })

    it('returns false for unknown filters', () => {
        expect(matchesFilter('Run', 'unknown')).toBe(false)
    })
})

describe('formatActivityDetails', () => {
    it('joins available activity fields', () => {
        const result = formatActivityDetails({
            distance: 10000,
            moving_time: 3600,
            sport_type: 'Run',
            total_elevation_gain: 150.4,
        })

        expect(result).toBe('10.0 km · 1:00:00 · Run · 150 m')
    })

    it('omits missing fields', () => {
        expect(formatActivityDetails({ sport_type: 'Swim' })).toBe('Swim')
    })

    it('omits zero elevation gain', () => {
        expect(
            formatActivityDetails({
                distance: 2000,
                moving_time: 2402,
                sport_type: 'Swim',
                total_elevation_gain: 0,
            })
        ).toBe('2.0 km · 0:40:02 · Swim')
    })
})
