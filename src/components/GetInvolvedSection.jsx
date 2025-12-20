import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Users, Megaphone, HandHeart } from 'lucide-react';

export default function GetInvolvedSection() {
    const ways = [
        {
            icon: <Heart size={28} />,
            title: "Donate",
            description: "Support causes that matter to you",
            link: "/donate"
        },
        {
            icon: <Users size={28} />,
            title: "Volunteer",
            description: "Give your time to help communities",
            link: "/volunteer"
        },
        {
            icon: <Megaphone size={28} />,
            title: "Spread the Word",
            description: "Share campaigns with your network",
            link: "/campaigns"
        },
        {
            icon: <HandHeart size={28} />,
            title: "Donate Now",
            description: "Make an immediate impact today",
            link: "/donate"
        }
    ];

    return (
        <section style={{
            padding: '3rem 0 0',
            background: '#F9FAFB'
        }}>
            <div className="container">
                <motion.div
                    style={{ textAlign: 'center', marginBottom: '2.5rem' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: '#1a1a1a',
                        marginBottom: '0.75rem'
                    }}>
                        Ways to Get Involved
                    </h2>
                    <p style={{
                        fontSize: '1rem',
                        color: '#6B7280',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Join thousands of people making a difference in communities across Ghana
                    </p>
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1.5rem',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {ways.map((way, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                to={way.link}
                                style={{
                                    display: 'block',
                                    background: 'white',
                                    padding: '2rem 1.5rem',
                                    borderRadius: '12px',
                                    border: '1px solid #E5E7EB',
                                    textAlign: 'center',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease',
                                    height: '100%'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                                    e.currentTarget.style.borderColor = '#E67E22';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.borderColor = '#E5E7EB';
                                }}
                            >
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    background: '#FEF3E7',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.25rem',
                                    color: '#E67E22'
                                }}>
                                    {way.icon}
                                </div>
                                <h3 style={{
                                    fontSize: '1.15rem',
                                    fontWeight: 600,
                                    color: '#1a1a1a',
                                    marginBottom: '0.5rem'
                                }}>
                                    {way.title}
                                </h3>
                                <p style={{
                                    fontSize: '0.9rem',
                                    color: '#6B7280',
                                    lineHeight: 1.5,
                                    margin: 0
                                }}>
                                    {way.description}
                                </p>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
