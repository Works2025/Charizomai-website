import { motion } from 'framer-motion';

export default function HowItWorks() {
    const features = [
        {
            icon: "⚡",
            title: "Lightning Fast",
            description: "Set up your fundraiser in under 2 minutes. No complicated forms or waiting periods."
        },
        {
            icon: "🔒",
            title: "Secure & Trusted",
            description: "Bank-level security with encrypted transactions. Your donations are always protected."
        },
        {
            icon: "🌍",
            title: "Global Reach",
            description: "Share your cause worldwide and receive donations from supporters anywhere."
        }
    ];

    return (
        <section className="how-it-works-redesign">
            <div className="container">
                <div className="difference-grid">
                    {/* Left Side - Main CTA */}
                    <motion.div
                        className="difference-cta"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="cta-content">
                            <motion.div
                                className="cta-badge"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                            >
                                ✨ Trusted by thousands
                            </motion.div>
                            <h2 className="cta-heading">
                                Start making a
                                <span className="highlight-text"> difference </span>
                                today
                            </h2>
                            <p className="cta-description">
                                Join a community of changemakers. Create your fundraiser, share your story,
                                and watch as people come together to support your cause.
                            </p>
                            <motion.button
                                className="cta-button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span>Start Your Fundraiser</span>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </motion.button>
                            <p className="cta-note">Free to start • No hidden fees • Instant setup</p>
                        </div>
                    </motion.div>

                    {/* Right Side - Feature Cards */}
                    <div className="difference-features">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="feature-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15, duration: 0.5 }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="feature-icon">{feature.icon}</div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
