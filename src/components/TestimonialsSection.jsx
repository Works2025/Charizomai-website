import { motion } from 'framer-motion';

export default function TestimonialsSection() {
    const testimonials = [
        {
            text: "Thanks to Charizomai Foundation, our village now has clean water. The children no longer walk miles to fetch water and can focus on their education.",
            name: "Akosua Mensah",
            role: "Community Leader, Ashanti Region",
            avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80"
        },
        {
            text: "The mobile clinic saved my daughter's life. We had no access to healthcare before, but now doctors visit our village every month.",
            name: "Kwame Osei",
            role: "Parent, Northern Region",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80"
        },
        {
            text: "I received a scholarship through this foundation and I'm now studying to become a teacher. I want to give back to my community.",
            name: "Ama Boateng",
            role: "Scholarship Recipient",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"
        }
    ];

    return (
        <section className="testimonials-section">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2>Stories of Change</h2>
                    <p>Real impact from real people in communities we serve</p>
                </motion.div>

                <div className="cards-wrapper">
                    {testimonials.map((testimonial, i) => (
                        <motion.div
                            key={i}
                            className="testimonial-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.15 }}
                            viewport={{ once: true }}
                        >
                            <div className="quote-icon">"</div>
                            <p className="testimonial-text">{testimonial.text}</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">
                                    <img src={testimonial.avatar} alt={testimonial.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                </div>
                                <div className="author-info">
                                    <h4>{testimonial.name}</h4>
                                    <span>{testimonial.role}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
