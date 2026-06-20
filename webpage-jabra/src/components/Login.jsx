import React from 'react'
import { useState, useEffect } from 'react'
import { supabase } from '../supabase-client'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import '../css/Login.css'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const redirectTo = location.state?.from?.pathname || '/'

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN') {
                navigate(redirectTo, { replace: true })
            }
        })

        return () => subscription.unsubscribe()
    }, [navigate, redirectTo])

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) {
            setError(error.message)
        }
        setLoading(false)
    }
    return (
        <div className='login-container'>
            <h1 className='login-title'>Anmelden</h1>
            <form className='login-form' onSubmit={handleLogin}>
                {error && <p className='login-error'>{error}</p>}
                <div className='login-form-group'>
                    <label htmlFor='email' className='login-form-label'>E-Mail</label>
                    <input type='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className='login-form-group'>
                    <label htmlFor='password' className='login-form-label'>Passwort</label>
                    <input type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type='submit' disabled={loading} className='login-form-button'>{loading ? 'Wird geladen…' : 'Anmelden'}</button>
                <p className='login-form-text'>Noch kein Konto? <Link to='/signup' className='login-form-link'>Registrieren</Link></p>
            </form>
        </div>
    )
}