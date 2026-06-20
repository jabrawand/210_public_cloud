import { Outlet, Link } from 'react-router-dom'
import { supabase } from '../supabase-client'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo_jan.png'
import '../css/Layout.css'

export default function Layout() {
    const { session } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

    return (
        <div className="layout-container">
            <header className="layout-header">
                <img src={logo} alt="Logo" onClick={() => navigate('/')} className='layout-header-logo' />
                <nav className='layout-header-nav'>
                   <Link to="/">Home</Link>
                   <Link to="/about">About</Link>
                   <Link to="/raceplan">Raceplan</Link>
                   <Link to="/activities">Activities</Link>
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
            <main className="layout-main">
                <Outlet />
            </main>
            <div className="footer-area">
                <svg className="footer-wave-svg" viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
                    <path
                        className="wave-fill"
                        d="M0,64 C240,128 480,0 720,64 C960,128 1200,0 1440,64 L1440,120 L0,120 Z"
                    />
                    <path
                        className="wave-path"
                        fill="none"
                        stroke="#F4A261"
                        strokeWidth="2"
                        d="M0,64 C240,128 480,0 720,64 C960,128 1200,0 1440,64"
                    />
                </svg>
                <footer>
                    <p>&copy; 2026 JAN BRAWAND • SWITZERLAND</p>
                    <p className="footer-credit">
                        Crafted with passion by{' '}
                        <a href="https://www.jasminbrawand.ch" target="_blank" rel="noopener noreferrer">
                            Jasmin Brawand
                        </a>
                    </p>
                </footer>
            </div>
        </div>
    )
}