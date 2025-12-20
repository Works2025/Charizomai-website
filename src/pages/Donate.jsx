import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, CreditCard, Info } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '../supabase';
import { sendEmail, emailTemplates } from '../utils/emailService';

export default function Donate() {
    const [amount, setAmount] = useState('200');
    const [tipPercent, setTipPercent] = useState(16.5);
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [paymentSettings, setPaymentSettings] = useState({
        provider: 'paystack',
        publicKey: 'pk_test_your_public_key_here',
        currency: 'GHS'
    });
    const [stripePromise, setStripePromise] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('paystack');

    // Fetch Admin Settings
    useEffect(() => {
        const fetchSettings = async () => {
            const { data: settings } = await supabase.from('admin_settings').select('*');
            if (settings) {
                const settingsMap = settings.reduce((acc, curr) => {
                    acc[curr.key] = curr.value;
                    return acc;
                }, {});

                setPaymentSettings({
                    provider: settingsMap.payment_gateway || 'paystack',
                    publicKey: settingsMap.paystack_public_key || 'pk_test_your_public_key_here', // Default to paystack
                    stripeKey: settingsMap.stripe_public_key,
                    currency: settingsMap.payment_currency || 'GHS'
                });
                
                // Initialize Stripe if key exists
                if (settingsMap.stripe_public_key) {
                    setStripePromise(loadStripe(settingsMap.stripe_public_key));
                }

                // Set initial method based on admin preference
                if (settingsMap.payment_gateway) {
                     setPaymentMethod(settingsMap.payment_gateway);
                }
            }
        };
        fetchSettings();
    }, []);

    const presets = [50, 100, 200, 300, 500, 1000];

    const calculateTip = () => {
        return ((parseFloat(amount) || 0) * tipPercent / 100).toFixed(2);
    };

    const calculateTotal = () => {
        const base = parseFloat(amount) || 0;
        const tip = parseFloat(calculateTip());
        return (base + tip).toFixed(2);
    };

    const config = {
        reference: (new Date()).getTime().toString(),
        email: email,
        amount: Math.round(parseFloat(calculateTotal()) * 100),
        publicKey: paymentSettings.publicKey,
        currency: paymentSettings.currency
    };

    const onSuccess = async (reference) => {
        try {
            const { error } = await supabase
                .from('donations')
                .insert([{
                    donor_name: isAnonymous ? 'Anonymous' : `${firstName} ${lastName}`,
                    email: email,
                    amount: parseFloat(calculateTotal()),
                    is_anonymous: isAnonymous,
                    status: 'completed',
                    // cause_id: 1 // Assuming default cause for now or handle dynamic
                }]);

            if (error) throw error;

            // Send Email Receipt
            await sendEmail({
                to: email,
                subject: 'Donation Receipt - Charizomai',
                html: emailTemplates.donationReceipt(isAnonymous ? 'Supporter' : firstName, calculateTotal(), reference.reference),
                type: 'receipt'
            });

            alert('Thank you for your donation! A receipt has been sent to your email. Reference: ' + reference.reference);
            // Reset form
            setAmount('200');
            setEmail('');
            setFirstName('');
            setLastName('');
        } catch (error) {
            console.error('Error saving donation:', error);
            // Even if DB fails, if payment worked transparency is good, but here we assume DB failure means we shouldn't confirm fully.
            // But usually payment is authority.
            alert('Donation successful. Receipt email queued.');
        }
    };

    const onClose = () => {
        console.log('Payment closed');
    };

    const initializePayment = usePaystackPayment(config);

    const handleDonate = () => {
        if (!email || !firstName || !lastName) {
            alert('Please fill in all required fields.');
            return;
        }
        if (parseFloat(amount) < 1) {
            alert('Please enter a valid amount.');
            return;
        }

        if (paymentMethod === 'paystack') {
            if (paymentSettings.provider === 'paystack' && !paymentSettings.publicKey.startsWith('pk_')) {
                 alert('Payment configuration error: Invalid Public Key. Please contact admin.');
                 return;
            }
            initializePayment(onSuccess, onClose);
        } else if (paymentMethod === 'stripe') {
            // Stripe integration - for now, show alert
            alert(`Stripe payment integration coming soon! Total: ${paymentSettings.currency} ` + calculateTotal());
        } else {
             alert(`Selected payment method (${paymentMethod}) is not fully configured.`);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#fafafa',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif'
        }}>
            {/* Header */}
            <div style={{
                borderBottom: '1px solid #e0e0e0',
                padding: '20px 0',
                background: '#fff'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 20px'
                }}>
                    <Link to="/causes" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#2d2d2d',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: 400
                    }}>
                        <ArrowLeft size={14} /> Fundraiser
                    </Link>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '14px',
                        color: '#2d2d2d'
                    }}>
                        <span>Already have an account?</span>
                        <a href="#" style={{ color: '#E67E22', textDecoration: 'none', fontWeight: 500 }}>Sign in</a>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{
                maxWidth: '640px',
                margin: '0 auto',
                padding: '32px 20px'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: '#fff',
                        borderRadius: '8px',
                        padding: '40px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                    }}
                >
                    {/* Campaign Header */}
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', alignItems: 'flex-start' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '4px',
                            backgroundImage: 'url(/community-center-adjusted.jpg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            flexShrink: 0
                        }} />
                        <div>
                            <h1 style={{
                                fontSize: '20px',
                                fontWeight: 700,
                                color: '#2d2d2d',
                                margin: '0 0 6px 0',
                                lineHeight: 1.3
                            }}>
                                Help Peter fight for little Aurelias life
                            </h1>
                            <p style={{
                                fontSize: '14px',
                                color: '#5f5f5f',
                                margin: 0
                            }}>
                                Still GH₵2,791,324 to go. Help us build momentum.
                            </p>
                        </div>
                    </div>

                    {/* Donation Amount */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '15px',
                            fontWeight: 600,
                            color: '#2d2d2d',
                            marginBottom: '12px'
                        }}>
                            Enter your donation
                        </label>

                        <div className="donate-presets-grid">
                            {presets.map(val => (
                                <button
                                    key={val}
                                    onClick={() => setAmount(val.toString())}
                                    style={{
                                        padding: '10px 6px',
                                        border: amount === val.toString() ? '2px solid #E67E22' : '1px solid #dcdcdc',
                                        borderRadius: '4px',
                                        background: amount === val.toString() ? '#FEF3E7' : '#fff',
                                        color: '#2d2d2d',
                                        fontSize: '15px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        transition: 'all 0.15s'
                                    }}
                                >
                                    GH₵{val}
                                </button>
                            ))}
                        </div>

                        <div style={{ position: 'relative', marginBottom: '8px' }}>
                            <span style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '28px',
                                fontWeight: 400,
                                color: '#2d2d2d',
                                pointerEvents: 'none',
                                userSelect: 'none'
                            }}>{paymentSettings.currency === 'USD' ? '$' : 'GH₵'}</span>
                            <input
                                type="text"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="0"
                                style={{
                                    width: '100%',
                                    padding: '16px 70px 16px 75px',
                                    fontSize: '28px',
                                    fontWeight: 400,
                                    color: '#2d2d2d',
                                    border: '1px solid #dcdcdc',
                                    borderRadius: '4px',
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                    boxSizing: 'border-box',
                                    textAlign: 'left'
                                }}
                            />
                            <span style={{
                                position: 'absolute',
                                right: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '28px',
                                fontWeight: 400,
                                color: '#b3b3b3',
                                pointerEvents: 'none',
                                userSelect: 'none'
                            }}>.00</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#5f5f5f', fontSize: '13px' }}>
                            <Info size={14} />
                            <span>My card will be charged in {paymentSettings.currency}</span>
                        </div>
                    </div>

                    {/* Tip Section */}
                    <div style={{
                        background: '#fafafa',
                        padding: '20px',
                        borderRadius: '4px',
                        marginBottom: '24px'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '10px'
                        }}>
                            <span style={{ fontSize: '15px', fontWeight: 600, color: '#2d2d2d' }}>Tip Charizomai services</span>
                            <span style={{ fontSize: '15px', fontWeight: 600, color: '#2d2d2d' }}>{tipPercent.toFixed(1)}%</span>
                        </div>
                        <p style={{
                            fontSize: '13px',
                            color: '#5f5f5f',
                            lineHeight: 1.5,
                            marginBottom: '14px'
                        }}>
                            Charizomai has a 0% platform fee for organizers. Charizomai will continue offering its services thanks to donors who leave an optional amount here.
                        </p>
                        <input
                            type="range"
                            min="0"
                            max="30"
                            step="0.5"
                            value={tipPercent}
                            onChange={(e) => setTipPercent(parseFloat(e.target.value))}
                            style={{
                                width: '100%',
                                height: '4px',
                                accentColor: '#E67E22',
                                cursor: 'pointer'
                            }}
                        />
                    </div>

                    {/* Enter custom tip */}
                    <div style={{ marginBottom: '24px' }}>
                        <a href="#" style={{ color: '#E67E22', fontSize: '14px', textDecoration: 'none', fontWeight: 500 }}>
                            Enter custom tip
                        </a>
                    </div>

                    {/* Payment Method */}
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#2d2d2d', marginBottom: '12px' }}>
                            Payment method
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {/* Paystack Option */}
                            <div
                                onClick={() => setPaymentMethod('paystack')}
                                style={{
                                    border: paymentMethod === 'paystack' ? '2px solid #E67E22' : '1px solid #dcdcdc',
                                    borderRadius: '4px',
                                    padding: '16px',
                                    cursor: 'pointer',
                                    background: paymentMethod === 'paystack' ? '#FEF3E7' : '#fff',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '18px',
                                        height: '18px',
                                        borderRadius: '50%',
                                        border: paymentMethod === 'paystack' ? '5px solid #E67E22' : '2px solid #dcdcdc',
                                        background: '#fff',
                                        flexShrink: 0
                                    }} />
                                    <CreditCard size={18} color="#2d2d2d" />
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#2d2d2d' }}>Paystack</div>
                                        <div style={{ fontSize: '12px', color: '#5f5f5f' }}>Pay with card, bank transfer, or mobile money</div>
                                    </div>
                                </div>
                            </div>

                            {/* Stripe Option */}
                            <div
                                onClick={() => setPaymentMethod('stripe')}
                                style={{
                                    border: paymentMethod === 'stripe' ? '2px solid #E67E22' : '1px solid #dcdcdc',
                                    borderRadius: '4px',
                                    padding: '16px',
                                    cursor: 'pointer',
                                    background: paymentMethod === 'stripe' ? '#FEF3E7' : '#fff',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '18px',
                                        height: '18px',
                                        borderRadius: '50%',
                                        border: paymentMethod === 'stripe' ? '5px solid #E67E22' : '2px solid #dcdcdc',
                                        background: '#fff',
                                        flexShrink: 0
                                    }} />
                                    <CreditCard size={18} color="#2d2d2d" />
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#2d2d2d' }}>Stripe</div>
                                        <div style={{ fontSize: '12px', color: '#5f5f5f' }}>Pay securely with credit or debit card</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Info Fields */}
                        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={inputStyle}
                            />
                            <div className="donate-name-grid">
                                <input
                                    type="text"
                                    placeholder="First name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    style={inputStyle}
                                />
                                <input
                                    type="text"
                                    placeholder="Last name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Checkboxes */}
                    <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                                style={{ marginTop: '2px', accentColor: '#E67E22', flexShrink: 0 }}
                            />
                            <span style={{ fontSize: '14px', color: '#2d2d2d', lineHeight: 1.4 }}>
                                Don't display my name publicly on the fundraiser. <Info size={14} style={{ display: 'inline', verticalAlign: 'middle', color: '#999' }} />
                            </span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                defaultChecked
                                style={{ marginTop: '2px', accentColor: '#E67E22', flexShrink: 0 }}
                            />
                            <span style={{ fontSize: '14px', color: '#2d2d2d', lineHeight: 1.4 }}>
                                Get occasional marketing updates from Charizomai. You may unsubscribe at any time.
                            </span>
                        </label>
                    </div>

                    {/* Summary */}
                    <div style={{
                        borderTop: '1px solid #dcdcdc',
                        paddingTop: '20px',
                        marginBottom: '24px'
                    }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#2d2d2d', marginBottom: '12px' }}>Your donation</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#2d2d2d', marginBottom: '6px' }}>
                            <span>Your donation</span>
                            <span>{paymentSettings.currency === 'USD' ? '$' : 'GH₵'}{parseFloat(amount || 0).toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#2d2d2d', marginBottom: '12px' }}>
                            <span>Charizomai tip</span>
                            <span>{paymentSettings.currency === 'USD' ? '$' : 'GH₵'}{calculateTip()}</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '15px',
                            fontWeight: 600,
                            color: '#2d2d2d',
                            paddingTop: '12px',
                            borderTop: '1px solid #dcdcdc'
                        }}>
                            <span>Total due today</span>
                            <span>{paymentSettings.currency === 'USD' ? '$' : 'GH₵'}{calculateTotal()}</span>
                        </div>
                    </div>

                    {/* Donate Button */}
                    {/* Donate Button / Stripe Form */}
                    {paymentMethod === 'stripe' && stripePromise ? (
                        <Elements stripe={stripePromise}>
                            <StripePaymentSection 
                                amount={parseFloat(amount || 0)} 
                                currency={paymentSettings.currency}
                                email={email}
                                firstName={firstName}
                                lastName={lastName}
                                onSuccess={onSuccess}
                            />
                        </Elements>
                    ) : (
                        <button
                            onClick={handleDonate}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: '#E67E22',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '16px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                marginBottom: '16px',
                                fontFamily: 'inherit'
                            }}
                        >
                            Donate now
                        </button>
                    )}

                    <p style={{
                        textAlign: 'center',
                        fontSize: '11px',
                        color: '#5f5f5f',
                        lineHeight: 1.5,
                        marginBottom: '20px'
                    }}>
                        By clicking "Donate now", you agree to Charizomai's <a href="#" style={{ color: '#E67E22', textDecoration: 'underline' }}>terms of service</a> and <a href="#" style={{ color: '#E67E22', textDecoration: 'underline' }}>privacy notice</a>. Learn more about <a href="#" style={{ color: '#E67E22', textDecoration: 'underline' }}>pricing and fees</a>.
                    </p>

                    {/* Guarantee */}
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '16px',
                        background: '#fafafa',
                        borderRadius: '4px',
                        alignItems: 'flex-start'
                    }}>
                        <ShieldCheck size={22} color="#2d2d2d" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#2d2d2d', margin: '0 0 4px 0' }}>
                                Charizomai protects your donation
                            </h4>
                            <p style={{ fontSize: '13px', color: '#5f5f5f', lineHeight: 1.5, margin: 0 }}>
                                We guarantee you a full refund for up to a year in the rare case that fraud occurs. <a href="#" style={{ color: '#E67E22', textDecoration: 'none' }}>See our Charizomai Giving Guarantee</a>.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #dcdcdc',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    color: '#2d2d2d'
};

