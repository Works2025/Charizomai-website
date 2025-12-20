import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sun, Zap, Clock, HeartHandshake } from 'lucide-react';

export default function Hero() {
    // Curated circles matching the reference layout style (Left Arc, then Right Arc)
    const circles = [
        { className: "circle-1", src: "/charity-food-distribution.jpg", label: "Food Aid", progress: 75 }, // Top Left
        { className: "circle-2", src: "/charity-supplies-distribution.jpg", label: "Supplies", progress: 90 },    // Mid Left
        { className: "circle-3", src: "/charity-food-items.jpg", label: "Donations", progress: 60 },  // Bottom Left
        { className: "circle-4", src: "/charity-children-books.jpg", label: "Education", progress: 85 },  // Top Right
        { className: "circle-5", src: "/charity-group-photo.jpg", label: "Community", progress: 40 },     // Mid Right
        { className: "circle-6", src: "/charity-food-distribution.jpg", label: "Outreach", progress: 25 },   // Bottom Right
    ];

    return (
        <section className="hero">
            <div className="hero-wrapper">
                {/* Orbital Circles */}
                {circles.map((item, i) => (
                    <motion.div
                        key={i}
                        className={`floating-circle ${item.className}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                    >
                        <div className="circle-progress-wrapper" style={{
                            background: `conic-gradient(var(--brand-teal) ${item.progress}%, #E5E7EB 0)`
                        }}>
                            <div className="circle-inner">
                                <img src={item.src} alt={item.label} />
                            </div>
                        </div>
                        <span className="circle-label">{item.label}</span>
                    </motion.div>
                ))}

                {/* Central Content */}
                <motion.div
                    className="hero-content"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                     {/* Mobile Only Hero Image */}
                     <div className="mobile-hero-image">
                        <img src="/charity-group-photo.jpg" alt="Charizomai Community" />
                     </div>

                    <div className="hero-icon-wrapper" style={{ marginBottom: '1rem' }}>
                        <Sun size={40} color="#02a95c" fill="#dcfce7" strokeWidth={1.5} />
                    </div>
                    <span className="hero-top-tag">#1 fundraising platform in Ghana</span>
                    <h1 className="hero-headline">
                        Empowering<br />Lives,<br />Together
                    </h1>
                    <div className="hero-buttons">
                        <Link to="/donate" className="btn-hero-cta">Donate to Charizomai</Link>
                    </div>
                </motion.div>

                {/* Bottom Text Grid */}
                <div className="hero-bottom-text-grid">
                    <div className="stats-headline">
                        <h2>More than <strong>50 million GHS is raised</strong><br />every week on Charizomai.*</h2>
                    </div>
                    <div className="stats-description">
                        <p>Make a difference in minutes. With secure payments and transparent tracking, it's easier than ever to support verified causes and change lives across Ghana.</p>
                    </div>
                </div>
            </div>

            {/* Yellow Features Banner */}
            <div className="hero-features-banner">
                <div className="feature-item">
                    <Zap size={20} strokeWidth={2} />
                    <span>No fee to start Donating</span>
                </div>
                <div className="feature-separator"></div>
                <div className="feature-item">
                    <Clock size={20} strokeWidth={2} />
                    <span>1 donation made every second</span>
                </div>
                <div className="feature-separator"></div>
                <div className="feature-item">
                    <HeartHandshake size={20} strokeWidth={2} />
                    <span>Trusted by 10k+ donors daily</span>
                </div>
            </div>
        </section>
    );
}
