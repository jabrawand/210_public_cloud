import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabase-client'

const AuthContext = createContext(null)

async function loadUsername(userId) {
    if (!userId) return ''

    const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single()

    if (error) {
        console.error(error)
        return ''
    }

    return data?.username ?? ''
}

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null)
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(true)

    const refreshProfile = async () => {
        const name = await loadUsername(session?.user?.id)
        setUsername(name)
    }

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
            setSession(currentSession)
            setUsername(await loadUsername(currentSession?.user?.id))
            setLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
            setSession(currentSession)
            setUsername(await loadUsername(currentSession?.user?.id))
        })

        return () => subscription.unsubscribe()
    }, [])

    return (
        <AuthContext.Provider value={{ session, loading, isAuthenticated: !!session, username, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
