import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const fallbackImages = [
    { 
        src: '/gallery-upload-1.jpg', 
        category: 'Outreach', 
        caption: 'Spreading joy in the community',
        size: 'large'
    },
    { 
        src: '/gallery-upload-2.jpg', 
        category: 'Distribution', 
        caption: 'Essential supplies distribution event',
        size: 'medium' 
    },
    { 
        src: '/gallery-upload-3.jpg', 
        category: 'Education', 
        caption: 'Supporting students with school supplies',
        size: 'medium'
    },
    { 
        src: '/gallery-upload-4.jpg', 
        category: 'Team', 
        caption: 'Our dedicated volunteers making a difference',
        size: 'large'
    },
    { 
        src: '/gallery-upload-5.jpg', 
        category: 'Outreach', 
        caption: 'Connecting with families in need',
        size: 'medium'
    },
    { 
        src: '/gallery-new-1.jpg', 
        category: 'Outreach', 
        caption: 'Community Outreach Program',
        size: 'medium'
    },
    { 
        src: '/gallery-new-2.jpg', 
        category: 'Distribution', 
        caption: 'Food Distribution Drive',
        size: 'large'
    },
    { 
        src: '/gallery-new-3.jpg', 
        category: 'Events', 
        caption: 'Charity Fundraising Event',
        size: 'medium'
    },
    { 
        src: '/gallery-new-4.jpg', 
        category: 'Team', 
        caption: 'Our Dedicated Team',
        size: 'medium'
    },
    { 
        src: '/gallery-new-5.jpg', 
        category: 'Volunteer', 
        caption: 'Helping Hands in Action',
        size: 'large'
    },
    // Adding more duplicates to fill space nicely
    { 
        src: '/gallery-upload-2.jpg', 
        category: 'Events', 
        caption: 'Smiles all around',
        size: 'medium' 
    },
    { 
        src: '/gallery-upload-1.jpg', 
        category: 'Distribution', 
        caption: 'Making a tangible impact',
        size: 'large'
    },
    { 
        src: '/gallery-new-1.jpg', 
        category: 'Education', 
        caption: 'Learning and growing together',
        size: 'medium'
    },
     { 
        src: '/gallery-new-3.jpg', 
        category: 'Team', 
        caption: 'Building a stronger future',
        size: 'medium'
    },
];

const categories = ['All', 'Outreach', 'Distribution', 'Education', 'Team', 'Events', 'Volunteer'];

