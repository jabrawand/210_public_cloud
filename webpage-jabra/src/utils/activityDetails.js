import { formatDuration, formatDistance } from './activities'

export function formatSpeed(mps) {
    if (!mps) return ''
    return `${(mps * 3.6).toFixed(1)} km/h`
}

export function formatSwimPace(mps) {
    if (!mps) return ''
    const totalSeconds = Math.round(100 / mps)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${String(seconds).padStart(2, '0')} /100 m`
}

export function formatRunPace(mps) {
    if (!mps) return ''
    const totalSeconds = Math.round(1000 / mps)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${String(seconds).padStart(2, '0')} /km`
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
    if (type.includes('weight')) return '🏋️'
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

function isWorkout(activity) {
    return (activity.sport_type || '').toLowerCase() === 'workout'
}

function isSwim(activity) {
    return (activity.sport_type || '').toLowerCase().includes('swim')
}

function isRun(activity) {
    return (activity.sport_type || '').toLowerCase().includes('run')
}

const STAT_FIELD_DEFS = {
    distance: { key: 'distance', label: 'Distanz', format: (v) => formatDistance(v, 2) },
    moving_time: { key: 'moving_time', label: 'Bewegungszeit', format: formatDuration },
    elapsed_time: { key: 'elapsed_time', label: 'Verstrichene Zeit', format: formatDuration },
    kilojoules: { key: 'kilojoules', label: 'Kalorien', format: formatKilojoulesAsKcal },
    total_elevation_gain: { key: 'total_elevation_gain', label: 'Höhenzunahme', format: formatElevation },
    average_speed: { key: 'average_speed', label: 'Durchschn. Geschwindigkeit', format: formatSpeed },
    average_swim_pace: { key: 'average_speed', label: 'Durchschn. Tempo', format: formatSwimPace },
    average_run_pace: { key: 'average_speed', label: 'Durchschn. Tempo', format: formatRunPace },
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
    { id: 'power', keys: ['average_watts', 'max_watts'], requires: (activity) => activity.device_watts },
    { id: 'elevation', keys: ['total_elevation_gain'] },
    { id: 'speed', keys: ['average_speed', 'max_speed'], requires: (activity) => !isWorkout(activity) },
    { id: 'heartrate', keys: ['average_heartrate', 'max_heartrate'], requires: (activity) => activity.has_heartrate },
    
]

function resolveStat(activity, fieldDef) {
    const { key, altKey, label, format, allowZero } = fieldDef
    const value =
        getStatValue(activity, key, { allowZero }) ??
        (altKey ? getStatValue(activity, altKey, { allowZero }) : null)

    if (value === null) return null

    return { label, value: format(value) }
}

function getSpeedGroupKeys(activity) {
    if (isSwim(activity)) return ['average_swim_pace']
    if (isRun(activity)) return ['average_run_pace']
    return ['average_speed', 'max_speed']
}

function getGroupKeys(group, activity) {
    if (group.id === 'overview' && isWorkout(activity)) {
        return group.keys.map((key) => (key === 'moving_time' ? 'elapsed_time' : key))
    }
    if (group.id === 'speed') {
        return getSpeedGroupKeys(activity)
    }
    return group.keys
}

export function getStatGroups(activity) {
    return STAT_GROUPS.filter((group) => !group.requires || group.requires(activity))
        .map((group) => {
            const keys = getGroupKeys(group, activity)

            return {
                id: group.id,
                stats: keys
                    .map((key) => resolveStat(activity, STAT_FIELD_DEFS[key]))
                    .filter(Boolean),
            }
        })
        .filter((group) => group.stats.length > 0)
}