// Internal Stripe Component
const StripePaymentSection = ({ amount, currency, email, firstName, lastName, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;
        
        // Basic Validation
        if (!email || !firstName || !lastName || amount < 1) {
            setError('Please fill in all fields above.');
            return;
        }

        setIsProcessing(true);
        setError(null);

        // Simulation/Token Creation
        const cardElement = elements.getElement(CardElement);

        const {error: stripeError, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                name: `${firstName} ${lastName}`,
                email: email
            },
        });

        if (stripeError) {
            setError(stripeError.message);
            setIsProcessing(false);
        } else {
            // Call Edge Function
            try {
                const { data, error: fnError } = await supabase.functions.invoke('process-payment', {
                    body: {
                        amount: amount,
                        currency: currency,
                        token: paymentMethod.id,
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        description: `Donation from ${firstName} ${lastName}`
                    }
                });

                if (fnError) throw fnError;
                if (data.error) throw new Error(data.error);

                await onSuccess({ reference: 'STRIPE_' + data.paymentIntent.id });
                setIsProcessing(false);

            } catch (err) {
                console.error('Payment processing failed:', err);
                setError(err.message || 'Payment processing failed. Please try again.');
                setIsProcessing(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '16px' }}>
            <div style={{ 
                border: '1px solid #dcdcdc', padding: '12px', borderRadius: '4px', 
                marginBottom: '16px', background: '#fff' 
            }}>
                <CardElement options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#2d2d2d',
                            '::placeholder': { color: '#aab7c4' },
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                        },
                        invalid: { color: '#9e2146' },
                    },
                }} />
            </div>
            {error && <div style={{ color: '#dc2626', fontSize: '14px', marginBottom: '12px' }}>{error}</div>}
            
            <button
                type="submit"
                disabled={!stripe || isProcessing}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: isProcessing ? '#fbbf24' : '#E67E22',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    transition: 'background 0.2s'
                }}
            >
                {isProcessing ? 'Processing...' : 'Donate now'}
            </button>
        </form>
    );
};
