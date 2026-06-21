import { describe, it, expect } from 'vitest'
import { formatDate, formatHeaderDate } from '../../src/utils/dateFormat'

describe('formatDate', () => {
    it('returns empty string for falsy input', () => {
        expect(formatDate('')).toBe('')
        expect(formatDate(null)).toBe('')
    })

    it('formats ISO date strings in de-CH locale', () => {
        expect(formatDate('2026-06-19T17:24:00')).toBe('19.06.2026')
    })
})

describe('formatHeaderDate', () => {
    it('returns empty string for falsy input', () => {
        expect(formatHeaderDate('')).toBe('')
    })

    it('formats ISO date strings with weekday and time', () => {
        const result = formatHeaderDate('2026-06-19T17:24:00')
        expect(result).toContain('2026')
        expect(result).toContain('19')
    })
})
