import { describe, it, expect } from 'vitest'
import {
    getStatGroups,
    getStatValue,
    getSportIcon,
    formatKilojoulesAsKcal,
    formatSwimPace,
    formatRunPace,
} from '../../src/utils/activityDetails'

describe('formatKilojoulesAsKcal', () => {
    it('converts kilojoules to kcal', () => {
        expect(formatKilojoulesAsKcal(418.4)).toBe('100 kcal')
    })

    it('returns empty string for falsy input', () => {
        expect(formatKilojoulesAsKcal(0)).toBe('')
    })
})

describe('formatSwimPace', () => {
    it('formats pace as time per 100 m', () => {
        expect(formatSwimPace(1000 / 1205)).toBe('2:00 /100 m')
    })

    it('returns empty string for falsy input', () => {
        expect(formatSwimPace(0)).toBe('')
    })
})

describe('formatRunPace', () => {
    it('formats pace as time per km', () => {
        expect(formatRunPace(8000 / 2378)).toBe('4:57 /km')
    })

    it('returns empty string for falsy input', () => {
        expect(formatRunPace(0)).toBe('')
    })
})

describe('getStatValue', () => {
    const activity = { distance: 10000, elev_low: 0, kilojoules: '' }

    it('returns value when present', () => {
        expect(getStatValue(activity, 'distance')).toBe(10000)
    })

    it('returns null for missing or empty values', () => {
        expect(getStatValue(activity, 'kilojoules')).toBe(null)
        expect(getStatValue(activity, 'missing')).toBe(null)
    })

    it('treats zero as missing unless allowZero is true', () => {
        expect(getStatValue(activity, 'elev_low')).toBe(null)
        expect(getStatValue(activity, 'elev_low', { allowZero: true })).toBe(0)
    })
})

describe('getStatGroups', () => {
    it('groups overview stats together', () => {
        const groups = getStatGroups({
            distance: 18360,
            moving_time: 2276,
            kilojoules: 1882.8,
        })

        expect(groups[0].id).toBe('overview')
        expect(groups[0].stats.map((stat) => stat.label)).toEqual([
            'Distanz',
            'Bewegungszeit',
            'Kalorien',
        ])
        expect(groups[0].stats[2].value).toBe('450 kcal')
    })

    it('groups elevation stats in a separate section', () => {
        const groups = getStatGroups({
            distance: 1000,
            total_elevation_gain: 81,
        })

        const elevationGroup = groups.find((group) => group.id === 'elevation')
        expect(elevationGroup.stats.map((stat) => stat.label)).toEqual(['Höhenzunahme'])
        expect(elevationGroup.stats[0].value).toBe('81 m')
    })

    it('groups speed stats separately', () => {
        const groups = getStatGroups({
            distance: 1000,
            average_speed: 8.05,
            max_speed: 12.5,
        })

        const speedGroup = groups.find((group) => group.id === 'speed')
        expect(speedGroup.stats.map((stat) => stat.label)).toEqual([
            'Durchschn. Geschwindigkeit',
            'Max. Geschwindigkeit',
        ])
    })

    it('adds heartrate group when has_heartrate is true', () => {
        const groups = getStatGroups({
            distance: 1000,
            has_heartrate: true,
            average_heartrate: 131,
            max_heartrate: 153,
        })

        const heartrateGroup = groups.find((group) => group.id === 'heartrate')
        expect(heartrateGroup.stats.map((stat) => stat.label)).toEqual([
            'Durchschn. Herzfrequenz',
            'Max. Herzfrequenz',
        ])
    })

    it('adds power group when device_watts is true', () => {
        const groups = getStatGroups({
            distance: 1000,
            device_watts: true,
            average_watts: 151,
            max_watts: 561,
        })

        const powerGroup = groups.find((group) => group.id === 'power')
        expect(powerGroup.stats.map((stat) => stat.label)).toEqual([
            'Durchschn. Leistung',
            'Max. Leistung',
        ])
    })

    it('omits empty groups', () => {
        const groups = getStatGroups({ distance: 1000 })
        expect(groups.find((group) => group.id === 'elevation')).toBeUndefined()
        expect(groups.find((group) => group.id === 'power')).toBeUndefined()
    })

    it('uses elapsed time and omits speed for workout activities', () => {
        const groups = getStatGroups({
            sport_type: 'Workout',
            distance: 138.7,
            moving_time: 45,
            elapsed_time: 120,
            average_speed: 11.1,
            max_speed: 13.0,
            has_heartrate: true,
            average_heartrate: 153,
            max_heartrate: 160,
        })

        const overviewGroup = groups.find((group) => group.id === 'overview')
        expect(overviewGroup.stats.map((stat) => stat.label)).toEqual(['Distanz', 'Verstrichene Zeit'])
        expect(overviewGroup.stats[1].value).toBe('0:02:00')
        expect(groups.find((group) => group.id === 'speed')).toBeUndefined()
    })

    it('shows swim pace instead of speed for swim activities', () => {
        const groups = getStatGroups({
            sport_type: 'Swim',
            distance: 1000,
            moving_time: 1205,
            average_speed: 1000 / 1205,
            max_speed: 1.5,
        })

        const speedGroup = groups.find((group) => group.id === 'speed')
        expect(speedGroup.stats).toEqual([
            { label: 'Durchschn. Tempo', value: '2:00 /100 m' },
        ])
    })

    it('shows run pace instead of speed for run activities', () => {
        const groups = getStatGroups({
            sport_type: 'Run',
            distance: 8000,
            moving_time: 2378,
            average_speed: 8000 / 2378,
            max_speed: 5.5,
        })

        const speedGroup = groups.find((group) => group.id === 'speed')
        expect(speedGroup.stats).toEqual([
            { label: 'Durchschn. Tempo', value: '4:57 /km' },
        ])
    })
})

describe('getSportIcon', () => {
    it('returns sport-specific icons', () => {
        expect(getSportIcon('Swim')).toBe('🏊')
        expect(getSportIcon('Run')).toBe('🏃')
        expect(getSportIcon('Ride')).toBe('🚴')
        expect(getSportIcon('WeightTraining')).toBe('🏋️')
    })

    it('returns fallback icon for unknown sports', () => {
        expect(getSportIcon('Yoga')).toBe('🏅')
    })
})
