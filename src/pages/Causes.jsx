import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Users, Droplet, GraduationCap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { causesData as initialCauses } from '../data/causesData';

export default function Causes() {
    const [causes, setCauses] = useState(initialCauses);

    useEffect(() => {
        const fetchCauses = async () => {
            const { data, error } = await supabase
                .from('causes')
                .select('*')
                .order('id');
            
            if (error) {
                console.error('Error fetching causes:', error);
            } else if (data && data.length > 0) {
                setCauses(data);
            }
        };

        fetchCauses();
    }, []);
    return (
        <main>
            {/* Hero Section with Background */}
            <section style={{
                background: 'linear-gradient(rgba(44, 62, 80, 0.85), rgba(44, 62, 80, 0.85)), url(/causes-hero.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                padding: '10rem 0 8rem',
                position: 'relative',
                color: 'white'
            }}>
                <div className="container">
                    <motion.div
                        style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 style={{
                            fontSize: '4.5rem',
                            fontWeight: 800,
                            margin: '0 0 1.5rem 0',
                            lineHeight: 1.15,
                            letterSpacing: '-0.02em',
                            textShadow: '0 2px 20px rgba(0,0,0,0.3)'
                        }}>
                            Our Causes
                        </h1>
                        <p style={{
                            fontSize: '1.4rem',
                            lineHeight: 1.7,
                            maxWidth: '700px',
                            margin: '0 auto',
                            opacity: 0.95,
                            textShadow: '0 1px 10px rgba(0,0,0,0.2)'
                        }}>
                            Support the projects addressing real needs in Ghanaian communities
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Active Campaigns */}
            <section style={{ padding: '6rem 0', background: 'white' }}>
                <div className="container">
                    <motion.div
                        style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                            Current Fundraisers
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                            Browse active campaigns and choose where your donation will have the most impact
                        </p>
                    </motion.div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '2.5rem',
                        maxWidth: '1200px',
                        margin: '0 auto'
                    }}>
                        {causes.map((cause, i) => (
                            <motion.article
                                key={cause.id}
                                style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                                    border: '1px solid rgba(0, 0, 0, 0.06)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%'
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div style={{
                                    height: '220px',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}>
                                    <img
                                        src={cause.image_url || cause.img}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        alt={cause.badge}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        left: '1rem',
                                        background: 'white',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        color: cause.color
                                    }}>
                                        {cause.badge}
                                    </div>
                                </div>

                                <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                        {cause.title}
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6, flex: 1 }}>
                                        {cause.desc}
                                    </p>

                                    {/* Progress Bar */}
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '0.5rem',
                                            fontSize: '0.9rem'
                                        }}>
                                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                                {cause.raised}
                                            </span>
                                            <span style={{ color: 'var(--text-secondary)' }}>
                                                Goal: {cause.goal}
                                            </span>
                                        </div>
                                        <div style={{
                                            height: '8px',
                                            background: '#E5E7EB',
                                            borderRadius: '4px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: `${cause.percent}%`,
                                                height: '100%',
                                                background: `linear-gradient(90deg, ${cause.color}, ${cause.color}dd)`,
                                                borderRadius: '4px',
                                                transition: 'width 1s ease'
                                            }}></div>
                                        </div>
                                        <p style={{
                                            fontSize: '0.85rem',
                                            marginTop: '0.5rem',
                                            color: cause.color,
                                            fontWeight: 600
                                        }}>
                                            {cause.percent}% funded
                                        </p>
                                    </div>

                                    <Link
                                        to={`/causes/${cause.id}`}
                                        className="btn-primary"
                                        style={{
                                            display: 'block',
                                            textAlign: 'center',
                                            textDecoration: 'none',
                                            padding: '0.875rem'
                                        }}
                                    >
                                        Donate Now
                                    </Link>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            {/* How Your Donation Helps */}
            <section style={{ padding: '5rem 0', background: '#F9FAFB' }}>
                <div className="container">
                    <motion.div
                        style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem' }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                            How Your Donation Helps
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                            Every cedi goes directly to the cause. Here's the breakdown
                        </p>
                    </motion.div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '2rem',
                        maxWidth: '1000px',
                        margin: '0 auto'
                    }}>
                        {[
                            { amount: 'GH₵50', helps: 'Provides school supplies for 2 children', icon: '📚' },
                            { amount: 'GH₵200', helps: 'Feeds a family of 4 for one week', icon: '🍲' },
                            { amount: 'GH₵500', helps: 'Medical check-up and medication for 5 people', icon: '⚕️' },
                            { amount: 'GH₵1,000', helps: 'Drills and installs one water hand pump', icon: '💧' },
                            { amount: 'GH₵2,500', helps: 'Trains one woman with startup business kit', icon: '👩‍💼' },
                            { amount: 'GH₵5,000', helps: 'Builds one complete classroom with desks', icon: '🏫' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                style={{
                                    background: 'white',
                                    padding: '2rem',
                                    borderRadius: '12px',
                                    border: '1px solid #E5E7EB',
                                    textAlign: 'center',
                                    transition: 'all 0.3s ease'
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
                            >
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.75rem' }}>
                                    {item.amount}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                                    {item.helps}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Transparency Commitment */}
            <section style={{
                padding: '5rem 0',
                background: '#f9fafb'
            }}>
                <div className="container">
                    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.75rem', color: '#2C3E50' }}>
                            Financial Transparency
                        </h2>
                        <p style={{ fontSize: '0.95rem', color: '#6b7280', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                            We believe in complete transparency. Here's exactly how we allocate donations.
                        </p>

                        {/* Allocation Table */}
                        <div style={{
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            marginBottom: '2rem'
                        }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Category</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Description</th>
                                        <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Percentage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 500, color: '#2C3E50' }}>Programs & Services</td>
                                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>Direct community impact</td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontSize: '1.25rem', fontWeight: 700, color: '#E67E22' }}>85%</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 500, color: '#2C3E50' }}>Operations</td>
                                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>Staff and infrastructure</td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontSize: '1.25rem', fontWeight: 700, color: '#E67E22' }}>10%</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 500, color: '#2C3E50' }}>Fundraising</td>
                                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>Outreach and events</td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontSize: '1.25rem', fontWeight: 700, color: '#E67E22' }}>5%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Accountability List */}
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#2C3E50' }}>
                            Accountability
                        </h3>
                        <div style={{
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '1.5rem',
                            marginBottom: '2rem'
                        }}>
                            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <li style={{ fontSize: '0.9rem', color: '#374151', display: 'flex', alignItems: 'baseline' }}>
                                    <span style={{ marginRight: '0.5rem', color: '#E67E22' }}>•</span>
                                    <span><strong>Quarterly Reports:</strong> Published every 3 months on our website</span>
                                </li>
                                <li style={{ fontSize: '0.9rem', color: '#374151', display: 'flex', alignItems: 'baseline' }}>
                                    <span style={{ marginRight: '0.5rem', color: '#E67E22' }}>•</span>
                                    <span><strong>External Audit:</strong> Annual review by PwC Ghana</span>
                                </li>
                                <li style={{ fontSize: '0.9rem', color: '#374151', display: 'flex', alignItems: 'baseline' }}>
                                    <span style={{ marginRight: '0.5rem', color: '#E67E22' }}>•</span>
                                    <span><strong>Project Updates:</strong> Monthly emails with photos and progress</span>
                                </li>
                                <li style={{ fontSize: '0.9rem', color: '#374151', display: 'flex', alignItems: 'baseline' }}>
                                    <span style={{ marginRight: '0.5rem', color: '#E67E22' }}>•</span>
                                    <span><strong>Donation Tracking:</strong> Online portal to track your contribution</span>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Note */}
                        <div style={{
                            padding: '1rem',
                            background: '#fff',
                            border: '1px solid #e5e7eb',
                            borderLeft: '3px solid #E67E22',
                            borderRadius: '4px'
                        }}>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                                Questions about our finances? Contact us at <a href="mailto:finance@charizomai.org" style={{ color: '#E67E22', textDecoration: 'none' }}>finance@charizomai.org</a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent Success Stories */}
            <section style={{ padding: '5rem 0', background: 'white' }}>
                <div className="container">
                    <motion.div
                        style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem' }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                            Recent Success Stories
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                            Real impact from your donations
                        </p>
                    </motion.div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '2rem',
                        maxWidth: '1200px',
                        margin: '0 auto'
                    }}>
                        {[
                            {
                                title: 'Afia\'s Sewing Business',
                                location: 'Kumasi',
                                story: 'After 6 months of training, Afia now runs her own tailoring shop. She employs 2 apprentices and earns GH₵1,200/month.',
                                date: 'November 2024',
                                cause: 'Women Empowerment'
                            },
                            {
                                title: 'Tamale Primary School',
                                location: 'Northern Region',
                                story: '180 children now study in a proper classroom with desks and books. Attendance increased from 60% to 95% since completion.',
                                date: 'October 2024',
                                cause: 'Education'
                            },
                            {
                                title: 'Zuarungu Water Project',
                                location: 'Upper East',
                                story: '600 people now have clean water within 200m of their homes. Waterborne diseases dropped by 70% in 3 months.',
                                date: 'September 2024',
                                cause: 'Clean Water'
                            }
                        ].map((story, i) => (
                            <motion.div
                                key={i}
                                style={{
                                    background: 'linear-gradient(135deg, #FAFAFA 0%, #FFFFFF 100%)',
                                    padding: '2rem',
                                    borderRadius: '12px',
                                    border: '1px solid #E5E7EB',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.15 }}
                                viewport={{ once: true }}
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '4px',
                                    height: '100%',
                                    background: 'var(--primary-color)'
                                }} />
                                <div style={{
                                    fontSize: '0.85rem',
                                    color: 'var(--primary-color)',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    {story.cause}
                                </div>
                                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                    {story.title}
                                </h3>
                                <p style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '1rem' }}>
                                    📍 {story.location}
                                </p>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                                    {story.story}
                                </p>
                                <div style={{ fontSize: '0.85rem', color: '#9CA3AF', fontStyle: 'italic' }}>
                                    {story.date}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Stats */}
            <section style={{
                background: 'linear-gradient(135deg, var(--brand-navy) 0%, #1a252f 100%)',
                padding: '5rem 0',
                color: 'white'
            }}>
                <div className="container">
                    <motion.div
                        style={{ textAlign: 'center', marginBottom: '3rem' }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800 }}>
                            Impact by the Numbers
                        </h2>
                        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                            Results from our work across Ghana since 2020
                        </p>
                    </motion.div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '3rem',
                        maxWidth: '1100px',
                        margin: '0 auto'
                    }}>
                        {[
                            { value: "GH₵14M+", label: "Total Raised" },
                            { value: "3,500+", label: "People Helped" },
                            { value: "50+", label: "Active Projects" },
                            { value: "15+", label: "Communities" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                style={{ textAlign: 'center' }}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1, type: 'spring' }}
                                viewport={{ once: true }}
                            >
                                <h3 style={{
                                    fontSize: '3rem',
                                    fontWeight: 800,
                                    color: 'var(--primary-color)',
                                    marginBottom: '0.5rem',
                                    textShadow: '0 2px 10px rgba(230, 126, 34, 0.3)'
                                }}>
                                    {stat.value}
                                </h3>
                                <p style={{ fontSize: '1.1rem', opacity: 0.95, fontWeight: 500 }}>
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="pre-footer">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2>Your Support Makes a Real Difference</h2>
                        <p>
                            Donations of any size help us continue our work. Choose a cause above or make a general contribution to support all our programs.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center' }}>
                            <Link to="/donate" className="btn-primary" style={{ textDecoration: 'none' }}>
                                Make a Donation
                            </Link>
                            <Link to="/contact" className="btn-light" style={{ textDecoration: 'none' }}>
                                Contact Us
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
