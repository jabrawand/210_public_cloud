import React from 'react'
import { supabase } from '../supabase-client'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../css/Activities.css'

async function getStravaActivities() {
    const { data, error } = await supabase
        .from('strava_activities_overview')
        .select('*')
        .order('start_date_local', { ascending: false })

    if (error) {
        console.error(error)
        return { data: [], error }
    }

    return { data: data ?? [], error: null }
}

function formatDate(dateString) {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('de-CH', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
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
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`
    return `${meters} m`
}

const FILTERS = [
    { id: 'all', label: 'ALLE' },
    { id: 'swim', label: 'SWIM' },
    { id: 'bike', label: 'BIKE' },
    { id: 'run', label: 'RUN' },
]

function matchesFilter(sportType, filter) {
    if (filter === 'all') return true
    const type = (sportType || '').toLowerCase()
    if (filter === 'swim') return type.includes('swim')
    if (filter === 'bike') return type.includes('ride') || type.includes('bike')
    if (filter === 'run') return type.includes('run')
    return true
}

function formatActivityDetails(activity) {
    const parts = [
        activity.distance ? formatDistance(activity.distance) : null,
        activity.moving_time ? formatDuration(activity.moving_time) : null,
        activity.sport_type || null,
        activity.total_elevation_gain != null ? `${Math.round(activity.total_elevation_gain)} m` : null,
    ].filter(Boolean)

    return parts.join(' · ')
}

export default function Activities() {
    const [activities, setActivities] = useState([])
    const [activeFilter, setActiveFilter] = useState('all')
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState(null)
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()

    const handleActivityClick = (activityId) => {
        if (isAuthenticated) {
            navigate(`/activities/${activityId}`)
        }
    }

    useEffect(() => {
        setLoading(true)
        setLoadError(null)
        getStravaActivities().then(({ data, error }) => {
            setActivities(data)
            setLoadError(error?.message ?? null)
            setLoading(false)
        })
    }, [])

    const filteredActivities = activities.filter((activity) =>
        matchesFilter(activity.sport_type, activeFilter)
    )

    return (
        <div className='activities-container'>
            <div className='activities-section-content'>
                <div className='activities-section-filters'>
                    {FILTERS.map(({ id, label }) => (
                        <button
                            key={id}
                            type='button'
                            className={`activities-filter-btn${activeFilter === id ? ' activities-filter-btn--active' : ''}`}
                            onClick={() => setActiveFilter(id)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <p className='activities-section-subtitle'>
                    Hier findest du eine Übersicht meinen Trainingseinheiten
                </p>
                {!isAuthenticated && (
                    <p className='activities-section-hint'>
                        Melde dich an, um Trainingsdetails anzusehen.
                    </p>
                )}
                {loading && (
                    <p className='activities-section-status'>Trainings werden geladen…</p>
                )}
                {!loading && loadError && (
                    <p className='activities-section-status activities-section-status--error'>
                        Trainings konnten nicht geladen werden: {loadError}
                    </p>
                )}
                {!loading && !loadError && filteredActivities.length === 0 && (
                    <p className='activities-section-status'>Keine Trainings gefunden.</p>
                )}
                <ul className='activities-section-grid'>
                    {filteredActivities.map((activity) => (
                        <li
                            key={activity.id}
                            className={`activities-section-card${isAuthenticated ? '' : ' activities-section-card--disabled'}`}
                            onClick={() => handleActivityClick(activity.id)}
                        >
                            <h3 className='activities-section-card-title'>
                                {activity.name} – {formatDate(activity.start_date_local)}
                            </h3>
                            <p className='activities-section-card-details'>
                                {formatActivityDetails(activity)}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
