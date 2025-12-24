import { motion } from 'framer-motion';
import { Heart, Share2, TrendingUp, ShieldCheck, User, Clock, ArrowLeft, MapPin, CheckCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { causesData } from '../data/causesData';

export default function CauseDetails() {
    const { id } = useParams();
    const [cause, setCause] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCause = async () => {
            try {
                const { data, error } = await supabase
                    .from('causes')
                    .select('*')
                    .eq('id', id)
                    .single();
                
                if (error) throw error;

                if (data) {
                    // Fetch recent donations
                    const { data: donations } = await supabase
                        .from('donations')
                        .select('*')
                        .eq('cause_id', id)
                        .order('created_at', { ascending: false })
                        .limit(5);

                    setCause({
                        ...data,
                        recentDonations: donations ? donations.map(d => ({
                            name: d.donor_name,
                            amount: `GH₵ ${d.amount}`,
                            time: new Date(d.created_at).toLocaleDateString(),
                            comment: ''
                        })) : []
                    });
                }
            } catch (error) {
                console.error('Error fetching cause:', error);
                // Fallback to mock data
                const mockCause = causesData.find(c => c.id === parseInt(id));
                if (mockCause) setCause(mockCause);
            } finally {
                setLoading(false);
            }
        };

        fetchCause();
    }, [id]);

    if (loading) {
        return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
    }

    if (!cause) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <h2>Cause not found</h2>
                <Link to="/causes" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Back to Causes</Link>
            </div>
        );
    }

    return (
        <main style={{ background: '#ffffff', minHeight: '100vh', paddingBottom: '5rem', color: '#1a1a1a' }}>

            {/* Simple Header Area */}
            <div className="container" style={{ maxWidth: '1100px', paddingTop: '2rem', paddingBottom: '1rem' }}>
                <Link to="/causes" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', marginBottom: '2rem' }}>
                    <ArrowLeft size={18} /> Back to all causes
                </Link>

                <h1 style={{
                    fontSize: '3rem',
                    fontWeight: 800,
                    color: '#111',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    marginBottom: '1.5rem',
                    maxWidth: '900px'
                }}>
                    {cause.title}
                </h1>
            </div>

            <div className="container" style={{ maxWidth: '1100px' }}>
                <div className="cause-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '4rem', alignItems: 'start' }}>

                    {/* Left Column: Story & Visuals */}
                    <div className="cause-content">
                        {/* Hero Image - Clean, no shadow, just content */}
                        <div style={{
                            borderRadius: '12px',
                            overflow: 'hidden',
                            marginBottom: '2rem',
                            aspectRatio: '16/10',
                            background: '#f3f4f6'
                        }}>
                            <img
                                src={cause.img}
                                alt={cause.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        {/* Organizer - Minimalist */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '2.5rem',
                            paddingBottom: '2.5rem',
                            borderBottom: '1px solid #eee'
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: '#f3f4f6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#666'
                            }}>
                                <User size={24} />
                            </div>
                            <div>
                                <div style={{ fontSize: '1rem', color: '#111', fontWeight: 600 }}>
                                    {cause.organizer}
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#666', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <span>Organizer</span>
                                    <span style={{ color: '#ccc' }}>•</span>
                                    <span>{cause.location}</span>
                                </div>
                            </div>
                        </div>

                        {/* The Story - Editorial Typography */}
                        <div style={{ marginBottom: '3rem' }}>
                            {cause.story.map((paragraph, index) => (
                                <p key={index} style={{
                                    marginBottom: '1.5rem',
                                    lineHeight: 1.8,
                                    color: '#333',
                                    fontSize: '1.15rem',
                                    fontFamily: 'Georgia, serif' // Giving it that "Story" feel
                                }}>
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* Updates Section (Visual Only) */}
                        <div style={{ marginBottom: '3rem' }}>
                            <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #eee', marginBottom: '2rem' }}>
                                <button style={{ padding: '0 0 1rem', borderBottom: '2px solid #111', fontWeight: 600, background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer' }}>Updates</button>
                                <button style={{ padding: '0 0 1rem', color: '#666', background: 'none', border: 'none', cursor: 'pointer' }}>Comments ({cause.recentDonations.length})</button>
                            </div>

                            <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #eee' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#666', marginBottom: '0.5rem' }}>YESTERDAY</div>
                                <p style={{ fontSize: '1rem', color: '#333', marginBottom: '0' }}>
                                    Thank you to everyone who has donated so far! We have already raised {cause.percent}% of our goal. The team is working hard to make this happen.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: The "Pledge" Card */}
                    <div className="cause-sidebar" style={{ position: 'sticky', top: '40px' }}>
                        <div style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '2rem',
                            boxShadow: '0 4px 25px rgba(0,0,0,0.08)',
                            border: '1px solid rgba(0,0,0,0.04)'
                        }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#111' }}>{cause.raised}</span>
                                    <span style={{ fontSize: '1rem', color: '#666' }}>raised</span>
                                </div>

                                <div style={{ width: '100%', height: '6px', background: '#eee', borderRadius: '3px', marginBottom: '0.75rem' }}>
                                    <div style={{ width: `${cause.percent}%`, height: '100%', background: '#16a34a', borderRadius: '3px' }}></div>
                                </div>

                                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                    of {cause.goal} goal • <span style={{ color: '#111', fontWeight: 600 }}>{cause.recentDonations.length * 124} donations</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <Link to="/donate" state={{ cause }} style={{
                                    background: '#E67E22', // Brand Orange
                                    color: 'white',
                                    border: 'none',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    textDecoration: 'none',
                                    transition: 'background 0.2s'
                                }}>
                                    Donate now
                                </Link>
                                <button style={{
                                    background: '#fff',
                                    color: '#111',
                                    border: '1px solid #ddd',
                                    padding: '0.9rem',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <Share2 size={18} /> Share
                                </button>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                                <TrendingUp size={20} color="#E67E22" />
                                <span style={{ fontWeight: 600, color: '#111', fontSize: '0.95rem' }}>803 people just donated</span>
                            </div>

                            <div className="donations-list">
                                {cause.recentDonations.slice(0, 3).map((donation, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: '#f3f4f6',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <User size={16} color="#666" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#111' }}>{donation.name}</div>
                                            <div style={{ fontSize: '0.9rem', color: '#555', margin: '0.2rem 0' }}>
                                                <span style={{ fontWeight: 600 }}>{donation.amount}</span>
                                            </div>
                                            {donation.comment && <div style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>"{donation.comment}"</div>}
                                            <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.2rem' }}>{donation.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                                <button style={{ width: '100%', padding: '0.5rem', background: 'none', border: 'none', color: '#666', fontWeight: 600, cursor: 'pointer' }}>See all donations</button>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.85rem', justifyContent: 'center' }}>
                            <ShieldCheck size={16} />
                            <span><strong>Charizomai Guarantee</strong>: Your donation is protected.</span>
                        </div>
                    </div>

                </div>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .cause-layout {
                        grid-template-columns: 1fr !important;
                        gap: 2rem !important;
                    }
                    .cause-sidebar {
                        order: -1;
                        margin-bottom: 2rem;
                        position: static !important;
                    }
                }
            `}</style>
        </main>
    );
}
