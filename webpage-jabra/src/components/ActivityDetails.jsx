import { useState, useEffect, Fragment } from 'react'
import { supabase } from '../supabase-client'
import { useParams, Link } from 'react-router-dom'
import { athlete } from '../config/athlete'
import ActivityMap from './ActivityMap'
import { getStatGroups, getSportIcon } from '../utils/activityDetails'
import { formatHeaderDate } from '../utils/dateFormat'
import '../css/ActivityDetails.css'

async function getActivity(id) {
    const { data, error } = await supabase
        .from('strava_activities')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error(error)
        const isNotFound = error.code === 'PGRST116'
        return { data: null, error: isNotFound ? null : error }
    }

    return { data, error: null }
}

export default function ActivityDetails() {
    const { id } = useParams()
    const [activity, setActivity] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState(null)

    useEffect(() => {
        setLoading(true)
        setLoadError(null)
        getActivity(id).then(({ data, error }) => {
            setActivity(data)
            setLoadError(error?.message ?? null)
            setLoading(false)
        })
    }, [id])

    if (loading) {
        return (
            <div className='activity-details-container'>
                <div className='activity-details-section-content'>
                    <h1 className='activity-details-section-title'>Trainingsdetails</h1>
                    <p className='activity-details-loading'>Laden...</p>
                </div>
            </div>
        )
    }

    if (loadError) {
        return (
            <div className='activity-details-container'>
                <div className='activity-details-section-content'>
                    <h1 className='activity-details-section-title'>Trainingsdetails</h1>
                    <p className='activity-details-error'>
                        Trainingsdetails konnten nicht geladen werden: {loadError}
                    </p>
                    <Link to='/activities' className='activity-details-back'>Zurück zur Übersicht</Link>
                </div>
            </div>
        )
    }

    if (!activity) {
        return (
            <div className='activity-details-container'>
                <div className='activity-details-section-content'>
                    <h1 className='activity-details-section-title'>Trainingsdetails</h1>
                    <p className='activity-details-error'>Aktivität nicht gefunden.</p>
                    <Link to='/activities' className='activity-details-back'>Zurück zur Übersicht</Link>
                </div>
            </div>
        )
    }

    const statGroups = getStatGroups(activity)

    return (
        <div className='activity-details-container'>
            <div className='activity-details-section-content'>
                <h1 className='activity-details-section-title'>Trainingsdetails</h1>

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
                                {formatHeaderDate(activity.start_date_local)}
                            </p>
                        </div>
                    </div>

                    <h2 className='activity-details-activity-name'>{activity.name}</h2>

                    <div className='activity-details-stats'>
                        {statGroups.map((group, index) => (
                            <Fragment key={group.id}>
                                {index > 0 && <hr className='activity-details-stats-divider' />}
                                <div className='activity-details-stats-grid'>
                                    {group.stats.map(({ label, value }) => (
                                        <div key={label} className='activity-details-stat'>
                                            <span className='activity-details-stat-label'>{label}</span>
                                            <span className='activity-details-stat-value'>{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </Fragment>
                        ))}
                    </div>

                    {activity.strava_activity_id && (
                        <a
                            href={`https://www.strava.com/activities/${activity.strava_activity_id}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='activity-details-strava-link'
                        >
                            Auf Strava ansehen
                        </a>
                    )}
                </section>

                <section className='activity-details-map-card'>
                    <ActivityMap encodedPolyline={activity.summary_polyline} />
                </section>
                </div>
            </div>
        </div>
    )
}
