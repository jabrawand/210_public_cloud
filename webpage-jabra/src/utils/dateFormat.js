export function formatDate(dateString) {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('de-CH', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}

export function formatHeaderDate(dateString) {
    if (!dateString) return ''
    return new Date(dateString).toLocaleString('de-CH', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}
