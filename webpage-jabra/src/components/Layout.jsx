import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { supabase } from '../supabase-client'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'
import '../css/Layout.css'

export default function Layout() {
    const { session, username } = useAuth()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const closeMenu = () => setMenuOpen(false)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        closeMenu()
    }

    return (
        <div className="layout-container">
            <header className="layout-header">
                <img src={logo} alt="Logo" onClick={() => { navigate('/'); closeMenu() }} className='layout-header-logo' />
                <button
                    type="button"
                    className="layout-header-menu-btn"
                    aria-label={menuOpen ? 'Menü schliessen' : 'Menü öffnen'}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    <span className="layout-header-menu-icon" aria-hidden="true" />
                </button>
                <nav className={`layout-header-nav${menuOpen ? ' layout-header-nav--open' : ''}`}>
                   <Link to="/" onClick={closeMenu}>Home</Link>
                   <Link to="/about" onClick={closeMenu}>About</Link>
                   <Link to="/raceplan" onClick={closeMenu}>Raceplan</Link>
                   <Link to="/activities" onClick={closeMenu}>Activities</Link>
                   {session ? (
                    <>
                        {username && (
                            <Link to="/profile" className="layout-header-username" onClick={closeMenu}>{username}</Link>
                        )}
                        <button type="button" onClick={handleLogout} className="layout-header-logout-button">Logout</button>
                    </>
                   ) : (
                    <>
                        <Link to="/login" onClick={closeMenu}>Login</Link>
                        <Link to="/signup" onClick={closeMenu}>Signup</Link>
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