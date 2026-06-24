export function formatDuration(seconds) {
    if (!seconds) return ''
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export function formatDistance(meters, decimals = 1) {
    if (!meters) return ''
    if (meters >= 1000) return `${(meters / 1000).toFixed(decimals)} km`
    return `${meters} m`
}

export function matchesFilter(sportType, filter) {
    if (filter === 'all') return true
    const type = (sportType || '').toLowerCase()
    if (filter === 'swim') return type.includes('swim')
    if (filter === 'bike') return type.includes('ride') || type.includes('bike')
    if (filter === 'run') return type.includes('run')
    return false
}

export function formatActivityDetails(activity) {
    const parts = [
        activity.distance ? formatDistance(activity.distance) : null,
        activity.moving_time ? formatDuration(activity.moving_time) : null,
        activity.sport_type || null,
        activity.total_elevation_gain > 0 ? `${Math.round(activity.total_elevation_gain)} m` : null,
    ].filter(Boolean)

    return parts.join(' · ')
}
