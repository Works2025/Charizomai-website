import { motion } from 'framer-motion';
import { useState } from 'react';

export default function NewsletterSection() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Thank you for subscribing with: ${email}`);
        setEmail('');
    };

    return (
        <section className="newsletter-section">
            <div className="container">
                <motion.div
                    className="newsletter-box"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="newsletter-content">
                        <h2>Stay Updated</h2>
                        <p style={{ fontSize: '1.1rem', opacity: 0.95 }}>
                            Get the latest news about our projects and how you can make a difference
                        </p>
                        <form className="newsletter-form" onSubmit={handleSubmit}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit">Subscribe</button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
