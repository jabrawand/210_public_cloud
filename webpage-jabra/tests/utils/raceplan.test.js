import { describe, it, expect } from 'vitest'
import { buildRacePayload, raceToForm, formatDateForInput } from '../../src/utils/raceplan'

describe('formatDateForInput', () => {
    it('extracts date part from ISO string', () => {
        expect(formatDateForInput('2026-09-15T00:00:00')).toBe('2026-09-15')
    })

    it('returns empty string for falsy input', () => {
        expect(formatDateForInput('')).toBe('')
    })
})

describe('raceToForm', () => {
    it('maps race object to form fields', () => {
        expect(
            raceToForm({
                name: 'Ironman',
                race_date: '2026-07-01T00:00:00',
                location: 'Zürich',
                country_code: 'ch',
                discipline: 'Triathlon',
                distance: '226 km',
                event_url: 'https://example.com',
                result: '10:30:00',
            })
        ).toEqual({
            name: 'Ironman',
            race_date: '2026-07-01',
            location: 'Zürich',
            country_code: 'ch',
            discipline: 'Triathlon',
            distance: '226 km',
            event_url: 'https://example.com',
            result: '10:30:00',
        })
    })
})

describe('buildRacePayload', () => {
    it('trims strings and uppercases country code', () => {
        expect(
            buildRacePayload({
                name: '  Marathon  ',
                race_date: '2026-04-12',
                location: ' Bern ',
                country_code: ' ch ',
                discipline: ' Marathon ',
                distance: ' 42.195 km ',
                event_url: ' https://example.com ',
                result: ' 3:30:00 ',
            })
        ).toEqual({
            name: 'Marathon',
            race_date: '2026-04-12',
            location: 'Bern',
            country_code: 'CH',
            discipline: 'Marathon',
            distance: '42.195 km',
            event_url: 'https://example.com',
            result: '3:30:00',
        })
    })

    it('sets empty result to null', () => {
        expect(
            buildRacePayload({
                name: 'Test',
                race_date: '2026-01-01',
                location: 'Ort',
                country_code: 'CH',
                discipline: 'Run',
                distance: '10 km',
                event_url: 'https://example.com',
                result: '   ',
            }).result
        ).toBe(null)
    })

    it('sets empty event_url to null', () => {
        expect(
            buildRacePayload({
                name: 'Test',
                race_date: '2026-01-01',
                location: 'Ort',
                country_code: 'CH',
                discipline: 'Run',
                distance: '10 km',
                event_url: '   ',
                result: '',
            }).event_url
        ).toBe(null)
    })
})
