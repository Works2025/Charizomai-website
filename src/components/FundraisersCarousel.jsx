import { motion } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

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

    if (loading) return null; // Or a loading skeleton if preferred

    return (
        <section style={{
            background: 'linear-gradient(135deg, #0D3B3B 0%, #1a5050 100%)',
            padding: '6rem 0',
            color: 'white'
        }}>
            <div className="container">
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '3rem',
                    maxWidth: '1200px',
                    margin: '0 auto 3rem'
                }}>
                    <div>
                        <h2 style={{
                            fontSize: '2.5rem',
                            fontWeight: 700,
                            color: 'white',
                            marginBottom: '1rem',
                            lineHeight: 1.3,
                            maxWidth: '600px'
                        }}>
                            More ways to make a difference. Find fundraisers inspired by what you care about.
                        </h2>

                        {/* Category Dropdown */}
                        <button style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.6rem 1.25rem',
                            background: 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '50px',
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            marginTop: '1.5rem'
                        }}
                            onMouseEnter={(e) => {
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                                e.target.style.background = 'transparent';
                            }}
                        >
                            Happening worldwide
                            <ChevronDown size={16} />
                        </button>
                    </div>

                    {/* Navigation Arrows */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            background: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >
                            <ChevronLeft size={20} color="white" />
                        </button>
                        <button style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            background: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >
                            <ChevronRight size={20} color="white" />
                        </button>
                    </div>
                </div>

                {/* Fundraiser Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '1.5rem',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {fundraisers.map((fundraiser, i) => (
                        <Link to={`/causes/${fundraiser.id}`} key={fundraiser.id} style={{ textDecoration: 'none' }}>
                            <motion.article
                                style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                                }}
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
