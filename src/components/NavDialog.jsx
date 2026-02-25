import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../game/AudioContext';

export default function NavDialog({ isOpen, onClose, title, content }) {
    const { playSfx } = useAudio();

    const handleClose = () => {
        playSfx('close');
        onClose();
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
                            maxWidth: 560,
                            maxHeight: '80vh',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <div style={{
                            background: '#FFF8E7',
                            border: '3px solid #3B2F20',
                            boxShadow: '6px 6px 0 #3B2F20',
                            display: 'flex',
                            flexDirection: 'column',
                            maxHeight: '80vh',
                        }}>
                            {/* Header bar */}
                            <div style={{
                                height: 5,
                                background: '#5F9EA0',
                            }} />

                            {/* Title row */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '14px 18px 10px',
                                borderBottom: '1px solid #D4C4A0',
                            }}>
                                <h2 className="pixel-font" style={{
                                    fontSize: 13,
                                    color: '#3B2F20',
                                    letterSpacing: '0.08em',
                                    margin: 0,
                                }}>
                                    {title}
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

                            {/* Content — scrollable */}
                            <div style={{
                                padding: '16px 18px 20px',
                                overflowY: 'auto',
                                flex: 1,
                            }}>
                                {content.split('\n').map((line, i) => (
                                    <p key={i} style={{
                                        fontFamily: "'Press Start 2P', monospace",
                                        fontSize: 9,
                                        lineHeight: 2,
                                        color: '#5C4033',
                                        marginBottom: line.trim() === '' ? 12 : 6,
                                    }}>
                                        {line || '\u00A0'}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
