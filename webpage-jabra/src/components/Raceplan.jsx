import { useState, useEffect } from 'react'
import { supabase } from '../supabase-client'
import { useAuth } from '../context/AuthContext'
import { buildRacePayload, raceToForm } from '../utils/raceplan'
import { formatDate } from '../utils/dateFormat'
import '../css/Raceplan.css'

const EMPTY_RACE_FORM = {
    name: '',
    race_date: '',
    location: '',
    country_code: '',
    discipline: '',
    distance: '',
    event_url: '',
    result: '',
}

async function getRaces() {
    const { data, error } = await supabase
        .from('races')
        .select('*')
        .order('race_date', { ascending: true })

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

export default function Raceplan() {
    const [races, setRaces] = useState([])
    const [expandedRace, setExpandedRace] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [editingRaceId, setEditingRaceId] = useState(null)
    const [form, setForm] = useState(EMPTY_RACE_FORM)
    const [formError, setFormError] = useState('')
    const [saving, setSaving] = useState(false)
    const [deletingRaceId, setDeletingRaceId] = useState(null)
    const [isAdminUser, setIsAdminUser] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState(null)
    const [deleteError, setDeleteError] = useState(null)

    const { isAuthenticated, session } = useAuth()

    const toggleRace = (id) => {
        setExpandedRace((current) => (current === id ? null : id))
    }

    const handleRaceHeaderKeyDown = (id) => (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            toggleRace(id)
        }
    }

    useEffect(() => {
        setLoading(true)
        setLoadError(null)
        getRaces().then(({ data, error }) => {
            setRaces(data)
            setLoadError(error?.message ?? null)
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        if (!session) {
            setIsAdminUser(false)
            return
        }
        checkIsAdmin().then(setIsAdminUser)
    }, [session])

    const handleFormChange = (field) => (e) => {
        let { value } = e.target
        if (field === 'country_code') {
            value = value.toUpperCase().replace(/[^A-Z]/g, '')
        }
        setForm((current) => ({ ...current, [field]: value }))
    }

    const handleCancelForm = () => {
        setShowForm(false)
        setEditingRaceId(null)
        setForm(EMPTY_RACE_FORM)
        setFormError('')
    }

    const handleStartCreate = () => {
        setEditingRaceId(null)
        setForm(EMPTY_RACE_FORM)
        setFormError('')
        setShowForm(true)
    }

    const handleStartEdit = (race) => {
        setEditingRaceId(race.id)
        setForm(raceToForm(race))
        setFormError('')
        setShowForm(true)
        setExpandedRace(race.id)
    }

    const handleSaveRace = async (e) => {
        e.preventDefault()
        setFormError('')

        if (!session) {
            setFormError('Du bist nicht angemeldet. Bitte erneut einloggen.')
            return
        }

        setSaving(true)

        const payload = buildRacePayload(form)
        const { error: saveError } = editingRaceId
            ? await supabase.from('races').update(payload).eq('id', editingRaceId)
            : await supabase.from('races').insert([payload])

        if (saveError) {
            if (saveError.message.includes('row-level security')) {
                setFormError(
                    'Speichern fehlgeschlagen: RLS-Policy Problem. Bitte Admin kontaktieren'
                )
            } else {
                setFormError(saveError.message)
            }
            setSaving(false)
            return
        }

        const { data: updatedRaces, error: reloadError } = await getRaces()
        setRaces(updatedRaces)
        if (reloadError) {
            setLoadError(reloadError.message)
        }
        setForm(EMPTY_RACE_FORM)
        setEditingRaceId(null)
        setShowForm(false)
        setSaving(false)
    }

    const handleDeleteRace = async (race) => {
        const confirmed = window.confirm(
            `"${race.name}" wirklich dauerhaft löschen? Diese Aktion kann nicht rückgängig gemacht werden.`
        )
        if (!confirmed) return

        if (!session) return

        setDeletingRaceId(race.id)
        setDeleteError(null)

        const { error: deleteErrorResult } = await supabase.from('races').delete().eq('id', race.id)

        if (deleteErrorResult) {
            console.error(deleteErrorResult)
            setDeleteError(
                deleteErrorResult.message.includes('row-level security')
                    ? 'Löschen fehlgeschlagen: Keine Berechtigung.'
                    : deleteErrorResult.message
            )
            setDeletingRaceId(null)
            return
        }

        if (editingRaceId === race.id) {
            handleCancelForm()
        }
        if (expandedRace === race.id) {
            setExpandedRace(null)
        }

        const { data: updatedRaces, error: reloadError } = await getRaces()
        setRaces(updatedRaces)
        if (reloadError) {
            setLoadError(reloadError.message)
        }
        setDeletingRaceId(null)
    }

    return (
        <div className='raceplan-container'>
            <div className='raceplan-section-content'>
                <h1 className='raceplan-section-title'>Raceplan</h1>

                {isAuthenticated && isAdminUser && !showForm && (
                    <button
                        type='button'
                        className='raceplan-section-add-race-btn'
                        onClick={handleStartCreate}
                    >
                        Race hinzufügen
                    </button>
                )}

                {isAuthenticated && isAdminUser && showForm && (
                    <form className='raceplan-form' onSubmit={handleSaveRace}>
                        <h2 className='raceplan-form-title'>
                            {editingRaceId ? 'Rennen bearbeiten' : 'Neues Rennen'}
                        </h2>
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
                                maxLength={2}
                                pattern='[A-Z]{2}'
                                title='Zwei Grossbuchstaben, z. B. CH'
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
                                Event-Link
                            </label>
                            <input
                                type='url'
                                id='race-url'
                                value={form.event_url}
                                onChange={handleFormChange('event_url')}
                                placeholder='https://…'
                            />
                        </div>

                        <div className='raceplan-form-group'>
                            <label htmlFor='race-result' className='raceplan-form-label'>
                                Resultat
                            </label>
                            <input
                                type='text'
                                id='race-result'
                                value={form.result}
                                onChange={handleFormChange('result')}
                                placeholder='z. B. 3:42:15 h, Platz 12'
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
                                {saving ? 'Wird gespeichert…' : editingRaceId ? 'Aktualisieren' : 'Speichern'}
                            </button>
                        </div>
                    </form>
                )}

                {loading && (
                    <p className='raceplan-section-status'>Rennen werden geladen…</p>
                )}
                {!loading && loadError && (
                    <p className='raceplan-section-status raceplan-section-status--error'>
                        Rennen konnten nicht geladen werden: {loadError}
                    </p>
                )}
                {!loading && deleteError && (
                    <p className='raceplan-section-status raceplan-section-status--error'>
                        {deleteError}
                    </p>
                )}
                {!loading && !loadError && races.length === 0 && (
                    <p className='raceplan-section-status'>Keine Rennen gefunden.</p>
                )}

                <ul className='raceplan-section-grid'>
                    {races.map((race) => {
                        const isExpanded = expandedRace === race.id
                        const isDeleting = deletingRaceId === race.id
                        return (
                            <li
                                key={race.id}
                                className={`raceplan-section-card${isExpanded ? ' raceplan-section-card--expanded' : ''}`}
                            >
                                <div
                                    className='raceplan-section-card-header'
                                    role='button'
                                    tabIndex={0}
                                    onClick={() => toggleRace(race.id)}
                                    onKeyDown={handleRaceHeaderKeyDown(race.id)}
                                    aria-expanded={isExpanded}
                                >
                                    <h3>
                                        {race.name}
                                        {isExpanded ? ' ▲' : ' ▼'}
                                    </h3>
                                </div>
                                {isExpanded && (
                                    <div className='raceplan-section-card-details'>
                                        <p>Datum: {formatDate(race.race_date)}</p>
                                        <p>
                                            Ort: {race.location} ({race.country_code})
                                        </p>
                                        <p>Disziplin: {race.discipline}</p>
                                        <p>Distanz: {race.distance}</p>
                                        <p>
                                            Event-Link:{' '}
                                            {race.event_url ? (
                                                <a
                                                    href={race.event_url}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                >
                                                    {race.event_url}
                                                </a>
                                            ) : (
                                                'noch nicht verfügbar'
                                            )}
                                        </p>
                                        <p>Resultat: {race.result || 'noch ausstehend'}</p>
                                        {isAdminUser && (
                                            <div className='raceplan-section-card-actions'>
                                                <button
                                                    type='button'
                                                    className='raceplan-section-edit-race-btn'
                                                    onClick={() => handleStartEdit(race)}
                                                    disabled={isDeleting}
                                                >
                                                    Bearbeiten
                                                </button>
                                                <button
                                                    type='button'
                                                    className='raceplan-section-delete-race-btn'
                                                    onClick={() => handleDeleteRace(race)}
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting ? 'Wird gelöscht…' : 'Löschen'}
                                                </button>
                                            </div>
                                        )}
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
