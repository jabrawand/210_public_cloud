export function formatDateForInput(dateString) {
    if (!dateString) return ''
    return dateString.split('T')[0]
}

export function raceToForm(race) {
    return {
        name: race.name ?? '',
        race_date: formatDateForInput(race.race_date),
        location: race.location ?? '',
        country_code: race.country_code ?? '',
        discipline: race.discipline ?? '',
        distance: race.distance ?? '',
        event_url: race.event_url ?? '',
        result: race.result ?? '',
    }
}

export function buildRacePayload(form) {
    return {
        name: form.name.trim(),
        race_date: form.race_date,
        location: form.location.trim(),
        country_code: form.country_code.trim().toUpperCase(),
        discipline: form.discipline.trim(),
        distance: form.distance.trim(),
        event_url: form.event_url.trim() || null,
        result: form.result.trim() || null,
    }
}
