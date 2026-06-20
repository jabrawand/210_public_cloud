import React from 'react'
import { supabase } from '../supabase-client'
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { athlete } from '../config/athlete'
import ActivityMap from './ActivityMap'
import '../css/ActivityDetails.css'

async function getActivity(id) {
    const { data, error } = await supabase
        .from('strava_activities')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error(error)
        return null
    }
    return data
}

function formatHeaderDate(dateString) {
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

function formatDuration(seconds) {
    if (!seconds) return ''
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function formatDistance(meters) {
    if (!meters) return ''
    if (meters >= 1000) return `${(meters / 1000).toFixed(2)} km`
    return `${meters} m`
}

function formatSpeed(mps) {
    if (!mps) return ''
    return `${(mps * 3.6).toFixed(1)} km/h`
}

function formatCalories(value) {
    if (!value) return ''
    return `${Math.round(value).toLocaleString('de-CH')} kcal`
}

function formatLocation(activity) {
    const parts = [activity.location_city, activity.location_state].filter(Boolean)
    if (parts.length > 0) return parts.join(', ')
    return athlete.location
}

function getSportIcon(sportType) {
    const type = (sportType || '').toLowerCase()
    if (type.includes('swim')) return '🏊'
    if (type.includes('run')) return '🏃'
    if (type.includes('ride') || type.includes('bike')) return '🚴'
    return '🏅'
}

function getStatValue(activity, key) {
    const value = activity[key]
    if (value === null || value === undefined || value === '' || value === 0) return null
    return value
}

const statFields = [
    { key: 'distance', label: 'Distanz', format: formatDistance },
    { key: 'moving_time', label: 'Bewegungszeit', format: formatDuration },
    { key: 'average_speed', label: 'Durchschn. Geschwindigkeit', format: formatSpeed },
    { key: 'total_elevation_gain', label: 'Höhenzunahme', format: (v) => `${Math.round(v)} m` },
    { key: 'average_watts', label: 'Durchschn. Leistung', format: (v) => `${Math.round(v)} W`, altKey: 'weighted_average_watts' },
    { key: 'calories', label: 'Kalorien', format: formatCalories },
]

export default function ActivityDetails() {
    const { id } = useParams()
    const [activity, setActivity] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getActivity(id).then((data) => {
            setActivity(data)
            setLoading(false)
        })
    }, [id])

    if (loading) {
        return <div className='activity-details-container'><p className='activity-details-loading'>Laden...</p></div>
    }

    if (!activity) {
        return (
            <div className='activity-details-container'>
                <p className='activity-details-error'>Aktivität nicht gefunden.</p>
                <Link to='/activities' className='activity-details-back'>Zurück zur Übersicht</Link>
            </div>
        )
    }

    const polyline = activity.summary_polyline || activity.map_summary_polyline
    const visibleStats = statFields
        .map(({ key, altKey, label, format }) => {
            const value = getStatValue(activity, key) ?? (altKey ? getStatValue(activity, altKey) : null)
            if (value === null) return null
            return { label, value: format(value) }
        })
        .filter(Boolean)

    return (
        <div className='activity-details-container'>
            <h1 className='activity-details-title'>Trainingsdetails</h1>

            <div className='activity-details-layout'>
                <Link to='/activities' className='activity-details-back-btn' aria-label='Zurück zur Übersicht'>
                    ←
                </Link>

                <section className='activity-details-info-card'>
                    <div className='activity-details-profile'>
                        <div className='activity-details-avatar' aria-hidden='true'>
                            {athlete.firstName[0]}{athlete.lastName[0]}
                        </div>
                        <div className='activity-details-profile-text'>
                            <p className='activity-details-athlete-name'>
                                {athlete.firstName} {athlete.lastName}
                            </p>
                            <p className='activity-details-meta'>
                                <span className='activity-details-sport-icon' aria-hidden='true'>
                                    {getSportIcon(activity.sport_type)}
                                </span>
                                {formatHeaderDate(activity.start_date_local)} · {formatLocation(activity)}
                            </p>
                        </div>
                    </div>

                    <h2 className='activity-details-activity-name'>{activity.name}</h2>

                    <div className='activity-details-stats-grid'>
                        {visibleStats.map(({ label, value }) => (
                            <div key={label} className='activity-details-stat'>
                                <span className='activity-details-stat-label'>{label}</span>
                                <span className='activity-details-stat-value'>{value}</span>
                            </div>
                        ))}
                    </div>

                    {activity.strava_id && (
                        <a
                            href={`https://www.strava.com/activities/${activity.strava_id}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='activity-details-strava-link'
                        >
                            Auf Strava ansehen
                        </a>
                    )}
                </section>

                <section className='activity-details-map-card'>
                    <ActivityMap encodedPolyline={polyline} />
                </section>
            </div>
        </div>
    )
}
