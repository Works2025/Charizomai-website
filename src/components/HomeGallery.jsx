import { motion } from 'framer-motion';

const images = [
    { src: '/gallery-new-1.jpg', alt: 'Community Outreach', size: 'large' },
    { src: '/gallery-new-2.jpg', alt: 'Food Distribution', size: 'small' },
    { src: '/gallery-new-3.jpg', alt: 'Charity Event', size: 'small' },
    { src: '/gallery-new-4.jpg', alt: 'Team Work', size: 'medium' },
    { src: '/gallery-new-5.jpg', alt: 'Helping Hands', size: 'medium' },
];

export default function HomeGallery() {
    return (
        <section className="home-gallery" style={{ padding: '6rem 0', background: '#F8FAFC' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ 
                            fontSize: '2.5rem', 
                            fontWeight: 800, 
                            color: '#1E293B',
                            marginBottom: '1rem'
                        }}
                    >
                        Our Gallery
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        style={{ 
                            fontSize: '1.1rem', 
                            color: '#64748B', 
                            maxWidth: '600px', 
                            margin: '0 auto' 
                        }}
                    >
                        See the impact of your generosity in action. Every smile tells a story of hope and transformation.
                    </motion.p>
                </div>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: '24px',
                    gridAutoRows: '250px' 
                }}>
                    {images.map((img, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            style={{
                                borderRadius: '16px',
                                overflow: 'hidden',
                                position: 'relative',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                gridColumn: index === 0 ? 'span 2' : 'span 1', // Make the first image wider
                                gridRow: index === 0 ? 'span 2' : 'span 1', // Make the first image taller
                                minHeight: '100%'
                            }}
                        >
                            <img 
                                src={img.src} 
                                alt={img.alt} 
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover',
                                    transition: 'transform 0.5s ease'
                                }}
                                onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
            
             {/* Mobile Responsive Adjustment Styles handled inline or via global css usually, 
                but here we rely on grid-template-columns auto-fit */}
        </section>
    );
}
