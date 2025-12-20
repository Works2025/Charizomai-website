import { motion } from 'framer-motion';

export default function PartnersSection() {
    return (
        <section className="partners-section">
            <div className="container">
                <p className="partners-title">Trusted by Leading Organizations</p>
                <motion.div
                    className="partners-grid"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.6 }}
                    viewport={{ once: true }}
                >
                    {[
                        { type: 'image', src: "/gracefields.png", alt: "Gracefields Chapel" },
                        { type: 'image', src: "/unicef.png", alt: "UNICEF", invert: true },
                        { type: 'text', label: 'WHO' },
                        { type: 'text', label: 'Red Cross' },
                        { type: 'text', label: 'UNESCO' }
                    ].map((partner, i) => {
                        // Determine filters based on whether the image needs inverting (e.g. white logos)
                        const defaultFilter = partner.invert 
                            ? 'invert(1) grayscale(100%) opacity(0.7)' 
                            : 'grayscale(100%) opacity(0.7)';
                        const hoverFilter = partner.invert 
                            ? 'invert(1) grayscale(0%) opacity(1)' 
                            : 'grayscale(0%) opacity(1)';

                        return (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '60px'
                            }}>
                                {partner.type === 'image' ? (
                                    <img 
                                        src={partner.src} 
                                        alt={partner.alt} 
                                        style={{ 
                                            height: '100%', 
                                            width: 'auto', 
                                            objectFit: 'contain', 
                                            filter: defaultFilter,
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseOver={e => e.currentTarget.style.filter = hoverFilter}
                                        onMouseOut={e => e.currentTarget.style.filter = defaultFilter}
                                    />
                                ) : (
                                    <span style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 700,
                                        color: '#94A3B8',
                                        letterSpacing: '0.05em'
                                    }}>
                                        {partner.label}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
