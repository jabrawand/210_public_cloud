import React from 'react'
import { supabase } from '../supabase-client'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import '../css/Raceplan.css'

const EMPTY_RACE_FORM = {
    name: '',
    race_date: '',
    location: '',
    country_code: '',
    discipline: '',
    distance: '',
    event_url: '',
}

async function getRaces() {
    const { data, error } = await supabase
        .from('races')
        .select('*')
        .order('race_date', { ascending: true })

    if (error) {
        console.error(error)
        return []
    }
    return data
}

async function checkIsAdmin() {
    const { data, error } = await supabase.rpc('is_admin')

    if (error) {
        console.error(error)
        return false
    }
    return data === true
}

export default function Raceplan() {
    const [races, setRaces] = useState([])
    const [expandedRace, setExpandedRace] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(EMPTY_RACE_FORM)
    const [formError, setFormError] = useState('')
    const [saving, setSaving] = useState(false)
    const [isAdminUser, setIsAdminUser] = useState(false)

    const { isAuthenticated, session } = useAuth()

    const toggleRace = (id) => {
        setExpandedRace((current) => (current === id ? null : id))
    }

    useEffect(() => {
        getRaces().then(setRaces)
    }, [])

    useEffect(() => {
        if (!session) {
            setIsAdminUser(false)
            return
        }
        checkIsAdmin().then(setIsAdminUser)
    }, [session])

    const handleFormChange = (field) => (e) => {
        setForm((current) => ({ ...current, [field]: e.target.value }))
    }

    const handleCancelForm = () => {
        setShowForm(false)
        setForm(EMPTY_RACE_FORM)
        setFormError('')
    }

    const handleCreateRace = async (e) => {
        e.preventDefault()
        setFormError('')

        if (!session) {
            setFormError('Du bist nicht angemeldet. Bitte erneut einloggen.')
            return
        }

        setSaving(true)

        const { error: insertError } = await supabase.from('races').insert([
            {
                name: form.name.trim(),
                race_date: form.race_date,
                location: form.location.trim(),
                country_code: form.country_code.trim().toUpperCase(),
                discipline: form.discipline.trim(),
                distance: form.distance.trim(),
                event_url: form.event_url.trim(),
            },
        ])

        if (insertError) {
            if (insertError.message.includes('row-level security')) {
                setFormError(
                    'Speichern fehlgeschlagen: RLS-Policy Problem. Bitte Admin kontaktieren'
                )
            } else {
                setFormError(insertError.message)
            }
            setSaving(false)
            return
        }

        const updatedRaces = await getRaces()
        setRaces(updatedRaces)
        setForm(EMPTY_RACE_FORM)
        setShowForm(false)
        setSaving(false)
    }

    return (
        <div className='raceplan-container'>
            <div className='raceplan-section-content'>
                <h1 className='raceplan-section-title'>Raceplan</h1>

                {isAuthenticated && isAdminUser && !showForm && (
                    <button
                        type='button'
                        className='raceplan-section-add-race-btn'
                        onClick={() => setShowForm(true)}
                    >
                        Race hinzufügen
                    </button>
                )}

                {isAuthenticated && isAdminUser && showForm && (
                    <form className='raceplan-form' onSubmit={handleCreateRace}>
                        <h2 className='raceplan-form-title'>Neues Rennen</h2>
                        {formError && <p className='raceplan-form-error'>{formError}</p>}

                        <div className='raceplan-form-group'>
                            <label htmlFor='race-name' className='raceplan-form-label'>
                                Name <span className='raceplan-form-required'>*</span>
                            </label>
                            <input
                                type='text'
                                id='race-name'
                                value={form.name}
                                onChange={handleFormChange('name')}
                                required
                            />
                        </div>

                        <div className='raceplan-form-group'>
                            <label htmlFor='race-date' className='raceplan-form-label'>
                                Datum <span className='raceplan-form-required'>*</span>
                            </label>
                            <input
                                type='date'
                                id='race-date'
                                value={form.race_date}
                                onChange={handleFormChange('race_date')}
                                required
                            />
                        </div>

                        <div className='raceplan-form-group'>
                            <label htmlFor='race-location' className='raceplan-form-label'>
                                Ort <span className='raceplan-form-required'>*</span>
                            </label>
                            <input
                                type='text'
                                id='race-location'
                                value={form.location}
                                onChange={handleFormChange('location')}
                                required
                            />
                        </div>

                        <div className='raceplan-form-group'>
                            <label htmlFor='race-country' className='raceplan-form-label'>
                                Ländercode <span className='raceplan-form-required'>*</span>
                            </label>
                            <input
                                type='text'
                                id='race-country'
                                value={form.country_code}
                                onChange={handleFormChange('country_code')}
                                required
                                maxLength={3}
                                placeholder='CH'
                            />
                        </div>

                        <div className='raceplan-form-group'>
                            <label htmlFor='race-discipline' className='raceplan-form-label'>
                                Disziplin <span className='raceplan-form-required'>*</span>
                            </label>
                            <input
                                type='text'
                                id='race-discipline'
                                value={form.discipline}
                                onChange={handleFormChange('discipline')}
                                required
                                placeholder='Marathon, Olympic, 70.3 …'
                            />
                        </div>

                        <div className='raceplan-form-group'>
                            <label htmlFor='race-distance' className='raceplan-form-label'>
                                Distanz <span className='raceplan-form-required'>*</span>
                            </label>
                            <input
                                type='text'
                                id='race-distance'
                                value={form.distance}
                                onChange={handleFormChange('distance')}
                                required
                                placeholder='42.195 km, 21.097 km, 70.3 km …'
                                
                            />
                        </div>

                        <div className='raceplan-form-group'>
                            <label htmlFor='race-url' className='raceplan-form-label'>
                                Event-Link <span className='raceplan-form-required'>*</span>
                            </label>
                            <input
                                type='url'
                                id='race-url'
                                value={form.event_url}
                                onChange={handleFormChange('event_url')}
                                required
                                placeholder='https://…'
                            />
                        </div>

                        <div className='raceplan-form-actions'>
                            <button
                                type='button'
                                className='raceplan-form-button raceplan-form-button--secondary'
                                onClick={handleCancelForm}
                                disabled={saving}
                            >
                                Abbrechen
                            </button>
                            <button
                                type='submit'
                                className='raceplan-form-button'
                                disabled={saving}
                            >
                                {saving ? 'Wird gespeichert…' : 'Speichern'}
                            </button>
                        </div>
                    </form>
                )}

                <ul className='raceplan-section-grid'>
                    {races.map((race) => {
                        const isExpanded = expandedRace === race.id
                        return (
                            <li
                                key={race.id}
                                className={`raceplan-section-card${isExpanded ? ' raceplan-section-card--expanded' : ''}`}
                                onClick={() => toggleRace(race.id)}
                            >
                                <div className='raceplan-section-card-header'>
                                    <h3>
                                        {race.name}
                                        {isExpanded ? ' ▲' : ' ▼'}
                                    </h3>
                                </div>
                                {isExpanded && (
                                    <div className='raceplan-section-card-details'>
                                        <p>{race.race_date}</p>
                                        <p>
                                            {race.location} ({race.country_code})
                                        </p>
                                        <p>{race.discipline}</p>
                                        <p>{race.distance}</p>
                                        <a
                                            href={race.event_url}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {race.event_url}
                                        </a>
                                    </div>
                                )}
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}
