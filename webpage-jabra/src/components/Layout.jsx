import { Outlet } from 'react-router-dom'
import { supabase } from '../supabase-client'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Login from './Login'

export default function Layout() {
    const [session, setSession] = useState(null)
    const navigate = useNavigate()

    const fetchSession = async () => {
        const currentSession = await supabase.auth.getSession();
        console.log(currentSession);
        setSession(currentSession.data.session);
    };
    
    useEffect(() => {
        fetchSession();
    }, []);

    /** Handle Logout */
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    return (
        <>
        {session ? (
            <div>
                <button onClick={handleLogout}>Logout</button>
                <p>Wilkommen, {session.user.email}</p>
            </div>
        ) : (
            <button onClick={() => navigate('/login')}>Login</button>
        )}
        <div className='layout'>
            <header className='layout-header'>

            </header>
        </div>
        <main>
            <Outlet />
        </main>
        <footer className='layout-footer'>
            <p>© 2026 Jan Brawand</p>
        </footer>
        </>
    )
}