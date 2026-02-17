import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
    const [progress, setProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate complex loading progress (Speed Ramp: Slow -> Fast -> Slow)
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setIsLoaded(true);
                    return 100;
                }

                // Speed Ramp Logic (~0.7s Total)
                let increment = 1;
                if (prev < 30) increment = 1.5;      // Build momentum (300ms)
                else if (prev < 80) increment = 5.0; // Hyper-drive (150ms)
                else increment = 2.0;                // Smooth finish (150ms)

                // Ensure we don't overshoot 100 abruptly
                return Math.min(prev + increment, 100);
            });
        }, 15); // ~66 FPS

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed inset-0 bg-dark-bg flex flex-col items-center justify-center z-50 overflow-hidden">
            {/* Persistent Logo Container - Never Unmounts */}
            <div className="relative flex flex-col items-center justify-center mb-8">
                <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Circular Arc Loader */}
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        {/* Background Circle */}
                        <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="rgba(34, 211, 238, 0.1)"
                            strokeWidth="1.5"
                            fill="none"
                        />
                        {/* Animated Progress Circle */}
                        <motion.circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="#22d3ee"
                            strokeWidth="1.5"
                            fill="none"
                            strokeDasharray="364" // 2 * PI * 58 ≈ 364
                            strokeDashoffset="364"
                            animate={{ strokeDashoffset: 364 - (364 * progress) / 100 }}
                            transition={{ duration: 0.1, ease: "linear" }} // Smooth updates between states
                            strokeLinecap="round"
                        />
                    </svg>

                    {/* Animated Cat Logo */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <svg width="60" height="60" viewBox="0 0 100 100" className="overflow-visible">
                            <defs>
                                <mask id="cat-mask">
                                    <rect width="100" height="100" fill="white" />
                                    {/* Eyes (Cutout) */}
                                    <motion.circle
                                        cx="35" cy="55" r="5" fill="black"
                                        animate={{ scaleY: [1, 0.1, 1, 1, 1] }}
                                        transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1, 0.5, 1] }}
                                    />
                                    <motion.circle
                                        cx="65" cy="55" r="5" fill="black"
                                        animate={{ scaleY: [1, 0.1, 1, 1, 1] }}
                                        transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1, 0.5, 1], delay: 0.1 }}
                                    />
                                </mask>
                            </defs>

                            {/* Cat Head */}
                            <motion.path
                                d="M 20 80 Q 20 40 30 40 L 25 10 L 40 25 Q 50 20 60 25 L 75 10 L 70 40 Q 80 40 80 80 Z"
                                fill="#22d3ee"
                                mask="url(#cat-mask)"
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ y: 5, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
                            />
                        </svg>
                    </motion.div>
                </div>
            </div>

            {/* Swappable Content: Percentage -> Buttons */}
            <div className="h-24 flex items-center justify-center w-full">
                <AnimatePresence mode="wait">
                    {!isLoaded ? (
                        <motion.div
                            key="progress"
                            className="text-accent-cyan font-mono text-lg tracking-wider absolute"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                        >
                            {Math.round(progress)}%
                        </motion.div>
                    ) : (
                        <motion.div
                            key="actions"
                            className="flex flex-col items-center gap-4 w-full"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/site')}
                                className="w-48 py-3 px-8 bg-accent-cyan text-dark-bg font-bold rounded-full shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all text-lg tracking-wider"
                            >
                                View Work
                            </motion.button>

                            <button
                                onClick={() => navigate('/admin')}
                                className="text-text-secondary/40 hover:text-accent-cyan/80 text-xs font-medium tracking-widest uppercase transition-colors"
                            >
                                Admin
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
