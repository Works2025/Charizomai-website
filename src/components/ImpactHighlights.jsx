import { motion } from 'framer-motion';
import { Wallet, ShieldCheck, MapPin, Activity } from 'lucide-react';

export default function ImpactHighlights() {
    const highlights = [
        {
            title: "Direct Impact",
            desc: "Your contributions directly fund our on-ground programs in education, healthcare, and community development.",
            icon: <Wallet size={32} color="#E67E22" />
        },
        {
            title: "Transparency & Accountability",
            desc: "We maintain rigorous financial standards and open reporting to ensure every cedi is accounted for.",
            icon: <ShieldCheck size={32} color="#E67E22" />
        },
        {
            title: "Community-Led Solutions",
            desc: "We work hand-in-hand with local leaders to implement sustainable solutions that address specific community needs.",
            icon: <MapPin size={32} color="#E67E22" />
        },
        {
            title: "Sustainable Development",
            desc: "Our projects are designed for long-term impact, empowering communities to thrive independently.",
            icon: <Activity size={32} color="#E67E22" />
        }
    ];

    return (
        <section className="impact-section">
            <div className="container">
                <div className="impact-header">
                    <h2>Why Support Charizomai?</h2>
                    <p>
                        A dedicated NGO committed to transforming lives in Ghanaian communities through sustainable development.
                    </p>
                </div>

                <div className="impact-grid">
                    {highlights.map((item, index) => (
                        <motion.div
                            key={index}
                            className="impact-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <div className="impact-icon">{item.icon}</div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
