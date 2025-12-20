import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand Column */}
                    <div className="footer-col brand-col">
                        <Link to="/" className="footer-logo">
                            <img src="/logo.png" alt="Charizomai" className="footer-logo-img" />
                            <span>Charizomai</span>
                        </Link>
                        <p className="footer-desc">
                            Empowering communities and transforming lives through dedicated service and compassionate action. Join us in making a difference today.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link"><Facebook size={20} /></a>
                            <a href="#" className="social-link"><Twitter size={20} /></a>
                            <a href="#" className="social-link"><Instagram size={20} /></a>
                            <a href="#" className="social-link"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-col">
                        <h3>Quick Links</h3>
                        <ul className="footer-links-list">
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/causes">Our Causes</Link></li>
                            <li><Link to="/events">Events</Link></li>
                            <li><Link to="/gallery">Gallery</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-col">
                        <h3>Contact Us</h3>
                        <ul className="contact-list">
                            <li>
                                <MapPin size={18} className="contact-icon" />
                                <span>Accra, Ghana<br />Box KA 9543, Airport</span>
                            </li>
                            <li>
                                <Phone size={18} className="contact-icon" />
                                <span>+233 20 123 4567</span>
                            </li>
                            <li>
                                <Mail size={18} className="contact-icon" />
                                <span>info@charizomai.org</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="footer-col">
                        <h3>Newsletter</h3>
                        <p className="newsletter-text">Subscribe to get the latest updates and news.</p>
                        <form className="footer-newsletter-form" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Your email address" />
                            <button type="submit">Subscribe</button>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {year} Charizomai Foundation. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <Link to="#">Privacy Policy</Link>
                        <Link to="#">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
