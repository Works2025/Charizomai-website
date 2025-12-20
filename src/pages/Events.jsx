import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { supabase } from '../supabase';
import { sendEmail } from '../utils/emailService';

export default function Events() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [registrationCode, setRegistrationCode] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('date');
            
            if (data) {
                setEvents(data.map(e => {
                    const date = new Date(e.date);
                    return {
                        id: e.id,
                        month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
                        day: date.getDate().toString(),
                        title: e.title,
                        time: date.toLocaleTimeString('default', { hour: 'numeric', minute: '2-digit' }),
                        location: e.location,
                        image: e.image_url || '/hero-4.jpg',
                        category: e.category || 'Event',
                        description: e.description || 'Join us for this event.'
                    };
                }));
            }
        };
        fetchEvents();
    }, []);

    const generateRegistrationCode = () => {
        const prefix = selectedEvent.category.substring(0, 3).toUpperCase();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        const timestamp = Date.now().toString().slice(-4);
        return `${prefix}-${random}-${timestamp}`;
    };

    const handleRegisterClick = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
        setShowConfirmation(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const code = generateRegistrationCode();
        
        try {
            const { error } = await supabase
                .from('event_registrations')
                .insert([{
                    event_id: selectedEvent.id,
                    attendee_name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    ticket_code: code,
                    status: 'confirmed'
                }]);
            
            if (error) throw error;
            
            setRegistrationCode(code);
            setShowConfirmation(true);

            // Send Confirmation Email
            await sendEmail({
                to: formData.email,
                subject: `Registration Confirmed: ${selectedEvent.title}`,
                html: `
                    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #2C3E50;">Registration Confirmed</h2>
                        <p>Hi ${formData.name},</p>
                        <p>You are successfully registered for <strong>${selectedEvent.title}</strong>.</p>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px dashed #ccc;">
                            <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase;">Ticket Code</p>
                            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #E67E22; letter-spacing: 2px;">${code}</p>
                        </div>

                        <p><strong>Event Details:</strong></p>
                        <ul>
                            <li><strong>Date:</strong> ${selectedEvent.month} ${selectedEvent.day} at ${selectedEvent.time}</li>
                            <li><strong>Location:</strong> ${selectedEvent.location}</li>
                        </ul>
                        
                        <p>Please present this ticket code at the entrance.</p>
                        <br/>
                        <p>Best regards,</p>
                        <p>The Charizomai Team</p>
                    </div>
                `,
                type: 'transactional'
            });
        } catch (error) {
            console.error('Error registering:', error);
            alert('Registration failed. Please try again.');
        }
    };

    const handlePrintCard = () => {
        window.print();
    };

    const handleDownloadCard = async () => {
        const card = document.getElementById('registration-card');
        if (!card) return;

        try {
            const canvas = await html2canvas(card, {
                scale: 2,
                backgroundColor: '#ffffff',
                logging: false
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            pdf.save(`event-ticket-${registrationCode}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    const handleCloseConfirmation = () => {
        setShowConfirmation(false);
        setIsModalOpen(false);
        setFormData({ name: '', email: '', phone: '', message: '' });
    };

    return (
        <main style={{ background: '#fff', minHeight: '100vh' }}>
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(/events-hero.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '10rem 0 8rem',
                color: 'white',
                textAlign: 'center'
            }}>
                <div className="container">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '1rem' }}
                    >
                        Events Calendar
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}
                    >
                        Join our community at these upcoming events. Together, we can make a lasting impact.
                    </motion.p>
                </div>
            </section>

            {/* Events List */}
            <section style={{ padding: '6rem 0' }}>
                <div className="container" style={{ maxWidth: '1000px' }}>
                    {events.map((event, i) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '80px 1fr auto',
                                gap: '2rem',
                                padding: '2.5rem 0',
                                borderBottom: '1px solid #e2e8f0',
                                alignItems: 'center'
                            }}
                            className="event-row"
                        >
                            {/* Date Box */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#f1f5f9',
                                borderRadius: '12px',
                                padding: '1rem 0.5rem',
                                height: '80px',
                                width: '80px'
                            }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                                    {event.month}
                                </span>
                                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--brand-navy)', lineHeight: 1 }}>
                                    {event.day}
                                </span>
                            </div>

                            {/* Event Details */}
                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                <div style={{ width: '180px', height: '120px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, display: 'none', '@media (min-width: 768px)': { display: 'block' } }}>
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        className="desktop-only-img"
                                    />
                                </div>
                                <div>
                                    <span style={{
                                        fontSize: '0.8rem',
                                        fontWeight: 700,
                                        color: 'var(--brand-green)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        marginBottom: '0.5rem',
                                        display: 'block'
                                    }}>
                                        {event.category}
                                    </span>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1e293b' }}>
                                        {event.title}
                                    </h3>
                                    <div style={{ display: 'flex', gap: '1.5rem', color: '#64748b', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Clock size={16} />
                                            {event.time}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <MapPin size={16} />
                                            {event.location}
                                        </div>
                                    </div>
                                    <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '500px', lineHeight: 1.5, margin: 0 }}>
                                        {event.description}
                                    </p>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div>
                                <button
                                    onClick={() => handleRegisterClick(event)}
                                    className="btn-outline"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '50px',
                                        fontSize: '0.95rem',
                                        whiteSpace: 'nowrap',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Register <ChevronRight size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Registration Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsModalOpen(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '20px'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: '#fff',
                                borderRadius: '4px',
                                maxWidth: '520px',
                                width: '100%',
                                maxHeight: '90vh',
                                overflow: 'auto',
                                position: 'relative',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                            }}
                        >
                            <div style={{ padding: '32px' }}>
                                {/* Close Button */}
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    style={{
                                        position: 'absolute',
                                        top: '16px',
                                        right: '16px',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#999',
                                        padding: '4px',
                                        lineHeight: 0,
                                        zIndex: 10
                                    }}
                                >
                                    <X size={20} />
                                </button>

                                {/* Modal Header */}
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '4px', letterSpacing: '-0.01em' }}>
                                    {showConfirmation ? 'Registration Confirmed' : 'Event Registration'}
                                </h2>
                                <p style={{ color: '#666', marginBottom: '28px', fontSize: '0.875rem' }}>
                                    {selectedEvent?.title}
                                </p>

                                {!showConfirmation ? (
                                    /* Registration Form */
                                    <form onSubmit={handleSubmit}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#333', marginBottom: '6px' }}>
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 12px',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '2px',
                                                        fontSize: '0.9375rem',
                                                        outline: 'none',
                                                        transition: 'border-color 0.2s',
                                                        boxSizing: 'border-box',
                                                        fontFamily: 'inherit'
                                                    }}
                                                    placeholder="John Doe"
                                                />
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#333', marginBottom: '6px' }}>
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 12px',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '2px',
                                                        fontSize: '0.9375rem',
                                                        outline: 'none',
                                                        transition: 'border-color 0.2s',
                                                        boxSizing: 'border-box',
                                                        fontFamily: 'inherit'
                                                    }}
                                                    placeholder="john@example.com"
                                                />
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#333', marginBottom: '6px' }}>
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 12px',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '2px',
                                                        fontSize: '0.9375rem',
                                                        outline: 'none',
                                                        transition: 'border-color 0.2s',
                                                        boxSizing: 'border-box',
                                                        fontFamily: 'inherit'
                                                    }}
                                                    placeholder="+233 XX XXX XXXX"
                                                />
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#333', marginBottom: '6px' }}>
                                                    Additional Notes (Optional)
                                                </label>
                                                <textarea
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    rows={3}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 12px',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '2px',
                                                        fontSize: '0.9375rem',
                                                        outline: 'none',
                                                        transition: 'border-color 0.2s',
                                                        resize: 'vertical',
                                                        fontFamily: 'inherit',
                                                        boxSizing: 'border-box'
                                                    }}
                                                    placeholder="Any questions or special requirements?"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    marginTop: '8px',
                                                    fontSize: '0.9375rem',
                                                    fontWeight: 500,
                                                    borderRadius: '2px',
                                                    cursor: 'pointer',
                                                    background: '#2C3E50',
                                                    color: '#fff',
                                                    border: 'none',
                                                    fontFamily: 'inherit',
                                                    transition: 'background 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.target.style.background = '#1a252f'}
                                                onMouseLeave={(e) => e.target.style.background = '#2C3E50'}
                                            >
                                                Submit Registration
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    /* Confirmation Card */
                                    <div id="registration-card" style={{
                                        background: '#fff',
                                        padding: '24px',
                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'
                                    }}>
                                        {/* Header with Logo */}
                                        <div style={{
                                            borderBottom: '2px solid #2C3E50',
                                            paddingBottom: '20px',
                                            marginBottom: '24px'
                                        }}>
                                            <div style={{
                                                fontSize: '1.75rem',
                                                fontWeight: 700,
                                                color: '#2C3E50',
                                                marginBottom: '4px',
                                                letterSpacing: '-0.02em'
                                            }}>
                                                CHARIZOMAI
                                            </div>
                                            <div style={{
                                                fontSize: '0.875rem',
                                                color: '#666',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.1em'
                                            }}>
                                                Foundation
                                            </div>
                                        </div>

                                        {/* Event Ticket Title */}
                                        <div style={{
                                            textAlign: 'center',
                                            marginBottom: '28px'
                                        }}>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: '#999',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.15em',
                                                marginBottom: '8px'
                                            }}>
                                                Event Registration Confirmation
                                            </div>
                                            <div style={{
                                                fontSize: '1.25rem',
                                                fontWeight: 600,
                                                color: '#1a1a1a',
                                                lineHeight: 1.3
                                            }}>
                                                {selectedEvent.title}
                                            </div>
                                        </div>

                                        {/* Registration Code */}
                                        <div style={{
                                            background: '#f8f8f8',
                                            border: '1px dashed #ccc',
                                            padding: '20px',
                                            marginBottom: '24px',
                                            textAlign: 'center'
                                        }}>
                                            <div style={{
                                                fontSize: '0.6875rem',
                                                color: '#666',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.1em',
                                                marginBottom: '8px'
                                            }}>
                                                Ticket Number
                                            </div>
                                            <div style={{
                                                fontSize: '1.5rem',
                                                fontWeight: 700,
                                                color: '#2C3E50',
                                                fontFamily: 'Courier, monospace',
                                                letterSpacing: '0.1em'
                                            }}>
                                                {registrationCode}
                                            </div>
                                        </div>

                                        {/* Event Details */}
                                        <div style={{ marginBottom: '24px' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                <tbody>
                                                    <tr>
                                                        <td style={{
                                                            padding: '10px 0',
                                                            borderBottom: '1px solid #eee',
                                                            fontSize: '0.8125rem',
                                                            color: '#666',
                                                            width: '35%'
                                                        }}>
                                                            Date
                                                        </td>
                                                        <td style={{
                                                            padding: '10px 0',
                                                            borderBottom: '1px solid #eee',
                                                            fontSize: '0.875rem',
                                                            color: '#1a1a1a',
                                                            fontWeight: 500
                                                        }}>
                                                            {selectedEvent.month} {selectedEvent.day}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{
                                                            padding: '10px 0',
                                                            borderBottom: '1px solid #eee',
                                                            fontSize: '0.8125rem',
                                                            color: '#666'
                                                        }}>
                                                            Time
                                                        </td>
                                                        <td style={{
                                                            padding: '10px 0',
                                                            borderBottom: '1px solid #eee',
                                                            fontSize: '0.875rem',
                                                            color: '#1a1a1a',
                                                            fontWeight: 500
                                                        }}>
                                                            {selectedEvent.time}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{
                                                            padding: '10px 0',
                                                            borderBottom: '1px solid #eee',
                                                            fontSize: '0.8125rem',
                                                            color: '#666'
                                                        }}>
                                                            Venue
                                                        </td>
                                                        <td style={{
                                                            padding: '10px 0',
                                                            borderBottom: '1px solid #eee',
                                                            fontSize: '0.875rem',
                                                            color: '#1a1a1a',
                                                            fontWeight: 500
                                                        }}>
                                                            {selectedEvent.location}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{
                                                            padding: '10px 0',
                                                            fontSize: '0.8125rem',
                                                            color: '#666'
                                                        }}>
                                                            Attendee
                                                        </td>
                                                        <td style={{
                                                            padding: '10px 0',
                                                            fontSize: '0.875rem',
                                                            color: '#1a1a1a',
                                                            fontWeight: 500
                                                        }}>
                                                            {formData.name}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Instructions */}
                                        <div style={{
                                            background: '#f8f8f8',
                                            padding: '16px',
                                            marginBottom: '24px',
                                            borderLeft: '3px solid #E67E22'
                                        }}>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: '#666',
                                                lineHeight: 1.6
                                            }}>
                                                <strong style={{ color: '#1a1a1a' }}>Important:</strong> Please present this ticket number at the event entrance for verification. Save this confirmation for your records.
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div style={{
                                            borderTop: '1px solid #eee',
                                            paddingTop: '16px',
                                            textAlign: 'center'
                                        }}>
                                            <div style={{
                                                fontSize: '0.6875rem',
                                                color: '#999',
                                                lineHeight: 1.5
                                            }}>
                                                For inquiries, contact us at info@charizomai.org<br />
                                                Thank you for your participation
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons - Only show when confirmation is visible */}
                                {showConfirmation && (
                                    <div style={{
                                        display: 'flex',
                                        gap: '10px',
                                        marginTop: '20px',
                                        paddingTop: '20px',
                                        borderTop: '1px solid #eee'
                                    }}>
                                        <button
                                            onClick={handleDownloadCard}
                                            style={{
                                                flex: 1,
                                                padding: '11px',
                                                fontSize: '0.875rem',
                                                fontWeight: 500,
                                                borderRadius: '2px',
                                                cursor: 'pointer',
                                                background: '#2C3E50',
                                                color: '#fff',
                                                border: 'none',
                                                fontFamily: 'inherit',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = '#1a252f'}
                                            onMouseLeave={(e) => e.target.style.background = '#2C3E50'}
                                        >
                                            Download PDF
                                        </button>
                                        <button
                                            onClick={handlePrintCard}
                                            style={{
                                                flex: 1,
                                                padding: '11px',
                                                fontSize: '0.875rem',
                                                fontWeight: 500,
                                                borderRadius: '2px',
                                                cursor: 'pointer',
                                                background: '#fff',
                                                color: '#2C3E50',
                                                border: '1px solid #ddd',
                                                fontFamily: 'inherit',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = '#f8f8f8';
                                                e.target.style.borderColor = '#2C3E50';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = '#fff';
                                                e.target.style.borderColor = '#ddd';
                                            }}
                                        >
                                            Print
                                        </button>
                                        <button
                                            onClick={handleCloseConfirmation}
                                            style={{
                                                flex: 1,
                                                padding: '11px',
                                                fontSize: '0.875rem',
                                                fontWeight: 500,
                                                borderRadius: '2px',
                                                cursor: 'pointer',
                                                background: '#fff',
                                                color: '#666',
                                                border: '1px solid #ddd',
                                                fontFamily: 'inherit',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = '#f8f8f8';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = '#fff';
                                            }}
                                        >
                                            Close
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add responsive styles for the image */}
            <style>{`
                @media (min-width: 768px) {
                    .desktop-only-img {
                        display: block !important;
                    }
                }
                @media (max-width: 767px) {
                    .desktop-only-img {
                        display: none !important;
                    }
                    .event-row {
                        grid-template-columns: 1fr !important;
                        gap: 1.5rem !important;
                        text-align: center;
                    }
                    .event-row > div:first-child {
                        margin: 0 auto;
                    }
                    .event-row > div:nth-child(2) {
                        flex-direction: column;
                        align-items: center;
                    }
                    .event-row > div:nth-child(2) > div:last-child {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .event-row > div:last-child {
                        display: flex;
                        justify-content: center;
                    }
                }
            `}</style>
        </main>
    );
}
