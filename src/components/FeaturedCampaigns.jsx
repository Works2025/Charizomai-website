import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Handshake } from 'lucide-react';
import { supabase } from '../supabase';
import './FeaturedCampaigns.css';

export default function FeaturedCampaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                // Fetch Causes
                const { data, error } = await supabase
                    .from('causes')
                    .select('*')
                    .order('raised', { ascending: false }) // Prioritize mostly funded
                    .limit(5);

                if (error) throw error;

                if (data) {
                    const formattedCampaigns = data.map(cause => ({
                        id: cause.id,
                        image: cause.image_url || "/charity-group-photo.jpg",
                        title: cause.title,
                        donations: "Many donors", // Placeholder until donations count join
                        raised: `GH₵${parseFloat(cause.raised).toLocaleString()}`,
                        goal: `GH₵${parseFloat(cause.goal).toLocaleString()}`,
                        percent: Math.min(100, Math.round((cause.raised / cause.goal) * 100))
                    }));
                    setCampaigns(formattedCampaigns);
                }
            } catch (err) {
                console.error('Error fetching campaigns:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    // Skeleton / Loading State
    if (loading) {
         return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading campaigns...</div>;
    }

    if (campaigns.length === 0) {
        return null; // Don't show section if no campaigns
    }

    const featuredCampaign = campaigns[0];
    const gridCampaigns = campaigns.slice(1);

    const CampaignCard = ({ campaign, isFeatured = false }) => (
        <motion.article
            className="campaign-card"
            whileHover={{
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
        >
            {/* Image */}
            <div style={{
                height: isFeatured ? '320px' : '180px',
                overflow: 'hidden',
                position: 'relative'
            }}>
                <img
                    src={campaign.image}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                    alt={campaign.title}
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
                    {campaign.donations}
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: isFeatured ? '1.5rem' : '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{
                    fontSize: isFeatured ? '1.25rem' : '1rem',
                    fontWeight: 600,
                    marginBottom: '0.25rem',
                    color: '#1a1a1a',
                    lineHeight: 1.2,
                }}>
                    {campaign.title}
                </h3>

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
                                width: `${campaign.percent}%`,
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
                    <span style={{ fontWeight: 700 }}>{campaign.raised}</span> raised of {campaign.goal}
                </p>

                {isFeatured && (
                    <div style={{ 
                        marginTop: '1.25rem', 
                        padding: '1.5rem', 
                        background: 'linear-gradient(145deg, #1F2937 0%, #111827 100%)', 
                        borderRadius: '12px',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.05)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div>
                                <div style={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    gap: '6px', 
                                    background: 'rgba(230, 126, 34, 0.15)', 
                                    padding: '4px 8px', 
                                    borderRadius: '4px',
                                    marginBottom: '8px',
                                    border: '1px solid rgba(230, 126, 34, 0.3)'
                                }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E67E22' }}></span>
                                    <span style={{ color: '#E67E22', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Corporate Match</span>
                                </div>
                                <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'white' }}>Double Your Impact</h4>
                            </div>
                            
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#9CA3AF', lineHeight: 1.5, maxWidth: '90%' }}>
                                Partners are matching donations this week. Your support goes twice as far.
                            </p>
                            
                            <button style={{ 
                                alignSelf: 'flex-start',
                                marginTop: '0.25rem',
                                background: 'white', 
                                color: '#111827', 
                                border: 'none', 
                                padding: '0.6rem 1.25rem', 
                                borderRadius: '8px', 
                                fontWeight: 600, 
                                fontSize: '0.875rem', 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'transform 0.2s',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                Partner with Us <ChevronRight size={14} />
                            </button>
                        </div>
                        
                         <div style={{
                            position: 'absolute',
                            bottom: '-15px',
                            right: '-15px',
                            opacity: 0.05,
                            transform: 'rotate(-15deg)',
                            pointerEvents: 'none'
                         }}>
                            <Handshake size={120} color="white" />
                         </div>
                    </div>
                )}
            </div>
        </motion.article>
    );


    return (
        <section style={{ padding: '3.5rem 0', background: '#FAFAFA' }} className="featured-campaigns-section">
            <div className="container">
                {/* Header Section */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginBottom: '3rem',
                    maxWidth: '1200px',
                    margin: '0 auto 3rem',
                    flexWrap: 'wrap',
                    gap: '1.5rem'
                }}>
                    <div>
                        <p style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#E67E22',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.75rem'
                        }}>
                            Featured Campaigns
                        </p>
                        <h2 style={{
                            fontSize: '2.25rem',
                            fontWeight: 800,
                            color: '#1a1a1a',
                            margin: 0,
                            lineHeight: 1.2,
                            maxWidth: '600px'
                        }}>
                            Support Causes That Matter
                        </h2>
                    </div>

                    {/* Navigation Arrows */}
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '8px',
                            border: '1px solid #E5E7EB',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#E67E22';
                                e.currentTarget.style.borderColor = '#E67E22';
                                e.currentTarget.querySelector('svg').style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.borderColor = '#E5E7EB';
                                e.currentTarget.querySelector('svg').style.color = '#6B7280';
                            }}
                        >
                            <ChevronLeft size={20} color="#6B7280" style={{ transition: 'color 0.2s ease' }} />
                        </button>
                        <button style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '8px',
                            border: '1px solid #E5E7EB',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#E67E22';
                                e.currentTarget.style.borderColor = '#E67E22';
                                e.currentTarget.querySelector('svg').style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.borderColor = '#E5E7EB';
                                e.currentTarget.querySelector('svg').style.color = '#6B7280';
                            }}
                        >
                            <ChevronRight size={20} color="#6B7280" style={{ transition: 'color 0.2s ease' }} />
                        </button>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="campaigns-main-grid">
                    {/* Large Featured Card - Left */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <CampaignCard campaign={featuredCampaign} isFeatured={true} />
                    </motion.div>

                    {/* 2x2 Grid - Right */}
                    <motion.div
                        className="campaigns-right-grid"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        {gridCampaigns.map((campaign, i) => (
                            <CampaignCard key={i} campaign={campaign} />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section >
    );
}
