import { motion, AnimatePresence } from 'framer-motion';

export default function Station({ children, title, index, isActive, onToggle }) {
    const isLeft = index % 2 === 0;

    return (
        <div
            className={`relative w-full flex ${isLeft ? 'justify-start' : 'justify-end'}`}
            style={{ minHeight: '400px' }}
        >
            <motion.div
                className={`w-full max-w-xl ${isLeft ? 'ml-4 md:ml-16' : 'mr-4 md:mr-16'}`}
                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                {/* Station header */}
                <button onClick={onToggle} className="w-full text-left group">
                    <div className="retro-card p-5 md:p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-heading text-2xl md:text-3xl text-park-text-primary font-bold">
                                {title}
                            </h3>
                            <motion.div
                                animate={{ rotate: isActive ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-nature-green text-xl"
                            >
                                ▼
                            </motion.div>
                        </div>
                    </div>
                </button>

                {/* Expandable content */}
                <AnimatePresence>
                    {isActive && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                            className="overflow-hidden"
                        >
                            <div className="retro-card mt-2 p-5 md:p-6 border-t-0 rounded-t-none">
                                {children}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
