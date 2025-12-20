import { motion } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

export default function FundraisersCarousel() {
    const fundraisers = [
        {
            image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=400&q=80",
            title: "Help Peter fight for little Aurelias life",
            organizer: "by Therese for Medical",
            donations: "1.3K donations",
            raised: "GH₵68,646",
            percent: 68
        },
        {
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
            title: "Help Support Raelyn on Her Road to Recovery",
            organizer: "by TYLER for Medical",
            donations: "2.3K donations",
            raised: "GH₵175,654",
            percent: 87
        },
        {
            image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=400&q=80",
            title: "Një Shpresë për Bujanën",
            organizer: "by Eliard for Medical",
            donations: "1.1K donations",
            raised: "GH₵72,993",
            percent: 48
        },
        {
            image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=400&q=80",
            title: "A Home for Sheena and Baby Joseph — Let's Change Their Story",
            organizer: "by Joshua for Community",
            donations: "2.78K donations",
            raised: "GH₵608,000",
            percent: 75
        }
    ];

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
                        <motion.article
                            key={i}
                            style={{
                                background: 'white',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
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
                            <div style={{ padding: '1.25rem' }}>
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
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
