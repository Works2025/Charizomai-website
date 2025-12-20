import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../supabase';

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('contact_messages')
                .insert([formData]);

            if (error) throw error;

            alert('Message sent successfully!');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main>
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, var(--bg-cream) 0%, white 100%)',
                padding: '8rem 0 6rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <motion.div
                        style={{ maxWidth: '800px', margin: '0 auto' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                            Let's Work Together
                        </h1>
                        <p style={{ fontSize: '1.3rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            Have questions about our programs? Want to volunteer or make a donation? We're here to help.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Cards */}
            <section style={{ padding: '6rem 0', background: 'white' }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '2rem',
                        maxWidth: '1200px',
                        margin: '0 auto 6rem'
                    }}>
                        {[
                            {
                                icon: <MapPin size={28} />,
                                title: "Visit Us",
                                content: "123 Charity Avenue\nEast Legon, Accra\nGhana",
                                color: 'var(--primary-color)'
                            },
                            {
                                icon: <Phone size={28} />,
                                title: "Call Us",
                                content: "+233 50 123 4567\n+233 20 987 6543",
                                color: 'var(--brand-teal)'
                            },
                            {
                                icon: <Mail size={28} />,
                                title: "Email Us",
                                content: "info@charizomaifoundation.org",
                                color: 'var(--brand-light-blue)'
                            },
                            {
                                icon: <Clock size={28} />,
                                title: "Office Hours",
                                content: "Mon-Fri: 9AM - 5PM\nSat: 10AM - 2PM",
                                color: 'var(--primary-color)'
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                className="hover-card"
                                style={{
                                    textAlign: 'center',
                                    padding: '2.5rem 1.5rem',
                                    borderRadius: '12px'
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    background: `${item.color}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem',
                                    color: item.color
                                }}>
                                    {item.icon}
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                                    {item.title}
                                </h3>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                                    {item.content}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                        <motion.div
                            style={{ textAlign: 'center', marginBottom: '3rem' }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                                Send Us a Message
                            </h2>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                                Fill out the form below and we'll get back to you within 24 hours.
                            </p>
                        </motion.div>

                        <motion.div
                            style={{
                                background: 'white',
                                padding: '3rem',
                                borderRadius: '16px',
                                border: '1px solid rgba(0, 0, 0, 0.08)',
                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)'
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <form id="contact-form" onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <label htmlFor="name" style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="John Doe"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            style={{
                                                width: '100%',
                                                padding: '0.875rem',
                                                border: '2px solid #E5E7EB',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                fontFamily: 'inherit',
                                                transition: 'border-color 0.2s'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="john@example.com"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            style={{
                                                width: '100%',
                                                padding: '0.875rem',
                                                border: '2px solid #E5E7EB',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                fontFamily: 'inherit',
                                                transition: 'border-color 0.2s'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label htmlFor="subject" style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        placeholder="How can we help?"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem',
                                            border: '2px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            fontFamily: 'inherit',
                                            transition: 'border-color 0.2s'
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <label htmlFor="message" style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="6"
                                        placeholder="Tell us more about your inquiry..."
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem',
                                            border: '2px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            fontFamily: 'inherit',
                                            resize: 'vertical',
                                            transition: 'border-color 0.2s'
                                        }}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={isSubmitting}
                                    style={{
                                        width: '100%',
                                        border: 'none',
                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                        fontSize: '1.05rem',
                                        padding: '1rem',
                                        fontWeight: 600,
                                        opacity: isSubmitting ? 0.7 : 1
                                    }}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section style={{ padding: '0 0 6rem', background: 'white' }}>
                <div className="container">
                    <div style={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                        height: '500px',
                        maxWidth: '1200px',
                        margin: '0 auto'
                    }}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.8267618693855!2d-0.1870!3d5.6037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMzYnMTMuMyJOIDDCsDExJzEzLjIiVw!5e0!3m2!1sen!2sgh!4v1234567890"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Charizomai Foundation Location"
                        ></iframe>
                    </div>
                </div>
            </section>
        </main>
    );
}