export default function Gallery() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const { data, error } = await supabase
                .from('gallery')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            let formattedImages = [];
            
            if (data && data.length > 0) {
                formattedImages = data.map(img => ({
                    src: img.image_url,
                    category: img.category || 'Uncategorized',
                    caption: img.caption || 'Charity Moment',
                    size: 'medium'
                }));
            } else {
                 console.log('No data found in gallery table, using fallback');
                 formattedImages = fallbackImages;
            }
            
            setImages(formattedImages);
        } catch (error) {
            console.error('Error fetching gallery:', error);
            setImages(fallbackImages);
        } finally {
            setLoading(false);
        }
    };

    const filteredImages = activeCategory === 'All' 
        ? images 
        : images.filter(img => img.category === activeCategory);

    return (
        <main style={{ background: '#f0f4f8', minHeight: '100vh', paddingBottom: '6rem' }}>
            {/* Hero Section */}
            <section style={{
                position: 'relative',
                background: 'linear-gradient(135deg, var(--brand-navy) 0%, #1e293b 100%)',
                padding: '8rem 0 6rem',
                color: 'white',
                textAlign: 'center',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0, 
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at 70% 30%, rgba(22, 160, 133, 0.15), transparent 60%)',
                    pointerEvents: 'none'
                }} />
                
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ 
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(5px)',
                            borderRadius: '50px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            marginBottom: '1.5rem',
                            letterSpacing: '0.5px' 
                        }}
                    >
                        OUR MOMENTS
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ 
                            fontSize: '3.5rem', 
                            fontWeight: 800, 
                            marginBottom: '1rem',
                            letterSpacing: '-0.02em',
                            lineHeight: 1.1
                        }}
                    >
                        Capturing <span style={{ color: 'var(--brand-orange)' }}>Hope</span> in Action
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}
                    >
                        Explore the stories behind our mission. Every picture tells a story of transformation, kindness, and community spirit.
                    </motion.p>
                </div>
            </section>

            {/* Filter Tabs */}
            <section style={{ position: 'sticky', top: '80px', zIndex: 100, background: 'rgba(240, 244, 248, 0.95)', backdropFilter: 'blur(10px)', padding: '1rem 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="container" style={{ overflowX: 'auto', paddingBottom: '5px' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', minWidth: 'max-content' }}>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                style={{
                                    padding: '0.6rem 1.25rem',
                                    borderRadius: '50px',
                                    border: 'none',
                                    background: activeCategory === cat ? 'var(--brand-orange)' : 'white',
                                    color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: activeCategory === cat ? '0 4px 12px rgba(230, 126, 34, 0.3)' : '0 1px 3px rgba(0,0,0,0.05)'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {loading && (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Loading gallery...</p>
                </div>
            )}

            {/* Gallery Grid */}
            <section style={{ padding: '3rem 0' }}>
                <div className="container">
                    <motion.div 
                        layout
                        style={{
                            columnCount: 3,
                            columnGap: '2rem',
                        }}
                        className="gallery-masonry"
                    >
                        <style>{`
                            @media (max-width: 1024px) {
                                .gallery-masonry { column-count: 2 !important; }
                            }
                            @media (max-width: 640px) {
                                .gallery-masonry { column-count: 1 !important; }
                            }
                        `}</style>

                        <AnimatePresence>
                            {filteredImages.map((img, i) => (
                                <motion.div
                                    key={`${img.src}-${i}`}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        marginBottom: '2rem',
                                        breakInside: 'avoid',
                                        WebkitBreakInside: 'avoid'
                                    }}
                                    onClick={() => setSelectedImage(img)}
                                >
                                    <div 
                                        style={{
                                            position: 'relative',
                                            borderRadius: '4px',
                                            overflow: 'hidden',
                                            background: 'white',
                                            padding: '12px 12px 60px 12px',
                                            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
                                            cursor: 'zoom-in',
                                            transform: i % 2 === 0 ? 'rotate(1deg)' : 'rotate(-1deg)',
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                        }}
                                        className="gallery-frame"
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'rotate(0deg) scale(1.02)';
                                            e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.25)';
                                            e.currentTarget.style.zIndex = '10';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = i % 2 === 0 ? 'rotate(1deg)' : 'rotate(-1deg)';
                                            e.currentTarget.style.boxShadow = '0 10px 40px -10px rgba(0,0,0,0.15)';
                                            e.currentTarget.style.zIndex = '1';
                                        }}
                                    >
                                        <div style={{ overflow: 'hidden', borderRadius: '2px', position: 'relative' }}>
                                            <img
                                                src={img.src}
                                                alt={img.caption}
                                                style={{
                                                    width: '100%',
                                                    height: 'auto',
                                                    display: 'block',
                                                    transition: 'transform 0.5s ease',
                                                }}
                                            />
                                        </div>
                                        
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '0',
                                            left: '0',
                                            width: '100%',
                                            height: '60px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '0 1.5rem',
                                            justifyContent: 'space-between'
                                        }}>
                                             <p style={{
                                                margin: 0,
                                                fontFamily: '"Indie Flower", cursive, sans-serif',
                                                color: '#2c3e50',
                                                fontSize: '1rem',
                                                fontWeight: 600
                                             }}>
                                                {img.caption}
                                             </p>
                                             <span style={{
                                                fontSize: '0.7rem',
                                                color: '#94a3b8',
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px',
                                                fontWeight: 700
                                             }}>
                                                 {img.category}
                                             </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredImages.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
                            <p style={{ fontSize: '1.2rem' }}>No images found in this category.</p>
                            <button 
                                onClick={() => setActiveCategory('All')}
                                style={{
                                    marginTop: '1rem',
                                    background: 'transparent',
                                    border: '1px solid var(--primary-color)',
                                    color: 'var(--primary-color)',
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                View All
                            </button>
                        </div>
                    )}
                </div>
            </section>

             {/* Lightbox Modal */}
             <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.95)',
                            zIndex: 2000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2rem',
                            backdropFilter: 'blur(10px)'
                        }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            style={{ 
                                maxWidth: '1000px', 
                                width: '100%', 
                                maxHeight: '90vh',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
                                <img
                                    src={selectedImage.src}
                                    alt={selectedImage.caption}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        maxHeight: '80vh',
                                        objectFit: 'contain',
                                        display: 'block'
                                    }}
                                />
                            </div>
                            
                            <div style={{ 
                                marginTop: '1.5rem', 
                                textAlign: 'center', 
                                color: 'white',
                                maxWidth: '700px'
                            }}>
                                <span style={{
                                    color: 'var(--brand-orange)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    marginBottom: '0.5rem',
                                    display: 'block'
                                }}>
                                    {selectedImage.category}
                                </span>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>{selectedImage.caption}</h3>
                            </div>
                        </motion.div>

                        <button
                            style={{
                                position: 'absolute',
                                top: '2rem',
                                right: '2rem',
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                color: 'white',
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                zIndex: 2001
                            }}
                            onClick={() => setSelectedImage(null)}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
