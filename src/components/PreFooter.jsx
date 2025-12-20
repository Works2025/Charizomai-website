import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PreFooter() {
    return (
        <section className="pre-footer">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2>Ready to make a difference?</h2>
                    <p>Start your fundraiser today or support a cause that matters to you. Every contribution, big or small, helps create positive change in our communities.</p>
                    <Link to="/donate" className="btn-light">Start a Fundraiser</Link>
                </motion.div>
            </div>
        </section>
    );
}
