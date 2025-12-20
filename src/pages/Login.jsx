import { motion } from 'framer-motion';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Login() {
    const navigate = useNavigate();
    const [step, setStep] = useState('email'); // 'email' or 'password'
    const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            setEmailError('Please fill out this field.');
        } else {
            setEmailError('');
            setStep('password');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setLoading(true);

        try {
            const { data, error } = mode === 'signup' 
                ? await supabase.auth.signUp({ email, password })
                : await supabase.auth.signInWithPassword({ email, password });

            if (error) throw error;

            if (data.user) {
                // Check User Status
                const { data: roleData, error: roleFetchError } = await supabase
                    .from('user_roles')
                    .select('status')
                    .eq('email', email)
                    .single();

                if (roleData && (roleData.status === 'suspended' || roleData.status === 'inactive')) {
                    await supabase.auth.signOut();
                    throw new Error(`Your account is ${roleData.status}. Please contact support.`);
                }

                // Update or Create User Role Entry
                // If the user didn't exist in user_roles (roleData is null), we must provide a role.
                const updates = {
                    email: email,
                    last_login: new Date().toISOString(),
                    // Only set default role/status if creating a new row
                    ...( !roleData ? { role: 'admin', status: 'active' } : {} ) 
                };

                const { error: roleError } = await supabase
                    .from('user_roles')
                    .upsert(updates, { onConflict: 'email' });

                if (roleError) {
                    console.error('Error updating user role:', roleError);
                }

                navigate('/admin');
            }
        } catch (error) {
            console.error('Auth error:', error);
            setPasswordError(error.message || 'Failed to authenticate');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setMode(mode === 'signin' ? 'signup' : 'signin');
        setStep('email');
        setEmailError('');
        setPasswordError('');
    };

    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F7F7F7',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decorative Circles */}
            <div style={{
                position: 'absolute',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.4)',
                top: '-200px',
                left: '-200px',
                filter: 'blur(60px)'
            }} />
            <div style={{
                position: 'absolute',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.3)',
                bottom: '-150px',
                right: '-150px',
                filter: 'blur(60px)'
            }} />

            {/* Login Card */}
            <motion.div
                style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '2rem 2rem',
                    maxWidth: '380px',
                    width: '100%',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                    position: 'relative',
                    zIndex: 1
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h1 style={{
                        fontSize: '1.3rem',
                        fontWeight: 700,
                        color: '#E67E22',
                        margin: 0
                    }}>
                        charizomai
                    </h1>
                </div>

                {step === 'email' ? (
                    <>
                        {/* Welcome Text */}
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{
                                fontSize: '1.75rem',
                                fontWeight: 700,
                                color: '#1a1a1a',
                                marginBottom: '0.5rem'
                            }}>
                                Welcome
                            </h2>
                            <p style={{
                                fontSize: '0.95rem',
                                color: '#6B7280',
                                margin: 0
                            }}>
                                {mode === 'signin' 
                                    ? 'Sign in to Charizomai to continue.' 
                                    : 'Create a new account to get started.'}
                            </p>
                        </div>

                        {/* Social Login Buttons */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <button style={{
                                width: '100%',
                                padding: '0.75rem',
                                marginBottom: '0.6rem',
                                background: 'white',
                                border: '1px solid #D1D5DB',
                                borderRadius: '50px',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                color: '#1a1a1a',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                transition: 'all 0.2s ease'
                            }}
                                onMouseEnter={(e) => e.target.style.background = '#F9FAFB'}
                                onMouseLeave={(e) => e.target.style.background = 'white'}
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18">
                                    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
                                    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
                                    <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" />
                                    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" />
                                </svg>
                                Continue with Google
                            </button>

                            <button style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'white',
                                border: '1px solid #D1D5DB',
                                borderRadius: '50px',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                color: '#1a1a1a',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                transition: 'all 0.2s ease'
                            }}
                                onMouseEnter={(e) => e.target.style.background = '#F9FAFB'}
                                onMouseLeave={(e) => e.target.style.background = 'white'}
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                                    <path d="M14.94 5.19A4.38 4.38 0 0 0 16 2.5C16 2.27 15.77 2 15.5 2c-.77 0-1.87.27-2.94.94A4.38 4.38 0 0 0 10 2c-1.06 0-2.06.34-2.87.94A4.38 4.38 0 0 0 4.19 2C3.96 2 3.73 2.23 3.73 2.5c0 .77.27 1.87.94 2.94A4.38 4.38 0 0 0 4 8c0 1.06.34 2.06.94 2.87A4.38 4.38 0 0 0 4 13.81c0 .27.23.5.5.5.77 0 1.87-.27 2.94-.94A4.38 4.38 0 0 0 10 14c1.06 0 2.06-.34 2.87-.94A4.38 4.38 0 0 0 15.81 14c.27 0 .5-.23.5-.5 0-.77-.27-1.87-.94-2.94A4.38 4.38 0 0 0 16 8c0-1.06-.34-2.06-.94-2.87z" />
                                </svg>
                                Continue with Apple
                            </button>
                        </div>

                        {/* Divider */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            margin: '1.25rem 0',
                            gap: '0.75rem'
                        }}>
                            <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
                            <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>or</span>
                            <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
                        </div>

                        {/* Email Form */}
                        <form onSubmit={handleEmailSubmit}>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setEmailError('');
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '0.9rem 1rem',
                                        border: emailError ? '2px solid #EF4444' : '1px solid #D1D5DB',
                                        borderRadius: '8px',
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        transition: 'border-color 0.2s ease'
                                    }}
                                    onFocus={(e) => {
                                        if (!emailError) e.target.style.borderColor = '#9CA3AF';
                                    }}
                                    onBlur={(e) => {
                                        if (!emailError) e.target.style.borderColor = '#D1D5DB';
                                    }}
                                />
                                {emailError && (
                                    <p style={{
                                        color: '#EF4444',
                                        fontSize: '0.85rem',
                                        marginTop: '0.5rem',
                                        marginBottom: 0
                                    }}>
                                        {emailError}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    background: '#E67E22',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50px',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'background 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#D35400'}
                                onMouseLeave={(e) => e.target.style.background = '#E67E22'}
                            >
                                Continue
                            </button>
                        </form>

                        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                            <button 
                                onClick={toggleMode}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#E67E22',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                {mode === 'signin' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                            </button>
                        </div>

                        {/* Footer Text */}
                        <p style={{
                            fontSize: '0.8rem',
                            color: '#9CA3AF',
                            textAlign: 'center',
                            marginTop: '1.5rem',
                            lineHeight: 1.5
                        }}>
                            This site is protected by reCAPTCHA and the Google{' '}
                            <a href="#" style={{ color: '#9CA3AF', textDecoration: 'underline' }}>Privacy Policy</a> and{' '}
                            <a href="#" style={{ color: '#9CA3AF', textDecoration: 'underline' }}>Terms of Service</a> apply.
                        </p>
                    </>
                ) : (
                    <>
                        {/* Sign In Title */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <h2 style={{
                                fontSize: '1.6rem',
                                fontWeight: 700,
                                color: '#1a1a1a',
                                margin: 0,
                                letterSpacing: '-0.02em'
                            }}>
                                {mode === 'signin' ? 'Sign in' : 'Sign up'}
                            </h2>
                        </div>

                        {/* Password Form */}
                        <form onSubmit={handlePasswordSubmit}>
                            {/* Email Display (Read-only) */}
                            <div style={{ marginBottom: '0.75rem' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.8rem',
                                    color: '#6B7280',
                                    marginBottom: '0.4rem',
                                    fontWeight: 500
                                }}>
                                    Email Address
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="email"
                                        value={email}
                                        readOnly
                                        style={{
                                            width: '100%',
                                            padding: '0.7rem 1rem',
                                            border: '2px solid #E67E22',
                                            borderRadius: '8px',
                                            fontSize: '0.9rem',
                                            outline: 'none',
                                            background: '#FFF7ED',
                                            color: '#1a1a1a',
                                            fontWeight: 500,
                                            cursor: 'not-allowed'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setStep('email')}
                                        style={{
                                            position: 'absolute',
                                            right: '0.75rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem',
                                            color: '#E67E22',
                                            fontWeight: 600,
                                            padding: '0.25rem 0.5rem'
                                        }}
                                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                    >
                                        Change
                                    </button>
                                </div>
                            </div>

                            {/* Password Input */}
                            <div style={{ marginBottom: '0.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.8rem',
                                    color: '#6B7280',
                                    marginBottom: '0.4rem',
                                    fontWeight: 500
                                }}>
                                    Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setPasswordError('');
                                        }}
                                        autoFocus
                                        style={{
                                            width: '100%',
                                            padding: '0.7rem 3rem 0.7rem 1rem',
                                            border: passwordError ? '2px solid #EF4444' : '2px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '0.9rem',
                                            outline: 'none',
                                            transition: 'all 0.2s ease',
                                            background: 'white'
                                        }}
                                        onFocus={(e) => {
                                            if (!passwordError) {
                                                e.target.style.borderColor = '#E67E22';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(230, 126, 34, 0.1)';
                                            }
                                        }}
                                        onBlur={(e) => {
                                            if (!passwordError) {
                                                e.target.style.borderColor = '#E5E7EB';
                                                e.target.style.boxShadow = 'none';
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '0.75rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '0.4rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: '#9CA3AF',
                                            transition: 'color 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = '#6B7280'}
                                        onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {passwordError && (
                                    <p style={{
                                        color: '#EF4444',
                                        fontSize: '0.85rem',
                                        marginTop: '0.5rem',
                                        marginBottom: 0
                                    }}>
                                        {passwordError}
                                    </p>
                                )}
                            </div>

                            {/* Forgot Password Link */}
                            <div style={{ marginBottom: '1.25rem', textAlign: 'right' }}>
                                <a href="#" style={{
                                    fontSize: '0.85rem',
                                    color: '#E67E22',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    transition: 'opacity 0.2s ease'
                                }}
                                    onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                                >
                                    Forgot your password?
                                </a>
                            </div>

                            {/* Sign In Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #E67E22 0%, #D35400 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontSize: '0.95rem',
                                    fontWeight: 700,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: loading ? 'none' : '0 4px 12px rgba(230, 126, 34, 0.3)',
                                    letterSpacing: '0.3px'
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 6px 20px rgba(230, 126, 34, 0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading) {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(230, 126, 34, 0.3)';
                                    }
                                }}
                            >
                                {loading ? 'Processing...' : (mode === 'signin' ? 'Sign in' : 'Sign up')}
                            </button>

                            {/* Terms Text */}
                            <p style={{
                                fontSize: '0.7rem',
                                color: '#9CA3AF',
                                lineHeight: 1.4,
                                marginTop: '1rem',
                                textAlign: 'center',
                                marginBottom: 0
                            }}>
                                By signing in, you agree to our{' '}
                                <a href="#" style={{ color: '#E67E22', textDecoration: 'none', fontWeight: 500 }}
                                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                >Terms of Service</a> and{' '}
                                <a href="#" style={{ color: '#E67E22', textDecoration: 'none', fontWeight: 500 }}
                                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                >Privacy Policy</a>
                            </p>
                        </form>
                    </>
                )}
            </motion.div>
        </main>
    );
}
