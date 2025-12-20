import { Link, useLocation } from 'react-router-dom';
import { User, Heart, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../supabase';
import DonationModal from './DonationModal';

export default function Navbar() {
    const location = useLocation();
    const isActive = (path) => (location.pathname === path ? 'active' : '');
    const [menuOpen, setMenuOpen] = useState(false);
    const [session, setSession] = useState(null);
    const [showDonateModal, setShowDonateModal] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <header className="site-header">
            <nav className="nav-container">
                <Link to="/" className="logo-link">
                    <img src="/logo.jpg" alt="Charizomai Foundation Logo" className="logo-img" />
                    <h1 className="logo-text">Charizomai Foundation</h1>
                </Link>

                <button
                    className="mobile-menu-btn"
                    onClick={() => setMenuOpen(true)}
                    aria-label="Open navigation menu"
                >
                    <Menu size={24} />
                </button>

                <ul className="nav-links desktop-only">
                    <li><Link to="/" className={isActive('/')}>Home</Link></li>
                    <li><Link to="/about" className={isActive('/about')}>About Us</Link></li>
                    <li><Link to="/causes" className={isActive('/causes')}>Our Causes</Link></li>
                    <li><Link to="/gallery" className={isActive('/gallery')}>Gallery</Link></li>
                    <li><Link to="/events" className={isActive('/events')}>Events</Link></li>
                    <li><Link to="/volunteer" className={isActive('/volunteer')}>Volunteer</Link></li>
                    <li><Link to="/contact" className={isActive('/contact')}>Contact</Link></li>
                </ul>

                <div className="auth-links desktop-only">
                    {session ? (
                        <Link to="/admin" className="nav-login-btn">
                            <User size={18} />
                            <span>Dashboard</span>
                        </Link>
                    ) : (
                        <Link to="/login" className="nav-login-btn">
                            <User size={18} />
                            <span>Login</span>
                        </Link>
                    )}
                    <button 
                        onClick={() => setShowDonateModal(true)} 
                        className="nav-donate-btn"
                        style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                        <span>Donate</span>
                    </button>
                </div>
            </nav>

            {menuOpen && createPortal(
                <>
                    <div className="nav-overlay active" onClick={() => setMenuOpen(false)} />
                    <div className="nav-panel open">
                        <div className="nav-panel-header">
                            <span className="nav-panel-title">Menu</span>
                            <button className="nav-close-btn" onClick={() => setMenuOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <ul className="nav-links mobile">
                            <li><Link to="/" className={isActive('/')} onClick={() => setMenuOpen(false)}>Home</Link></li>
                            <li><Link to="/about" className={isActive('/about')} onClick={() => setMenuOpen(false)}>About Us</Link></li>
                            <li><Link to="/causes" className={isActive('/causes')} onClick={() => setMenuOpen(false)}>Our Causes</Link></li>
                            <li><Link to="/gallery" className={isActive('/gallery')} onClick={() => setMenuOpen(false)}>Gallery</Link></li>
                            <li><Link to="/events" className={isActive('/events')} onClick={() => setMenuOpen(false)}>Events</Link></li>
                            <li><Link to="/volunteer" className={isActive('/volunteer')} onClick={() => setMenuOpen(false)}>Volunteer</Link></li>
                            <li><Link to="/contact" className={isActive('/contact')} onClick={() => setMenuOpen(false)}>Contact</Link></li>
                        </ul>

                        <div className="auth-links mobile">
                            {session ? (
                                <Link to="/admin" className="nav-login-btn" onClick={() => setMenuOpen(false)}>
                                    <User size={18} />
                                    <span>Dashboard</span>
                                </Link>
                            ) : (
                                <Link to="/login" className="nav-login-btn" onClick={() => setMenuOpen(false)}>
                                    <User size={18} />
                                    <span>Login</span>
                                </Link>
                            )}
                            <button 
                                onClick={() => {
                                    setMenuOpen(false);
                                    setShowDonateModal(true);
                                }} 
                                className="nav-donate-btn"
                                style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}
                            >
                                <span>Donate</span>
                            </button>
                        </div>
                    </div>
                </>,
                document.body
            )}

            <DonationModal isOpen={showDonateModal} onClose={() => setShowDonateModal(false)} />
        </header>
    );
}
