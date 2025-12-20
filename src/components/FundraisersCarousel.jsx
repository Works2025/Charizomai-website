import { motion } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import './FundraisersCarousel.css';

export default function FundraisersCarousel() {
    const [fundraisers, setFundraisers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFundraisers = async () => {
            try {
                const { data, error } = await supabase
                    .from('causes')
                    .select('*')
                    .limit(4);

                if (error) throw error;

                if (data) {
                    const formattedData = data.map(cause => ({
                        id: cause.id,
                        image: cause.image_url || cause.img,
                        title: cause.title,
                        organizer: `by ${cause.organizer}`,
                        donations: "Active", // Placeholder
                        raised: cause.raised,
                        percent: cause.percent
                    }));
                    setFundraisers(formattedData);
                }
            } catch (error) {
                console.error('Error fetching fundraisers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFundraisers();
    }, []);

    if (loading) return null;

    return (
        <section className="fundraisers-section">
            <div className="container">
                {/* Header */}
                <div className="fundraisers-header">
                    <div>
                        <h2 className="fundraisers-title">
                            More ways to make a difference. Find fundraisers inspired by what you care about.
                        </h2>

                        {/* Category Dropdown */}
                        <button className="fundraisers-dropdown">
                            Happening worldwide
                            <ChevronDown size={16} />
                        </button>
                    </div>

                    {/* Navigation Arrows */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="fundraisers-nav-btn">
                            <ChevronLeft size={20} color="white" />
                        </button>
                        <button className="fundraisers-nav-btn">
                            <ChevronRight size={20} color="white" />
                        </button>
                    </div>
                </div>

                {/* Fundraiser Cards */}
                <div className="fundraisers-grid">
                    {fundraisers.map((fundraiser, i) => (
                        <Link to={`/causes/${fundraiser.id}`} key={fundraiser.id} style={{ textDecoration: 'none' }}>
                            <motion.article
                                className="fundraiser-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                {/* Image */}
                                <div style={{
                                    height: '200px',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}>
                                    <img
                                        src={fundraiser.image}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                        alt={fundraiser.title}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '10px',
                                        left: '10px',
                                        background: 'rgba(0, 0, 0, 0.75)',
                                        color: 'white',
                                        padding: '0.35rem 0.75rem',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        fontWeight: 500
                                    }}>
                                        {fundraiser.donations}
                                    </div>
                                </div>

                                {/* Content */}
                                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        marginBottom: '0.5rem',
                                        color: '#1a1a1a',
                                        lineHeight: 1.4,
                                        minHeight: '2.8rem',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {fundraiser.title}
                                    </h3>

                                    <p style={{
                                        fontSize: '0.85rem',
                                        color: '#6B7280',
                                        marginBottom: '1rem'
                                    }}>
                                        {fundraiser.organizer}
                                    </p>

                                    <div style={{ marginTop: 'auto' }}>
                                        {/* Progress Bar */}
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            <div style={{
                                                height: '6px',
                                                background: '#E5E7EB',
                                                borderRadius: '3px',
                                                overflow: 'hidden'
                                            }}>
                                                <div
                                                    style={{
                                                        width: `${fundraiser.percent}%`,
                                                        height: '100%',
                                                        background: '#00B964',
                                                        borderRadius: '3px'
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Amount */}
                                        <p style={{
                                            fontSize: '0.9rem',
                                            color: '#1a1a1a',
                                            margin: 0
                                        }}>
                                            <span style={{ fontWeight: 700 }}>{fundraiser.raised}</span> raised
                                        </p>
                                    </div>
                                </div>
                            </motion.article>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
