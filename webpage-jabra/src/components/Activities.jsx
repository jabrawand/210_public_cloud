import { useState, useEffect } from 'react'
import { supabase } from '../supabase-client'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { formatDuration, formatDistance, matchesFilter, formatActivityDetails } from '../utils/activities'
import { formatDate } from '../utils/dateFormat'
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

async function checkIsAdmin() {
    const { data, error } = await supabase.rpc('is_admin')

    if (error) {
        console.error(error)
        return false
    }

    return data === true
}

async function syncStravaActivities(accessToken) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

    const response = await fetch(
        `${supabaseUrl}/functions/v1/sync-strava-activities`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                apikey: publishableKey,
                'Content-Type': 'application/json',
            },
        }
    )

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(data?.error ?? `HTTP ${response.status}`)
    }

    return data
}

const FILTERS = [
    { id: 'all', label: 'ALLE' },
    { id: 'swim', label: 'SWIM' },
    { id: 'bike', label: 'BIKE' },
    { id: 'run', label: 'RUN' },
]

export default function Activities() {
    const [activities, setActivities] = useState([])
    const [activeFilter, setActiveFilter] = useState('all')
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState(null)
    const [isAdminUser, setIsAdminUser] = useState(false)
    const [syncing, setSyncing] = useState(false)
    const [syncError, setSyncError] = useState(null)
    const [syncMessage, setSyncMessage] = useState(null)
    const navigate = useNavigate()
    const { isAuthenticated, session } = useAuth()

    const handleActivityClick = (activityId) => {
        if (isAuthenticated) {
            navigate(`/activities/${activityId}`)
        }
    }

    const handleActivityKeyDown = (activityId) => (event) => {
        if (!isAuthenticated) return
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            navigate(`/activities/${activityId}`)
        }
    }

    const loadActivities = async () => {
        setLoading(true)
        setLoadError(null)
        const { data, error } = await getStravaActivities()
        setActivities(data)
        setLoadError(error?.message ?? null)
        setLoading(false)
    }

    useEffect(() => {
        loadActivities()
    }, [])

    useEffect(() => {
        if (!session) {
            setIsAdminUser(false)
            return
        }
        checkIsAdmin().then(setIsAdminUser)
    }, [session])

    const handleSyncStrava = async () => {
        if (!session || syncing) return

        setSyncing(true)
        setSyncError(null)
        setSyncMessage(null)

        try {
            const data = await syncStravaActivities(session.access_token)

            if (!data?.success) {
                setSyncError(data?.error ?? 'Synchronisation fehlgeschlagen.')
                return
            }

            setSyncMessage(
                data.synced === 0
                    ? 'Keine neuen Trainings gefunden.'
                    : `${data.synced} Training${data.synced === 1 ? '' : 's'} synchronisiert.`
            )
            await loadActivities()
        } catch (err) {
            console.error(err)
            setSyncError(err instanceof Error ? err.message : String(err))
        } finally {
            setSyncing(false)
        }
    }

    const filteredActivities = activities.filter((activity) =>
        matchesFilter(activity.sport_type, activeFilter)
    )

    return (
        <div className='activities-container'>
            <div className='activities-section-content'>
                <h1 className='activities-section-title'>Activities</h1>

                {isAuthenticated && isAdminUser && (
                    <button
                        type='button'
                        className='activities-section-sync-btn'
                        onClick={handleSyncStrava}
                        disabled={syncing}
                    >
                        {syncing ? 'Synchronisiere…' : 'Strava synchronisieren'}
                    </button>
                )}

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
                    Hier findest du eine Übersicht meiner Trainingseinheiten
                </p>
                {!isAuthenticated && (
                    <p className='activities-section-hint'>
                        Melde dich an, um Trainingsdetails anzusehen.
                    </p>
                )}
                {syncError && (
                    <p className='activities-section-status activities-section-status--error'>
                        Synchronisation fehlgeschlagen: {syncError}
                    </p>
                )}
                {syncMessage && (
                    <p className='activities-section-status activities-section-status--success'>
                        {syncMessage}
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
                            role={isAuthenticated ? 'button' : undefined}
                            tabIndex={isAuthenticated ? 0 : undefined}
                            onClick={() => handleActivityClick(activity.id)}
                            onKeyDown={handleActivityKeyDown(activity.id)}
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
