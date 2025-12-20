
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Lock, ChevronDown, Info, ChevronLeft, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePaystackPayment } from 'react-paystack';
import './DonationModal.css';

import { createPortal } from 'react-dom';

export default function DonationModal({ isOpen, onClose }) {
    const [frequency, setFrequency] = useState('once'); // 'once' or 'monthly'
    const [selectedAmount, setSelectedAmount] = useState(85);
    const [customAmount, setCustomAmount] = useState('');
    const [showSecurityTooltip, setShowSecurityTooltip] = useState(false);
    const [isDedication, setIsDedication] = useState(false);
    const [view, setView] = useState('main'); // 'main' | 'comment' | 'upsell' | 'details'
    const [comment, setComment] = useState('');
    const [honoreeName, setHonoreeName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);

    const amounts = [10, 20, 30, 50, 75, 100];

    const handleAmountClick = (amt) => {
        setSelectedAmount(amt);
        setCustomAmount('');
    };

    const paystackConfig = {
        reference: (new Date()).getTime().toString(),
        email: email,
        amount: (customAmount || selectedAmount) * 100, // Amount is in pesewas (GHS cents)
        publicKey: 'pk_test_d6511e6d1947z234567890123456789012345678', // REPLACE WITH YOUR ACTUAL PAYSTACK PUBLIC KEY
        currency: 'GHS',
    };

    const initializePayment = usePaystackPayment(paystackConfig);

    const onPaystackSuccess = (reference) => {
        // Implementation for whatever you want to do with reference and after success call.
        console.log(reference);
        alert("Thanks for your donation! Reference: " + reference.reference);
        onClose();
    };

    const onPaystackClose = () => {
        // implementation for  whatever you want to do when the Paystack dialog closed.
        console.log('Paystack closed');
    }

    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="donation-overlay" onClick={onClose}>
                    {/* Main Content Wrapper - Two Separate Cards */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="donation-container"
                    >
                         {/* Close Button - Desktop (Outside or corner of right card) */}
                         <button 
                            onClick={onClose}
                            className="donation-close-btn"
                        >
                            <X size={32} />
                        </button>

                        {/* LEFT CARD - Visuals & Description */}
                        <div className="donation-card visuals">
                            
                            {/* Image Collage Area */}
                            <div style={{ 
                                height: '260px', 
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                 {/* Custom Collage Grid Layout for 5 images */}
                                 <div className="collage-grid">
                                    {/* Main Focus Image */}
                                    <div style={{ background: "url('/donation-1.jpg') center/cover no-repeat" }}></div>
                                    
                                    {/* Middle Column */}
                                    <div style={{ display: 'grid', gridTemplateRows: '50% 50%' }}>
                                         <div style={{ background: "url('/donation-2.jpg') center/cover no-repeat" }}></div>
                                         <div style={{ background: "url('/donation-3.jpg') center/cover no-repeat" }}></div>
                                    </div>

                                    {/* Right Column */}
                                    <div style={{ display: 'grid', gridTemplateRows: '50% 50%' }}>
                                         <div style={{ background: "url('/donation-4.jpg') center/cover no-repeat" }}></div>
                                         <div style={{ background: "url('/donation-5.jpg') center/cover no-repeat" }}></div>
                                    </div>
                                 </div>
                            </div>

                            <div style={{ padding: '2rem' }}>
                                {/* Logo & Trust Badges */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <img src="/logo.jpg" alt="Logo" style={{ width: '40px', height: 'auto' }} />
                                        <span style={{ fontWeight: 800, color: '#2c3e50', fontSize: '1.1rem' }}>Charizomai</span>
                                    </div>
                                    <span style={{ color: '#64748B', fontSize: '0.9rem' }}>in support of</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                         {/* Placeholder for partner logo if needed, using text for now to match style */}
                                         <span style={{ fontWeight: 700, color: '#e67e22' }}>Families in Ghana</span>
                                    </div>
                                </div>

                                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', lineHeight: 1.3 }}>
                                    Stand with families this season
                                </h3>
                                
                                <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                    Your year-end gift protects health where it’s needed most. 
                                    This year, Charizomai responded to over 50 health emergencies and helped deliver millions of vaccines and supplies.
                                </p>
                                
                                <a href="#" style={{ color: '#1a1a1a', fontWeight: 700, fontSize: '1rem', textDecoration: 'underline' }}>Learn more</a>
                            </div>
                        </div>

                        {/* RIGHT CARD - Donation Form OR Comment View */}
                        <div className="donation-card form">
                            
                            <AnimatePresence mode="wait">
                                {view === 'main' ? (
                                    <motion.div 
                                        key="main"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="donation-view-content"
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '2rem' }}>
                                            <div style={{ 
                                                width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #10B981', 
                                                display: 'flex', alignItems: 'center', justifyContent: 'center' 
                                            }}>
                                                <Lock size={16} color="#10B981" strokeWidth={3} />
                                            </div>
                                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B' }}>Secure donation</span>
                                        </div>

                                        {/* Frequency Toggle */}
                                        <div style={{ 
                                            display: 'flex', 
                                            gap: '1rem',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <button 
                                                onClick={() => setFrequency('once')}
                                                style={{
                                                    flex: 1,
                                                    padding: '0.8rem',
                                                    borderRadius: '6px',
                                                    background: 'white',
                                                    border: frequency === 'once' ? '2px solid #e67e22' : '1px solid #E2E8F0',
                                                    color: frequency === 'once' ? '#e67e22' : '#64748B',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                Give once
                                            </button>
                                            <button 
                                                onClick={() => setFrequency('monthly')}
                                                style={{
                                                    flex: 1,
                                                    padding: '0.8rem',
                                                    borderRadius: '6px',
                                                    background: frequency === 'monthly' ? '#fff7ed' : 'white', // Light orange bg on active
                                                    border: frequency === 'monthly' ? '2px solid #e67e22' : '2px solid #e67e22', // Always orange border
                                                    color: '#1E293B',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '6px',
                                                    transition: 'all 0.2s',
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                <Heart size={16} fill="#F43F5E" color="#F43F5E" /> Monthly
                                            </button>
                                        </div>

                                        {/* Amount Grid */}
                                        <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: 'repeat(3, 1fr)', 
                                            gap: '12px',
                                            marginBottom: '1rem' 
                                        }}>
                                            {amounts.map(amt => (
                                                <button
                                                    key={amt}
                                                    onClick={() => handleAmountClick(amt)}
                                                    style={{
                                                        padding: '0.8rem',
                                                        background: 'white',
                                                        border: selectedAmount === amt && !customAmount ? '2px solid #e67e22' : '1px solid #CBD5E1',
                                                        borderRadius: '8px',
                                                        color: '#1E293B',
                                                        fontWeight: 500,
                                                        fontSize: '1.1rem',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    ₵{amt}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Custom Amount Input */}
                                        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                                            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.5rem', color: '#1E293B', fontWeight: 600 }}>₵</span>
                                            <input 
                                                type="number" 
                                                value={customAmount ? customAmount : (selectedAmount || '')}
                                                onChange={(e) => {
                                                    setCustomAmount(e.target.value);
                                                    setSelectedAmount(null);
                                                }}
                                                style={{
                                                    width: '100%',
                                                    padding: '1rem 1rem 1rem 3rem', // Reduced padding slightly as symbol is shorter
                                                    fontSize: '1.5rem',
                                                    fontWeight: 400,
                                                    border: '2px solid #e67e22', // Active orange border
                                                    borderRadius: '8px',
                                                    outline: 'none',
                                                    color: '#1E293B'
                                                }}
                                            />
                                            <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '4px', color: '#64748B', fontSize: '1rem', cursor: 'pointer' }}>
                                                GHS <ChevronDown size={16} />
                                            </div>
                                        </div>

                                        {/* Dedication Checkbox */}
                                        <div style={{ marginBottom: 'auto', position: 'relative' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: isDedication ? '1rem' : '2rem', userSelect: 'none' }}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={isDedication}
                                                    onChange={(e) => setIsDedication(e.target.checked)}
                                                    style={{ width: '20px', height: '20px', borderRadius: '4px', border: '1px solid #CBD5E1', accentColor: '#e67e22' }} 
                                                />
                                                <span style={{ color: '#475569', fontSize: '1rem' }}>Dedicate this donation</span>
                                            </label>

                                            <AnimatePresence>
                                                {isDedication && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                        animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                        style={{ position: 'relative', overflow: 'visible' }}
                                                    >
                                                        <input 
                                                            type="text" 
                                                            placeholder="Honoree name"
                                                            value={honoreeName}
                                                            onChange={(e) => setHonoreeName(e.target.value)}
                                                            style={{
                                                                width: '100%',
                                                                padding: '0.8rem 1rem',
                                                                fontSize: '1rem',
                                                                border: '2px solid #e67e22',
                                                                borderRadius: '8px',
                                                                outline: 'none',
                                                                color: '#1E293B',
                                                                background: '#fff'
                                                            }}
                                                        />
                                                        
                                                        {/* Explanatory Tooltip Bubble */}
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: '-10px',
                                                            left: '105%',
                                                            width: '280px',
                                                            background: 'white',
                                                            padding: '1rem',
                                                            borderRadius: '8px',
                                                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                                            fontSize: '0.9rem',
                                                            color: '#334155',
                                                            lineHeight: '1.5',
                                                            zIndex: 10
                                                        }}>
                                                            After completing your donation, you will see options to write a personalized message and send a card with your dedication
                                                            
                                                            {/* Triangle Pointer */}
                                                            <div style={{
                                                                position: 'absolute',
                                                                top: '20px',
                                                                left: '-6px',
                                                                width: '12px',
                                                                height: '12px',
                                                                background: 'white',
                                                                transform: 'rotate(45deg)',
                                                                boxShadow: '-2px 2px 2px rgba(0,0,0,0.05)'
                                                            }}></div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            
                                            {!isDedication && (
                                                <>
                                                    <div style={{ padding: '0 0 0.5rem' }}>
                                                        <p style={{ margin: 0, fontSize: '0.95rem', color: '#334155' }}>Designate to Where It Is Most Needed</p>
                                                    </div>
                                                    
                                                    <div 
                                                        onClick={() => setView('comment')}
                                                        style={{ 
                                                            color: '#1a1a1a', fontSize: '0.9rem', textDecoration: 'underline', fontWeight: 500, cursor: 'pointer', display: 'inline-block' 
                                                        }}
                                                    >
                                                        Add comment
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Main Button */}
                                        <button 
                                            onClick={() => {
                                                if (isDedication && honoreeName.trim()) {
                                                    setView('upsell');
                                                } else {
                                                    // Standard donate flow (mock)
                                                    console.log('Donating...', { amount: customAmount || selectedAmount, frequency, isDedication, honoreeName, comment });
                                                    onClose();
                                                }
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '1rem',
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                background: '#e67e22', // Brand orange
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                marginTop: '2rem',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.background = '#d35400'}
                                            onMouseOut={(e) => e.currentTarget.style.background = '#e67e22'}
                                        >
                                            {frequency === 'monthly' ? 'Donate monthly' : 'Donate'}
                                        </button>
                                        
                                    </motion.div>
                                ) : view === 'upsell' ? (
                                    <motion.div
                                        key="upsell"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        style={{ 
                                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                                            background: 'white', zIndex: 20, 
                                            display: 'flex', flexDirection: 'column'
                                        }}
                                    >
                                        {/* Header Bar */}
                                        <div style={{ 
                                            background: '#FFF7ED', // Light orange
                                            padding: '0.8rem', 
                                            textAlign: 'center', 
                                            color: '#1E293B', 
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px'
                                        }}>
                                            <Heart size={14} fill="#F43F5E" color="#F43F5E" />
                                            Dedicated to <span style={{ fontWeight: 700 }}>{honoreeName}</span>
                                        </div>

                                        <div className="donation-view-content">
                                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', position: 'relative' }}>
                                                <button 
                                                    onClick={() => setView('main')}
                                                    style={{ 
                                                        background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
                                                        display: 'flex', alignItems: 'center'
                                                    }}
                                                >
                                                    <ChevronLeft size={24} color="#1e293b" />
                                                </button>
                                                <h3 style={{ 
                                                    flex: 1, textAlign: 'center', margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#1e293b',
                                                    paddingRight: '24px' // Balance the back button
                                                }}>
                                                    Make this gift every year
                                                </h3>
                                            </div>

                                            <div style={{ 
                                                flex: 1, 
                                                display: 'flex', 
                                                flexDirection: 'column', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                paddingBottom: '32px' 
                                            }}>
                                                {/* Custom Calendar Icon */}
                                                <div style={{ 
                                                    width: '120px', 
                                                    height: '110px', 
                                                    background: '#BFDBFE', // Soft blue base
                                                    borderRadius: '16px',
                                                    marginBottom: '24px',
                                                    position: 'relative',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    paddingTop: '20px'
                                                }}>
                                                    {/* Calendar rings */}
                                                    <div style={{ position: 'absolute', top: '-10px', left: '25px', width: '12px', height: '24px', background: '#93C5FD', borderRadius: '6px' }}></div>
                                                    <div style={{ position: 'absolute', top: '-10px', left: 'auto', right: '25px', width: '12px', height: '24px', background: '#93C5FD', borderRadius: '6px' }}></div>
                                                    
                                                    {/* Calendar Content */}
                                                    <div style={{ 
                                                        width: '100px', 
                                                        height: '80px', 
                                                        background: '#EFF6FF', 
                                                        borderRadius: '8px', 
                                                        display: 'grid', 
                                                        gridTemplateColumns: 'repeat(4, 1fr)', 
                                                        gridTemplateRows: 'repeat(3, 1fr)', 
                                                        gap: '4px',
                                                        padding: '8px'
                                                    }}>
                                                        {[...Array(12)].map((_, i) => (
                                                            <div key={i} style={{ background: '#DBEAFE', borderRadius: '2px' }}></div>
                                                        ))}
                                                    </div>
                                                    
                                                    {/* Floating Heart */}
                                                    <div style={{ 
                                                        position: 'absolute', 
                                                        top: '50%', 
                                                        left: '50%', 
                                                        transform: 'translate(-50%, -50%)',
                                                        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                                                    }}>
                                                         <Heart size={48} fill="#F43F5E" color="#FFFFFF" strokeWidth={2} />
                                                    </div>
                                                </div>

                                                <p style={{ 
                                                    textAlign: 'center', 
                                                    fontSize: '1.05rem', 
                                                    color: '#334155', 
                                                    maxWidth: '300px', 
                                                    lineHeight: 1.5 
                                                }}>
                                                    You can automatically give <span style={{ fontWeight: 700 }}>₵{customAmount || selectedAmount}</span> every year by becoming an annual donor.
                                                </p>
                                            </div>

                                            <div style={{ paddingBottom: '32px' }}>
                                                <button 
                                                    style={{
                                                        width: '100%',
                                                        padding: '1rem',
                                                        fontSize: '1.1rem',
                                                        fontWeight: 600,
                                                        background: '#e67e22',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '8px',
                                                        marginBottom: '1rem',
                                                        transition: 'background 0.2s'
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.background = '#d35400'}
                                                    onMouseOut={(e) => e.currentTarget.style.background = '#e67e22'}
                                                    onClick={() => {
                                                         setFrequency('monthly'); // Upgrade frequency
                                                         setView('details');
                                                    }}
                                                >
                                                    <Heart size={20} fill="white" color="white" />
                                                    Give ₵{customAmount || selectedAmount}/year
                                                </button>
                                                
                                                <button 
                                                    onClick={() => {
                                                        setFrequency('once');
                                                        setView('details');
                                                    }}
                                                    style={{ 
                                                        width: '100%', 
                                                        background: 'transparent', 
                                                        border: 'none', 
                                                        color: '#334155', 
                                                        fontSize: '0.95rem', 
                                                        textDecoration: 'underline', 
                                                        cursor: 'pointer' 
                                                    }}
                                                >
                                                    No, keep my one-time ₵{customAmount || selectedAmount} gift
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : view === 'comment' ? (
                                    <motion.div 
                                        key="comment"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        style={{ 
                                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                                            background: 'white', zIndex: 20, padding: '2.5rem',
                                            display: 'flex', flexDirection: 'column'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', position: 'relative' }}>
                                            <button 
                                                onClick={() => setView('main')}
                                                style={{ 
                                                    background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
                                                    display: 'flex', alignItems: 'center'
                                                }}
                                            >
                                                <ChevronLeft size={24} color="#1e293b" />
                                            </button>
                                            <h3 style={{ 
                                                flex: 1, textAlign: 'center', margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#1e293b',
                                                paddingRight: '24px' // Balance the back button
                                            }}>
                                                Comment
                                            </h3>
                                        </div>

                                        <div style={{ flex: 1, marginBottom: '2rem' }}>
                                            <textarea
                                                placeholder="Enter your comment"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    border: '2px solid #e67e22',
                                                    borderRadius: '8px',
                                                    padding: '1rem',
                                                    fontSize: '1rem',
                                                    color: '#334155',
                                                    resize: 'none',
                                                    outline: 'none',
                                                    fontFamily: "inherit"
                                                }}
                                            />
                                        </div>

                                        <button 
                                            onClick={() => setView('main')}
                                            style={{
                                                width: '100%',
                                                padding: '1rem',
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                background: '#e67e22',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.background = '#d35400'}
                                            onMouseOut={(e) => e.currentTarget.style.background = '#e67e22'}
                                        >
                                            Save
                                        </button>
                                    </motion.div>
                                ) : view === 'details' ? (
                                    <motion.div 
                                        key="details"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        style={{ 
                                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                                            background: 'white', zIndex: 20,
                                            display: 'flex', flexDirection: 'column'
                                        }}
                                    >
                                        {/* Header Bar */}
                                        <div style={{ 
                                            background: '#FFF7ED', // Light orange
                                            padding: '0.8rem', 
                                            textAlign: 'center', 
                                            color: '#1E293B', 
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px'
                                        }}>
                                            <Heart size={14} fill="#F43F5E" color="#F43F5E" />
                                            Dedicated to <span style={{ fontWeight: 700 }}>{honoreeName}</span>
                                        </div>

                                        <div className="donation-view-content">
                                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', position: 'relative' }}>
                                                <button 
                                                    onClick={() => setView('upsell')}
                                                    style={{ 
                                                        background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
                                                        display: 'flex', alignItems: 'center'
                                                    }}
                                                >
                                                    <ChevronLeft size={24} color="#1e293b" />
                                                </button>
                                                <h3 style={{ 
                                                    flex: 1, textAlign: 'center', margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#1e293b',
                                                    paddingRight: '24px' // Balance the back button
                                                }}>
                                                    Enter your details
                                                </h3>
                                            </div>

                                            {/* Standard Professional Inputs */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '2rem' }}>
                                                {/* Name Row */}
                                                <div className="name-row">
                                                    <div style={{ flex: 1 }}>
                                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>First name</label>
                                                        <input 
                                                            type="text" 
                                                            value={firstName}
                                                            onChange={(e) => setFirstName(e.target.value)}
                                                            style={{
                                                                width: '100%',
                                                                padding: '10px 12px',
                                                                borderRadius: '8px',
                                                                border: '1px solid #CBD5E1',
                                                                fontSize: '1rem',
                                                                outline: 'none',
                                                                color: '#1E293B',
                                                                background: '#fff',
                                                                transition: 'border-color 0.2s',
                                                            }}
                                                            onFocus={(e) => {
                                                                e.target.style.borderColor = '#e67e22';
                                                                e.target.style.boxShadow = '0 0 0 2px rgba(230, 126, 34, 0.1)';
                                                            }}
                                                            onBlur={(e) => {
                                                                e.target.style.borderColor = '#CBD5E1';
                                                                e.target.style.boxShadow = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>Last name</label>
                                                        <input 
                                                            type="text" 
                                                            value={lastName}
                                                            onChange={(e) => setLastName(e.target.value)}
                                                            style={{
                                                                width: '100%',
                                                                padding: '10px 12px',
                                                                borderRadius: '8px',
                                                                border: '1px solid #CBD5E1',
                                                                fontSize: '1rem',
                                                                outline: 'none',
                                                                color: '#1E293B',
                                                                background: '#fff',
                                                                transition: 'border-color 0.2s',
                                                            }}
                                                            onFocus={(e) => {
                                                                e.target.style.borderColor = '#e67e22';
                                                                e.target.style.boxShadow = '0 0 0 2px rgba(230, 126, 34, 0.1)';
                                                            }}
                                                            onBlur={(e) => {
                                                                e.target.style.borderColor = '#CBD5E1';
                                                                e.target.style.boxShadow = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Email Link */}
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>Email address</label>
                                                    <input 
                                                        type="email" 
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '10px 12px',
                                                            borderRadius: '8px',
                                                            border: '1px solid #CBD5E1',
                                                            fontSize: '1rem',
                                                            outline: 'none',
                                                            color: '#1E293B',
                                                            background: '#fff',
                                                            transition: 'border-color 0.2s',
                                                        }}
                                                        onFocus={(e) => {
                                                            e.target.style.borderColor = '#e67e22';
                                                            e.target.style.boxShadow = '0 0 0 2px rgba(230, 126, 34, 0.1)';
                                                        }}
                                                        onBlur={(e) => {
                                                            e.target.style.borderColor = '#CBD5E1';
                                                            e.target.style.boxShadow = 'none';
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Checkbox */}
                                            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', marginBottom: '2rem' }}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={isTermsAccepted}
                                                    onChange={(e) => setIsTermsAccepted(e.target.checked)}
                                                    style={{ 
                                                        width: '20px', 
                                                        height: '20px', 
                                                        borderRadius: '4px', 
                                                        border: '1px solid #CBD5E1', 
                                                        accentColor: '#e67e22',
                                                        marginTop: '2px' 
                                                    }} 
                                                />
                                                <div style={{ fontSize: '0.95rem', color: '#1E293B', lineHeight: '1.5' }}>
                                                    I agree to <a href="#" style={{ color: '#1E293B', textDecoration: 'underline' }}>Terms and Conditions</a> & <a href="#" style={{ color: '#1E293B', textDecoration: 'underline' }}>Privacy Notice</a>
                                                </div>
                                            </label>

                                            <button 
                                                style={{
                                                    width: '100%',
                                                    padding: '1rem',
                                                    fontSize: '1.1rem',
                                                    fontWeight: 600,
                                                    background: '#e67e22',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    marginTop: 'auto',
                                                    transition: 'background 0.2s',
                                                    opacity: (!firstName || !lastName || !email || !isTermsAccepted) ? 0.7 : 1,
                                                    pointerEvents: (!firstName || !lastName || !email || !isTermsAccepted) ? 'none' : 'auto'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.background = '#d35400'}
                                                onMouseOut={(e) => e.currentTarget.style.background = '#e67e22'}
                                                onClick={() => {
                                                     // Basic validation passed (button text is Continue)
                                                     setView('payment');
                                                }}
                                            >
                                                Continue
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : view === 'payment' ? (
                                    <motion.div 
                                        key="payment"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        style={{ 
                                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                                            background: 'white', zIndex: 20,
                                            display: 'flex', flexDirection: 'column'
                                        }}
                                    >
                                        {/* Header Bar */}
                                        <div style={{ 
                                            background: '#FFF7ED', 
                                            padding: '0.8rem', 
                                            textAlign: 'center', 
                                            color: '#1E293B', 
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px'
                                        }}>
                                            <Lock size={14} color="#10B981" />
                                            Secure Payment
                                        </div>

                                        <div className="donation-view-content">
                                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', position: 'relative' }}>
                                                <button 
                                                    onClick={() => setView('details')}
                                                    style={{ 
                                                        background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
                                                        display: 'flex', alignItems: 'center'
                                                    }}
                                                >
                                                    <ChevronLeft size={24} color="#1e293b" />
                                                </button>
                                                <h3 style={{ 
                                                    flex: 1, textAlign: 'center', margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#1e293b',
                                                    paddingRight: '24px'
                                                }}>
                                                    Payment method
                                                </h3>
                                            </div>

                                            {/* Summary Card */}
                                            <div style={{ 
                                                background: '#F8FAFC', 
                                                borderRadius: '12px', 
                                                padding: '16px', 
                                                marginBottom: '24px',
                                                border: '1px solid #E2E8F0'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                    <span style={{ color: '#64748B', fontSize: '0.9rem' }}>Amount ({frequency})</span>
                                                    <span style={{ fontWeight: 700, color: '#1E293B' }}>₵{customAmount || selectedAmount}</span>
                                                </div>
                                                {isDedication && honoreeName && (
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ color: '#64748B', fontSize: '0.9rem' }}>Dedicated to</span>
                                                        <span style={{ fontWeight: 600, color: '#e67e22', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <Heart size={12} fill="#e67e22" /> {honoreeName}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Paystack Info Card */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '2rem' }}>
                                                <div style={{ position: 'relative' }}>
                                                     <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '8px' }}>Payment provider</label>
                                                     <div style={{ 
                                                         border: '1px solid #CBD5E1', 
                                                         borderRadius: '8px', 
                                                         background: 'white',
                                                         padding: '16px',
                                                         display: 'flex',
                                                         alignItems: 'center',
                                                         justifyContent: 'space-between'
                                                     }}>
                                                         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                             <div style={{
                                                                 width: '32px', height: '32px', borderRadius: '50%', background: '#09A4DB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold'
                                                             }}>
                                                                 P
                                                             </div>
                                                             <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                 <span style={{ fontWeight: 600, color: '#1E293B' }}>Paystack</span>
                                                                 <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Secure online payments</span>
                                                             </div>
                                                         </div>
                                                         <Lock size={16} color="#10B981" />
                                                     </div>
                                                     <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '8px', lineHeight: 1.5 }}>
                                                         You will be redirected to Paystack's secure checkout to complete your donation of <span style={{ fontWeight: 600 }}>₵{customAmount || selectedAmount}</span>.
                                                     </p>
                                                </div>
                                            </div>

                                            <button 
                                                style={{
                                                    width: '100%',
                                                    padding: '1rem',
                                                    fontSize: '1.1rem',
                                                    fontWeight: 600,
                                                    background: '#e67e22',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    marginTop: 'auto',
                                                    transition: 'background 0.2s',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.background = '#d35400'}
                                                onMouseOut={(e) => e.currentTarget.style.background = '#e67e22'}
                                                onClick={() => {
                                                    initializePayment(onPaystackSuccess, onPaystackClose)
                                                }}
                                            >
                                                Pay ₵{customAmount || selectedAmount}
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>
                            
                        </div>
                    </motion.div>

                    {/* Footer Links */}
                    <div style={{ marginTop: '1.5rem', color: '#CBD5E1', fontSize: '0.9rem', display: 'flex', gap: '1.5rem', position: 'relative' }}>
                         <div 
                            style={{ position: 'relative' }}
                            onMouseEnter={() => setShowSecurityTooltip(true)}
                            onMouseLeave={() => setShowSecurityTooltip(false)}
                         >
                            <span style={{ cursor: 'pointer', borderBottom: '1px dotted #CBD5E1' }}>Is my donation secure?</span>
                            
                            {/* Security Tooltip */}
                            {showSecurityTooltip && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        position: 'absolute',
                                        bottom: '100%',
                                        left: '0', // Align left with the text, or center if preferred. Let's try centering or slightly left.
                                        transform: 'translateX(-20%)', // Shift a bit to center roughly or adjust specific to design
                                        marginBottom: '10px',
                                        width: '320px',
                                        background: 'white',
                                        padding: '1.5rem',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                                        color: '#334155',
                                        zIndex: 1000,
                                        textAlign: 'left',
                                        lineHeight: '1.5',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <h4 style={{ color: '#1E293B', fontWeight: 700, marginBottom: '0.8rem', fontSize: '1rem' }}>Is my donation secure?</h4>
                                    <p style={{ marginBottom: '0.8rem' }}>
                                        Yes, we use industry-standard SSL technology to keep your information secure.
                                    </p>
                                    <p style={{ marginBottom: '0.8rem' }}>
                                        We partner with Stripe, the industry's established payment processor trusted by some of the world's largest companies.
                                    </p>
                                    <p style={{ margin: 0 }}>
                                        Your sensitive financial information never touches our servers. We send all data directly to Stripe's PCI-compliant servers through SSL.
                                    </p>
                                    
                                    {/* Triangle pointer */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '-8px',
                                        left: '20%', // Match the transform alignment roughly
                                        width: '16px',
                                        height: '16px',
                                        background: 'white',
                                        transform: 'rotate(45deg)',
                                        boxShadow: '4px 4px 6px rgba(0,0,0,0.05)' // Subtle shadow to match
                                    }}></div>
                                </motion.div>
                            )}
                         </div>

                         <span style={{ cursor: 'pointer', borderBottom: '1px dotted #CBD5E1' }}>Can I cancel my recurring donation?</span>
                    </div>

                </div>
            )}
            

        </AnimatePresence>,
        document.body
    );
}

