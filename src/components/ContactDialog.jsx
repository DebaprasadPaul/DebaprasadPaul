import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../game/AudioContext';
import emailjs from '@emailjs/browser';

// EmailJS config — set these in your .env file:
//   VITE_EMAILJS_SERVICE_ID
//   VITE_EMAILJS_TEMPLATE_ID
//   VITE_EMAILJS_PUBLIC_KEY
const EMAILJS_SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
const isEmailJSConfigured = !!(EMAILJS_SERVICE && EMAILJS_TEMPLATE && EMAILJS_KEY);

export default function ContactDialog({ isOpen, onClose, email = 'deba90020@gmail.com' }) {
    const { playSfx } = useAudio();
    const [form, setForm] = useState({ email: '', subject: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle | sending | sent | error

    const handleClose = () => {
        playSfx('close');
        setStatus('idle');
        onClose();
    };

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.subject || !form.message) return;

        setStatus('sending');

        if (isEmailJSConfigured) {
            try {
                await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
                    from_email: form.email,
                    subject: form.subject,
                    message: form.message,
                    to_email: email,
                }, EMAILJS_KEY);

                setStatus('sent');
                setForm({ email: '', subject: '', message: '' });
            } catch (err) {
                console.error('EmailJS error:', err);
                setStatus('error');
            }
        } else {
            // Fallback to mailto
            window.open(`mailto:${email}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(form.message + '\n\nFrom: ' + form.email)}`);
            setStatus('sent');
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '8px 10px',
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 8,
        color: '#3B2F20',
        background: '#F5EDD6',
        border: '2px solid #C4A870',
        outline: 'none',
        boxSizing: 'border-box',
    };

    const labelStyle = {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 8,
        color: '#5C4033',
        marginBottom: 4,
        display: 'block',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(44,30,18,0.7)',
                            zIndex: 100,
                            backdropFilter: 'blur(2px)',
                        }}
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 30 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 101,
                            width: '90%',
                            maxWidth: 480,
                        }}
                    >
                        <div style={{
                            background: '#FFF8E7',
                            border: '3px solid #3B2F20',
                            boxShadow: '6px 6px 0 #3B2F20',
                        }}>
                            {/* Header bar */}
                            <div style={{ height: 5, background: '#C89B3C' }} />

                            {/* Title row */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '14px 18px 10px',
                                borderBottom: '1px solid #D4C4A0',
                            }}>
                                <h2 className="pixel-font" style={{
                                    fontSize: 12,
                                    color: '#3B2F20',
                                    letterSpacing: '0.08em',
                                    margin: 0,
                                }}>
                                    📬 Get In Touch
                                </h2>
                                <button
                                    onClick={handleClose}
                                    style={{
                                        background: '#3B2F20',
                                        color: '#E8DCC6',
                                        border: 'none',
                                        width: 26,
                                        height: 26,
                                        cursor: 'pointer',
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Form */}
                            <div style={{ padding: '16px 18px 20px' }}>
                                {status === 'sent' ? (
                                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                        <p className="pixel-font" style={{ fontSize: 11, color: '#3B2F20', marginBottom: 8 }}>
                                            ✅ Message Sent!
                                        </p>
                                        <p style={{ ...labelStyle, color: '#8B7355' }}>
                                            Thank you for reaching out.
                                        </p>
                                        <button
                                            onClick={handleClose}
                                            style={{
                                                marginTop: 16,
                                                padding: '8px 20px',
                                                background: '#3B2F20',
                                                color: '#E8DCC6',
                                                border: 'none',
                                                fontFamily: "'Press Start 2P', monospace",
                                                fontSize: 8,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Close
                                        </button>
                                    </div>
                                ) : status === 'error' ? (
                                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                        <p className="pixel-font" style={{ fontSize: 11, color: '#8B0000', marginBottom: 8 }}>
                                            ❌ Failed to Send
                                        </p>
                                        <p style={{ ...labelStyle, color: '#8B7355' }}>
                                            Please try again or email directly.
                                        </p>
                                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
                                            <button
                                                onClick={() => setStatus('idle')}
                                                style={{
                                                    padding: '8px 20px',
                                                    background: '#3B2F20',
                                                    color: '#E8DCC6',
                                                    border: 'none',
                                                    fontFamily: "'Press Start 2P', monospace",
                                                    fontSize: 8,
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Try Again
                                            </button>
                                            <a
                                                href={`mailto:${email}`}
                                                style={{
                                                    padding: '8px 20px',
                                                    background: '#5C4033',
                                                    color: '#E8DCC6',
                                                    textDecoration: 'none',
                                                    fontFamily: "'Press Start 2P', monospace",
                                                    fontSize: 8,
                                                }}
                                            >
                                                Email Directly
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        {!isEmailJSConfigured && (
                                            <p style={{ ...labelStyle, color: '#C89B3C', fontSize: 7, marginBottom: 12 }}>
                                                ⚠ EmailJS not configured — will open your mail app instead.
                                            </p>
                                        )}
                                        <div style={{ marginBottom: 14 }}>
                                            <label style={labelStyle}>Your Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="you@example.com"
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div style={{ marginBottom: 14 }}>
                                            <label style={labelStyle}>Subject</label>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={form.subject}
                                                onChange={handleChange}
                                                required
                                                placeholder="What's this about?"
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div style={{ marginBottom: 18 }}>
                                            <label style={labelStyle}>Message</label>
                                            <textarea
                                                name="message"
                                                value={form.message}
                                                onChange={handleChange}
                                                required
                                                rows={5}
                                                placeholder="Write your message here..."
                                                style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={status === 'sending'}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                background: status === 'sending' ? '#8B7355' : '#3B2F20',
                                                color: '#E8DCC6',
                                                border: '2px solid #5C4033',
                                                fontFamily: "'Press Start 2P', monospace",
                                                fontSize: 9,
                                                cursor: status === 'sending' ? 'wait' : 'pointer',
                                                letterSpacing: '0.05em',
                                                transition: 'background 0.2s',
                                            }}
                                            onMouseEnter={(e) => { if (status !== 'sending') e.target.style.background = '#5C4033'; }}
                                            onMouseLeave={(e) => { if (status !== 'sending') e.target.style.background = '#3B2F20'; }}
                                        >
                                            {status === 'sending' ? '⏳ Sending...' : '📨 Send Message'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
