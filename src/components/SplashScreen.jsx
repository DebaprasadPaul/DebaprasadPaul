import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
    const [progress, setProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setIsLoaded(true);
                    return 100;
                }
                return Math.min(prev + (prev < 80 ? 4 : 2), 100);
            });
        }, 20);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed inset-0 bg-retro-bg flex flex-col items-center justify-center z-50 overflow-hidden">
            {/* Retro border frame */}
            <div className="absolute inset-4 border-2 border-retro-wood/20 pointer-events-none" />

            {/* Pixel bicycle */}
            <div className="mb-8">
                <svg width="80" height="60" viewBox="0 0 50 35">
                    <circle cx="8" cy="24" r="7" fill="none" stroke="#3B2F20" strokeWidth="1.5" />
                    <circle cx="38" cy="24" r="7" fill="none" stroke="#3B2F20" strokeWidth="1.5" />
                    <line x1="8" y1="24" x2="22" y2="10" stroke="#5F9EA0" strokeWidth="1.5" />
                    <line x1="22" y1="10" x2="38" y2="24" stroke="#5F9EA0" strokeWidth="1.5" />
                    <line x1="22" y1="10" x2="22" y2="18" stroke="#5F9EA0" strokeWidth="1.5" />
                    <line x1="8" y1="24" x2="22" y2="18" stroke="#5F9EA0" strokeWidth="1" />
                    <line x1="22" y1="18" x2="38" y2="24" stroke="#5F9EA0" strokeWidth="1" />
                    <rect x="19" y="7" width="6" height="2" fill="#3B2F20" />
                    <line x1="36" y1="8" x2="40" y2="8" stroke="#3B2F20" strokeWidth="1.5" />
                    <line x1="36" y1="8" x2="38" y2="24" stroke="#3B2F20" strokeWidth="0.8" />
                </svg>
            </div>

            {/* Title */}
            <h1 className="pixel-font text-retro-bark text-xs mb-2 tracking-wider">THE JOURNEY</h1>
            <p className="text-retro-wood text-xs mb-6">From home to where we are today</p>

            {/* Loading / Action */}
            <div className="h-16 flex items-center">
                <AnimatePresence mode="wait">
                    {!isLoaded ? (
                        <motion.div key="loading" className="text-center" exit={{ opacity: 0 }}>
                            {/* Pixel progress bar */}
                            <div className="w-48 h-3 border-2 border-retro-wood bg-retro-cream mb-2">
                                <div
                                    className="h-full bg-retro-teal transition-all duration-100"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="pixel-font text-[8px] text-retro-wood">{Math.round(progress)}%</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="ready"
                            className="flex flex-col items-center gap-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <button
                                onClick={() => navigate('/site')}
                                className="retro-card px-6 py-2 pixel-font text-[9px] text-retro-bark hover:border-retro-teal transition-colors"
                            >
                                🚲 START JOURNEY
                            </button>
                            <button
                                onClick={() => navigate('/admin')}
                                className="text-[9px] text-retro-dirt/40 hover:text-retro-wood transition-colors"
                            >
                                admin
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
