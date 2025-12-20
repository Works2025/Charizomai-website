import { motion } from 'framer-motion';

export default function StatsSection() {
    return (
        <section className="stats-bar">
            <div className="container">
                <div className="stats-grid">
                    {[
                        { value: "GH₵50M+", label: "Raised for Charity" },
                        { value: "10k+", label: "Donors Worldwide" },
                        { value: "500+", label: "Communities Helped" }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            className="stat-item"
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <h3>{stat.value}</h3>
                            <p>{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
