import { Outlet, Link } from 'react-router-dom'
import { supabase } from '../supabase-client'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo_jan.png'

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
        <div className='layout-container'>
            <header className='layout-header'>
                <img src={logo} alt="Logo" onClick={() => navigate('/')} />
                <nav className='layout-header-nav'>
                   <Link to="/">Home</Link>
                   <Link to="/about">About</Link>
                   <Link to="/raceplan">Raceplan</Link>
                   {session ? (
                    <button onClick={handleLogout}>Logout</button>
                   ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </>
                   )}
                </nav>
            </header>
        </div>
        <main className='layout-main'>
            <Outlet />
        </main>
        <footer className='layout-footer'>
            <p>© 2026 Jan Brawand</p>
        </footer>
        </>
    )
}