import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase-client'
import { useAuth } from '../context/AuthContext'
import '../css/Profile.css'

async function getProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single()

    if (error) {
        console.error(error)
        return null
    }
    return data
}

export default function Profile() {
    const { session, refreshProfile } = useAuth()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        if (!session?.user?.id) return
        getProfile(session.user.id).then((profile) => {
            setUsername(profile?.username ?? '')
            setLoading(false)
        })
    }, [session])

    const handleSaveUsername = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        const trimmed = username.trim()
        if (trimmed.length < 3) {
            setError('Benutzername muss mindestens 3 Zeichen haben.')
            return
        }

        setSaving(true)

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ username: trimmed })
            .eq('id', session.user.id)

        if (updateError) {
            setError(updateError.message)
            setSaving(false)
            return
        }

        setUsername(trimmed)
        setSuccess('Benutzername wurde gespeichert.')
        await refreshProfile()
        setSaving(false)
    }

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            'Möchtest du dein Konto wirklich dauerhaft löschen? Diese Aktion kann nicht rückgängig gemacht werden.'
        )
        if (!confirmed) return

        setDeleting(true)
        setError('')
        setSuccess('')

        const { error: deleteError } = await supabase.rpc('delete_own_account')

        if (deleteError) {
            setError(deleteError.message)
            setDeleting(false)
            return
        }

        await supabase.auth.signOut()
        navigate('/', { replace: true })
    }

    if (loading) {
        return (
            <div className='profile-container'>
                <p className='profile-status'>Profil wird geladen…</p>
            </div>
        )
    }

    return (
        <div className='profile-container'>
            <h1 className='profile-title'>Mein Profil</h1>

            <form className='profile-form' onSubmit={handleSaveUsername}>
                {error && <p className='profile-error'>{error}</p>}
                {success && <p className='profile-success'>{success}</p>}

                <div className='profile-form-group'>
                    <label htmlFor='profile-email' className='profile-form-label'>
                        E-Mail
                    </label>
                    <input
                        type='email'
                        id='profile-email'
                        value={session.user.email}
                        disabled
                        className='profile-form-input--disabled'
                    />
                </div>

                <div className='profile-form-group'>
                    <label htmlFor='profile-username' className='profile-form-label'>
                        Benutzername
                    </label>
                    <input
                        type='text'
                        id='profile-username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        minLength={3}
                    />
                </div>

                <button type='submit' disabled={saving} className='profile-form-button'>
                    {saving ? 'Wird gespeichert…' : 'Speichern'}
                </button>
            </form>

            <section className='profile-danger-zone'>
                <h2 className='profile-danger-title'>Konto löschen</h2>
                <p className='profile-danger-text'>
                    Dein Konto und alle zugehörigen Profildaten werden dauerhaft entfernt.
                </p>
                <button
                    type='button'
                    className='profile-delete-button'
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                >
                    {deleting ? 'Wird gelöscht…' : 'Konto dauerhaft löschen'}
                </button>
            </section>
        </div>
    )
}
