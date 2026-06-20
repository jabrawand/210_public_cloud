import React from 'react'
import { useState } from 'react'
import { supabase } from '../supabase-client'
import { Link } from 'react-router-dom'
import '../css/Signup.css'

export default function Signup() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSignup = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username },
            },
        })

        if (error) {
            setError(error.message)
        } else {
            setSuccess('Konto erstellt. Bitte bestätige deine E-Mail, falls erforderlich.')
        }

        setLoading(false)
    }

    return (
        <div className='signup-container'>
            <h1 className='signup-title'>Registrieren</h1>
            <form className='signup-form' onSubmit={handleSignup}>
                {error && <p className='signup-error'>{error}</p>}
                {success && <p className='signup-success'>{success}</p>}
                <div className='signup-form-group'>
                    <label htmlFor='username' className='signup-form-label'>Benutzername</label>
                    <input
                        type='text'
                        id='username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        minLength={3}
                    />
                </div>
                <div className='signup-form-group'>
                    <label htmlFor='email' className='signup-form-label'>E-Mail</label>
                    <input
                        type='email'
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className='signup-form-group'>
                    <label htmlFor='password' className='signup-form-label'>Passwort</label>
                    <input
                        type='password'
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>
                <button type='submit' disabled={loading} className='signup-form-button'>
                    {loading ? 'Wird erstellt…' : 'Registrieren'}
                </button>
                <p className='signup-form-text'>
                    Bereits ein Konto? <Link to='/login' className='signup-form-link'>Anmelden</Link>
                </p>
            </form>
        </div>
    )
}
