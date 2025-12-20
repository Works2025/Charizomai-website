import { motion } from 'framer-motion';
import { Stethoscope, AlertCircle, GraduationCap, Building2, Heart, PawPrint, Users, Globe, ArrowRight } from 'lucide-react';

const categories = [
    { name: "Medical", icon: Stethoscope },
    { name: "Emergency", icon: AlertCircle },
    { name: "Education", icon: GraduationCap },
    { name: "Nonprofit", icon: Building2 },
    { name: "Memorial", icon: Heart },
    { name: "Animals", icon: PawPrint },
    { name: "Community", icon: Users },
    { name: "Environment", icon: Globe }
];

export default function DiscoverGrid() {
    return (
        <section className="categories-section" style={{ padding: '5rem 0', background: 'white', borderBottom: '1px solid #f3f4f6' }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <h2 style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    color: '#111',
                    marginBottom: '2.5rem',
                    letterSpacing: '-0.02em'
                }}>
                    Browse by Category
                </h2>

                <div className="categories-pills" style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '1rem',
                    maxWidth: '1000px',
                    margin: '0 auto'
                }}>
                    {categories.map((cat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.05, backgroundColor: '#02a95c', color: 'white', borderColor: '#02a95c' }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.03 }}
                            viewport={{ once: true }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                padding: '0.8rem 1.5rem',
                                borderRadius: '50px',
                                background: 'white',
                                border: '1px solid #e5e7eb',
                                cursor: 'pointer',
                                color: '#374151',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
                            }}
                        >
                            <cat.icon size={18} strokeWidth={2} />
                            <span>{cat.name}</span>
                        </motion.div>
                    ))}

                    <motion.a
                        href="/causes"
                        whileHover={{ scale: 1.05, color: '#02a95c' }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.8rem 1.5rem',
                            cursor: 'pointer',
                            color: '#6b7280',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            textDecoration: 'none'
                        }}
                    >
                        View all <ArrowRight size={16} />
                    </motion.a>
                </div>
            </div>
        </section>
    );
}
