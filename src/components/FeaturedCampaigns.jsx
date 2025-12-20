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
                    <div className="fc-partner-content">
                        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div>
                                <div className="fc-featured-badge">
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E67E22' }}></span>
                                    <span style={{ color: '#E67E22', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Corporate Match</span>
                                </div>
                                <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'white' }}>Double Your Impact</h4>
                            </div>
                            
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#9CA3AF', lineHeight: 1.5, maxWidth: '90%' }}>
                                Partners are matching donations this week. Your support goes twice as far.
                            </p>
                            
                            <button className="fc-partner-btn">
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
                <div className="fc-header">
                    <div>
                        <p className="fc-tag">
                            Featured Campaigns
                        </p>
                        <h2 className="fc-title">
                            Support Causes That Matter
                        </h2>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="fc-nav">
                        <button className="fc-nav-btn">
                            <ChevronLeft size={20} color="#6B7280" style={{ transition: 'color 0.2s ease' }} />
                        </button>
                        <button className="fc-nav-btn">
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
