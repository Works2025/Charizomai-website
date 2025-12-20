import { motion } from 'framer-motion';
import { Stethoscope, AlertCircle, GraduationCap, Building2, Heart, PawPrint, Users, Globe, ArrowRight } from 'lucide-react';
import './DiscoverGrid.css';

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
        <section className="categories-section">
            <div className="container categories-header">
                <h2 className="categories-title">
                    Browse by Category
                </h2>

                <div className="categories-pills">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={i}
                            className="category-pill"
                            whileHover={{ scale: 1.05, backgroundColor: '#02a95c', color: 'white', borderColor: '#02a95c' }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.03 }}
                            viewport={{ once: true }}
                        >
                            <cat.icon size={18} strokeWidth={2} />
                            <span>{cat.name}</span>
                        </motion.div>
                    ))}

                    <motion.a
                        href="/causes"
                        className="category-pill"
                        whileHover={{ scale: 1.05, color: '#02a95c', backgroundColor: 'white' }}
                        style={{ color: '#6b7280' }} // Optional override if needed or handled in CSS subclass
                    >
                        View all <ArrowRight size={16} />
                    </motion.a>
                </div>
            </div>
        </section>
    );
}
