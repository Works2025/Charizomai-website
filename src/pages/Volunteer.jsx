import { useState } from 'react';

import { supabase } from '../supabase';
import { sendEmail } from '../utils/emailService';
import { Check, AlertCircle, BookOpen, Stethoscope, Hammer, ChevronRight } from 'lucide-react';

export default function Volunteer() {
    const [status, setStatus] = useState(null); // 'loading', 'success', 'error'
    console.log("Volunteer page rendered - version 2"); // Debug log 
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        location: '',
        profession: '',
        skills: '',
        role_interest: '',
        availability: '',
        experience_level: '',
        languages: '',
        motivation: '',
        emergency_name: '',
        emergency_phone: '',
        agreed: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleNext = () => {
        if (step === 1) {
            if (!formData.full_name || !formData.email || !formData.phone) return alert('Please fill in all required fields.');
        }
        if (step === 2) {
             if (!formData.availability) return alert('Please select your availability.');
        }
        setStep(prev => prev + 1);
        window.scrollTo({ top: document.getElementById('application-form').offsetTop - 100, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('loading');

        try {
            const { error } = await supabase
                .from('volunteers')
                .insert([
                    {
                        full_name: formData.full_name,
                        email: formData.email,
                        phone: formData.phone,
                        skills: formData.skills,
                        availability: formData.availability,
                        // Appending extra details to motivation since schema doesn't have metadata columns
                        motivation: `${formData.motivation}\n\n--- Application Details ---\nRole: ${formData.role_interest}\nProfession: ${formData.profession}\nLocation: ${formData.location}\nExperience: ${formData.experience_level}\nLanguages: ${formData.languages}\nEmergency Contact: ${formData.emergency_name} (${formData.emergency_phone})`,
                        status: 'pending'
                    }
                ]);

            if (error) throw error;
            setStatus('success');
            
            // Send Application Received Email
            await sendEmail({
                to: formData.email,
                subject: 'Application Received - Charizomai Foundation',
                html: `
                    <div style="font-family: sans-serif; color: #333; padding: 20px;">
                        <h2>Thank you, ${formData.full_name}!</h2>
                        <p>We have received your request to volunteer with the Charizomai Foundation.</p>
                        <p>Our team will review your application and get back to you shortly regarding the next steps.</p>
                        <br/>
                        <p><strong>Your Details:</strong></p>
                        <ul>
                            <li>Role: ${formData.role_interest}</li>
                            <li>Availability: ${formData.availability}</li>
                        </ul>
                        <br/>
                        <p>Thank you for your willingness to serve.</p>
                        <p>Warm regards,<br/>The Charizomai Team</p>
                    </div>
                `,
                type: 'transactional'
            });

            setStep(1); 
            setFormData({
                full_name: '', email: '', phone: '', location: '', profession: '',
                skills: '', role_interest: '', availability: '', experience_level: '', languages: '',
                motivation: '', emergency_name: '', emergency_phone: '', agreed: false
            });
        } catch (error) {
            console.error('Error submitting application:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    // --- Styles ---
    const primaryColor = '#E67E22';
    
    const sectionStyle = {
        padding: '100px 0',
        background: '#fff'
    };

    const labelStyle = { 
        display: 'block', 
        fontSize: '0.875rem', 
        fontWeight: 500, 
        color: '#374151', 
        marginBottom: '6px' 
    };

    const inputStyle = { 
        width: '100%', 
        padding: '12px 16px', 
        borderRadius: '8px', 
        border: '1px solid #d1d5db', 
        fontSize: '0.95rem', 
        outline: 'none', 
        background: '#fff', 
        color: '#111827',
        transition: 'border-color 0.2s, box-shadow 0.2s'
    };

    const focusStyle = (e) => {
        e.target.style.borderColor = primaryColor;
        e.target.style.boxShadow = `0 0 0 3px ${primaryColor}15`;
    };

    const blurStyle = (e) => {
        e.target.style.borderColor = '#d1d5db';
        e.target.style.boxShadow = 'none';
    };

    return (
        <main>
            {/* Hero Section with Background Image */}
            <section style={{
                background: 'linear-gradient(rgba(17, 24, 39, 0.75), rgba(17, 24, 39, 0.85)), url(https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                padding: '120px 0 100px',
                position: 'relative',
                color: 'white'
            }}>
                <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
                    <div>
                        <span style={{ 
                            display: 'inline-block', 
                            padding: '8px 20px', 
                            borderRadius: '50px', 
                            background: 'rgba(255, 255, 255, 0.15)', 
                            backdropFilter: 'blur(10px)',
                            color: '#fff', 
                            fontSize: '0.85rem', 
                            fontWeight: 600, 
                            marginBottom: '24px',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                            Join the Mission
                        </span>
                        <h1 style={{ 
                            fontSize: '3.5rem', 
                            fontWeight: 800, 
                            color: '#ffffff', 
                            marginBottom: '24px', 
                            lineHeight: 1.1,
                            letterSpacing: '-0.03em',
                            textShadow: '0 4px 20px rgba(0,0,0,0.3)'
                        }}>
                            Your Time Can Change Lives.
                        </h1>
                        <p style={{ fontSize: '1.25rem', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.9)', margin: '0 auto', maxWidth: '600px' }}>
                            We believe in the power of community. Whether you're a teacher, medic, or just someone who cares, we have a place for you.
                        </p>
                    </div>
                </div>
            </section>

            {/* Clean Impact Grid */}
            <section style={{ padding: '60px 0', background: '#fff' }}>
                <div className="container" style={{ maxWidth: '1000px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                        {[
                            { icon: <BookOpen size={24} />, title: "Education", desc: "Mentor students and support classroom activities." },
                            { icon: <Stethoscope size={24} />, title: "Healthcare", desc: "Provide medical support in rural clinics." },
                            { icon: <Hammer size={24} />, title: "Development", desc: "Assist with building and infrastructure projects." }
                        ].map((item, i) => (
                            <div key={i} style={{ 
                                padding: '32px', 
                                borderRadius: '16px', 
                                border: '1px solid #f3f4f6',
                                background: '#ffffff',
                                transition: 'transform 0.2s',
                            }}>
                                <div style={{ 
                                    width: '48px', 
                                    height: '48px', 
                                    borderRadius: '12px', 
                                    background: '#fff7ed', 
                                    color: '#E67E22', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    marginBottom: '20px'
                                }}>
                                    {item.icon}
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>{item.title}</h3>
                                <p style={{ color: '#6b7280', lineHeight: 1.5, fontSize: '0.95rem' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium Clean Form Section */}
            <section id="application-form" style={{ padding: '80px 0 120px', background: '#f8fafc' }}>
                <div className="container">
                    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
                        
                        <div style={{ 
                            background: '#ffffff', 
                            borderRadius: '24px', 
                            padding: '48px', 
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)' 
                        }}>
                            
                            {/* Simple Progress Bar */}
                            <div style={{ marginBottom: '40px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <span>Step {step} of 3</span>
                                    <span>{step === 1 ? 'Personal' : step === 2 ? 'Role' : 'Confirm'}</span>
                                </div>
                                <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div 
                                        style={{ 
                                            height: '100%', 
                                            background: '#111827',
                                            width: `${(step / 3) * 100}%`,
                                            transition: 'width 0.3s ease'
                                        }}
                                    />
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {status === 'error' && (
                                    <div style={{ padding: '16px', background: '#fef2f2', color: '#991b1b', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <AlertCircle size={18} /> Please check your internet connection and try again.
                                    </div>
                                )}
                                
                                {status === 'success' && (
                                    <div style={{ padding: '16px', background: '#f0fdf4', color: '#166534', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Check size={18} /> Application received successfully!
                                    </div>
                                )}

                                {/* STEP 1: Personal */}
                                {step === 1 && (
                                     <div>
                                         <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', marginBottom: '8px', letterSpacing: '-0.03em' }}>Who are you?</h2>
                                         <p style={{ color: '#6b7280', marginBottom: '32px', fontSize: '1rem' }}>Tell us a bit about yourself.</p>
                                         
                                         <div style={{ display: 'grid', gap: '20px' }}>
                                             <div>
                                                 <label style={labelStyle}>Full Name</label>
                                                 <input
                                                     type="text"
                                                     name="full_name"
                                                     value={formData.full_name}
                                                     onChange={handleChange}
                                                     onFocus={focusStyle} onBlur={blurStyle}
                                                     placeholder="e.g. Adwoa Mansa"
                                                     style={inputStyle}
                                                 />
                                             </div>
                                             <div>
                                                 <label style={labelStyle}>Email Address</label>
                                                 <input
                                                     type="email"
                                                     name="email"
                                                     value={formData.email}
                                                     onChange={handleChange}
                                                     onFocus={focusStyle} onBlur={blurStyle}
                                                     placeholder="name@email.com"
                                                     style={inputStyle}
                                                 />
                                             </div>
                                             <div>
                                                 <label style={labelStyle}>Phone Number</label>
                                                 <input
                                                     type="tel"
                                                     name="phone"
                                                     value={formData.phone}
                                                     onChange={handleChange}
                                                     onFocus={focusStyle} onBlur={blurStyle}
                                                     placeholder="+233 50 000 0000"
                                                     style={inputStyle}
                                                 />
                                             </div>
                                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                 <div>
                                                     <label style={labelStyle}>City</label>
                                                     <input
                                                         type="text"
                                                         name="location"
                                                         value={formData.location}
                                                         onChange={handleChange}
                                                         onFocus={focusStyle} onBlur={blurStyle}
                                                         placeholder="Accra"
                                                         style={inputStyle}
                                                     />
                                                 </div>
                                                 <div>
                                                     <label style={labelStyle}>Profession</label>
                                                     <input
                                                         type="text"
                                                         name="profession"
                                                         value={formData.profession}
                                                         onChange={handleChange}
                                                         onFocus={focusStyle} onBlur={blurStyle}
                                                         placeholder="Teacher"
                                                         style={inputStyle}
                                                     />
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
                                )}

                                {/* STEP 2: Role */}
                                {step === 2 && (
                                     <div>
                                        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', marginBottom: '8px', letterSpacing: '-0.03em' }}>Your Impact</h2>
                                        <p style={{ color: '#6b7280', marginBottom: '32px', fontSize: '1rem' }}>Where do you want to help?</p>

                                        <div style={{ display: 'grid', gap: '20px' }}>
                                            <div>
                                                <label style={labelStyle}>Select a Role</label>
                                                <div style={{ position: 'relative' }}>
                                                    <select
                                                        name="role_interest"
                                                        value={formData.role_interest}
                                                        onChange={handleChange}
                                                        onFocus={focusStyle} onBlur={blurStyle}
                                                        style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                                                    >
                                                        <option value="">Select an option...</option>
                                                        <option value="Education">Education & Mentorship</option>
                                                        <option value="Medical">Medical & Health</option>
                                                        <option value="Construction">Construction & Logistics</option>
                                                        <option value="Tech">Technology & Media</option>
                                                        <option value="Admin">Administration</option>
                                                    </select>
                                                    <ChevronRight size={16} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%) rotate(90deg)', pointerEvents: 'none', color: '#9ca3af' }} />
                                                </div>
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Specific Skills</label>
                                                <input
                                                    type="text"
                                                    name="skills"
                                                    value={formData.skills}
                                                    onChange={handleChange}
                                                    onFocus={focusStyle} onBlur={blurStyle}
                                                    placeholder="e.g. Nursing, Web Design, Carpentry"
                                                    style={inputStyle}
                                                />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                <div>
                                                    <label style={labelStyle}>Availability</label>
                                                    <div style={{ position: 'relative' }}>
                                                        <select
                                                            name="availability"
                                                            value={formData.availability}
                                                            onChange={handleChange}
                                                            onFocus={focusStyle} onBlur={blurStyle}
                                                            style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                                                        >
                                                            <option value="">Select...</option>
                                                            <option value="Weekdays">Weekdays</option>
                                                            <option value="Weekends">Weekends</option>
                                                            <option value="Flexible">Flexible</option>
                                                        </select>
                                                        <ChevronRight size={16} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%) rotate(90deg)', pointerEvents: 'none', color: '#9ca3af' }} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label style={labelStyle}>Level</label>
                                                    <div style={{ position: 'relative' }}>
                                                        <select
                                                            name="experience_level"
                                                            value={formData.experience_level}
                                                            onChange={handleChange}
                                                            onFocus={focusStyle} onBlur={blurStyle}
                                                            style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                                                        >
                                                            <option value="">Select...</option>
                                                            <option value="Student">Student</option>
                                                            <option value="Professional">Professional</option>
                                                            <option value="Expert">Expert</option>
                                                        </select>
                                                        <ChevronRight size={16} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%) rotate(90deg)', pointerEvents: 'none', color: '#9ca3af' }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                     </div>
                                )}

                                {/* STEP 3: Finish */}
                                {step === 3 && (
                                     <div>
                                        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', marginBottom: '8px', letterSpacing: '-0.03em' }}>Ready to send?</h2>
                                        <p style={{ color: '#6b7280', marginBottom: '32px', fontSize: '1rem' }}>Last details.</p>

                                        <div style={{ display: 'grid', gap: '20px' }}>
                                            <div>
                                                <label style={labelStyle}>Motivation (Optional)</label>
                                                <textarea
                                                    name="motivation"
                                                    value={formData.motivation}
                                                    onChange={handleChange}
                                                    onFocus={focusStyle} onBlur={blurStyle}
                                                    placeholder="Why do you want to join us?"
                                                    rows={3}
                                                    style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                                                />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                <div>
                                                    <label style={labelStyle}>Emergency Contact</label>
                                                    <input
                                                        type="text"
                                                        name="emergency_name"
                                                        value={formData.emergency_name}
                                                        onChange={handleChange}
                                                        onFocus={focusStyle} onBlur={blurStyle}
                                                        placeholder="Name"
                                                        style={inputStyle}
                                                    />
                                                </div>
                                                <div>
                                                    <label style={labelStyle}>ICE Phone</label>
                                                    <input
                                                        type="tel"
                                                        name="emergency_phone"
                                                        value={formData.emergency_phone}
                                                        onChange={handleChange}
                                                        onFocus={focusStyle} onBlur={blurStyle}
                                                        placeholder="Number"
                                                        style={inputStyle}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px' }}>
                                                <label style={{ display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer' }}>
                                                    <input
                                                        type="checkbox"
                                                        name="agreed"
                                                        checked={formData.agreed}
                                                        onChange={handleChange}
                                                        style={{ width: '18px', height: '18px', accentColor: '#111827' }}
                                                    />
                                                    <span style={{ fontSize: '0.9rem', color: '#4b5563' }}>I agree to the <a href="#" style={{ color: '#111827', fontWeight: 600 }}>Code of Conduct</a>.</span>
                                                </label>
                                            </div>
                                        </div>
                                     </div>
                                )}

                                {/* Buttons */}
                                <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    {step > 1 ? (
                                        <button 
                                            type="button" 
                                            onClick={() => setStep(s => s - 1)}
                                            style={{ background: 'transparent', border: 'none', color: '#6b7280', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', padding: '12px 0' }}
                                        >
                                            Back
                                        </button>
                                    ) : <div />}

                                    <button
                                        type={step === 3 ? 'submit' : 'button'}
                                        onClick={step === 3 ? undefined : handleNext}
                                        disabled={loading}
                                        style={{
                                            background: '#111827',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '12px',
                                            padding: '14px 48px',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            cursor: loading ? 'wait' : 'pointer',
                                            opacity: loading ? 0.8 : 1,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            display: 'flex', alignItems: 'center', gap: '8px'
                                        }}
                                    >
                                        {step === 3 ? (loading ? 'Sending...' : 'Submit Application') : <>Next Step <ChevronRight size={18} /></>}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
