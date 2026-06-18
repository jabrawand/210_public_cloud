import React from 'react'
import { useState, useEffect } from 'react'
import { supabase } from '../supabase-client'
import { Link } from 'react-router-dom'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                window.location.href = '/'
            }
        })
    }, [])

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) {
            setError(error.message)
        } else {
            setLoading(false)
        }
    }
    return (
        <div className='login-container'>
            <h1 className='login-title'>Login</h1>
            <form className='login-form' onSubmit={handleLogin}>
                {error && <p className='login-error'>{error}</p>}
                <div className='login-form-group'>
                    <label htmlFor='email' className='login-form-label'>Email</label>
                    <input type='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='login-form-group'>
                    <label htmlFor='password' className='login-form-label'>Password</label>
                    <input type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type='submit' disabled={loading} className='login-form-button'>{loading ? 'Loading...' : 'Login'}</button>
                <p className='login-form-text'>Noch kein Konto? <Link to='/signup' className='login-form-link'>Registrieren</Link></p>
            </form>
        </div>
    )
}