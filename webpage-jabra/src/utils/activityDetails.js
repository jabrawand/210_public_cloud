import { formatDuration, formatDistance } from './activities'

export function formatSpeed(mps) {
    if (!mps) return ''
    return `${(mps * 3.6).toFixed(1)} km/h`
}

const KJ_TO_KCAL = 4.184

export function formatKilojoulesAsKcal(kilojoules) {
    if (!kilojoules) return ''
    const kcal = kilojoules / KJ_TO_KCAL
    return `${Math.round(kcal).toLocaleString('de-CH')} kcal`
}

export function getSportIcon(sportType) {
    const type = (sportType || '').toLowerCase()
    if (type.includes('swim')) return '🏊'
    if (type.includes('run')) return '🏃'
    if (type.includes('ride') || type.includes('bike')) return '🚴'
    return '🏅'
}

export function getStatValue(activity, key, { allowZero = false } = {}) {
    const value = activity[key]
    if (value === null || value === undefined || value === '') return null
    if (!allowZero && value === 0) return null
    return value
}

export function formatElevation(value) {
    if (value === null || value === undefined || value === '') return ''
    return `${Math.round(value)} m`
}

export function formatWatts(value) {
    if (!value) return ''
    return `${Math.round(value)} W`
}

export function formatHeartrate(value) {
    if (!value) return ''
    return `${Math.round(value)} bpm`
}

const STAT_FIELD_DEFS = {
    distance: { key: 'distance', label: 'Distanz', format: (v) => formatDistance(v, 2) },
    moving_time: { key: 'moving_time', label: 'Bewegungszeit', format: formatDuration },
    kilojoules: { key: 'kilojoules', label: 'Kalorien', format: formatKilojoulesAsKcal },
    total_elevation_gain: { key: 'total_elevation_gain', label: 'Höhenzunahme', format: formatElevation },
    elev_low: { key: 'elev_low', label: 'Tiefste Höhe', format: formatElevation },
    elev_high: { key: 'elev_high', label: 'Höchste Höhe', format: formatElevation },
    average_speed: { key: 'average_speed', label: 'Durchschn. Geschwindigkeit', format: formatSpeed },
    max_speed: { key: 'max_speed', label: 'Max. Geschwindigkeit', format: formatSpeed },
    average_heartrate: { key: 'average_heartrate', label: 'Durchschn. Herzfrequenz', format: formatHeartrate },
    max_heartrate: { key: 'max_heartrate', label: 'Max. Herzfrequenz', format: formatHeartrate },
    average_watts: {
        key: 'average_watts',
        label: 'Durchschn. Leistung',
        format: formatWatts,
        altKey: 'weighted_average_watts',
    },
    max_watts: { key: 'max_watts', label: 'Max. Leistung', format: formatWatts },
}

const STAT_GROUPS = [
    { id: 'overview', keys: ['distance', 'moving_time', 'kilojoules'] },
    { id: 'elevation', keys: ['total_elevation_gain', 'elev_low', 'elev_high'] },
    { id: 'speed', keys: ['average_speed', 'max_speed'] },
    { id: 'heartrate', keys: ['average_heartrate', 'max_heartrate'], requires: (activity) => activity.has_heartrate },
    { id: 'power', keys: ['average_watts', 'max_watts'], requires: (activity) => activity.device_watts },
]

function resolveStat(activity, fieldDef) {
    const { key, altKey, label, format, allowZero } = fieldDef
    const value =
        getStatValue(activity, key, { allowZero }) ??
        (altKey ? getStatValue(activity, altKey, { allowZero }) : null)

    if (value === null) return null

    return { label, value: format(value) }
}

export function getStatGroups(activity) {
    return STAT_GROUPS.filter((group) => !group.requires || group.requires(activity))
        .map((group) => ({
            id: group.id,
            stats: group.keys
                .map((key) => resolveStat(activity, STAT_FIELD_DEFS[key]))
                .filter(Boolean),
        }))
        .filter((group) => group.stats.length > 0)
}
