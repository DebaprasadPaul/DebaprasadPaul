import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
    const [progress, setProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate loading progress
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setIsLoaded(true);
                    return 100;
                }
                return prev + 1; // 1% every ~20ms = ~2s total load time
            });
        }, 20);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed inset-0 bg-dark-bg flex flex-col items-center justify-center z-50 overflow-hidden">
            <AnimatePresence>
                {!isLoaded ? (
                    <motion.div
                        key="loader"
                        className="relative flex flex-col items-center justify-center"
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.5 } }}
                    >
                        {/* Logo Container */}
                        <div className="relative w-32 h-32 flex items-center justify-center mb-8">
                            {/* Circular Arc Loader */}
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="58"
                                    stroke="rgba(34, 211, 238, 0.1)"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <motion.circle
                                    cx="64"
                                    cy="64"
                                    r="58"
                                    stroke="#22d3ee"
                                    strokeWidth="4"
                                    fill="none"
                                    strokeDasharray="364" // 2 * PI * 58 ≈ 364
                                    strokeDashoffset="364"
                                    animate={{ strokeDashoffset: 364 - (364 * progress) / 100 }}
                                    transition={{ duration: 0.1, ease: "linear" }}
                                    strokeLinecap="round"
                                />
                            </svg>

                            {/* Logo Text */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-accent-cyan to-cyan-600"
                            >
                                DP
                            </motion.div>
                        </div>

                        {/* Percentage Text */}
                        <motion.div
                            className="text-accent-cyan font-mono text-lg tracking-wider"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {progress}%
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="actions"
                        className="flex flex-col items-center gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="mb-8"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-center">
                                Debaprasad Paul
                            </h1>
                            <p className="text-text-secondary text-center text-lg">
                                Financial Operations & Systems Architect
                            </p>
                        </motion.div>

                        <div className="flex flex-col md:flex-row gap-6 w-full max-w-md px-6">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/site')}
                                className="w-full py-4 px-8 bg-accent-cyan text-dark-bg font-bold rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all text-lg"
                            >
                                View Work
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05, borderColor: '#22d3ee', color: '#22d3ee' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/admin')}
                                className="w-full py-4 px-8 bg-transparent border border-dark-border text-text-secondary font-semibold rounded-xl hover:bg-dark-border/30 transition-all text-lg"
                            >
                                Admin Login
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
