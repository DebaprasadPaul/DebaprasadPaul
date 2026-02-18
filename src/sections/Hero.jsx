import { motion } from 'framer-motion';
import { smoothScrollTo } from '../utils/smoothScroll';

export default function Hero({ profile, metrics }) {
    const handleClick = (e, href) => {
        e.preventDefault();
        smoothScrollTo(href);
    };

    return (
        <section id="hero" className="min-h-screen flex items-center justify-center px-6 pt-24 pb-20 relative">
            <div className="max-w-5xl mx-auto text-center">

                {/* Name - Tagline removed */}

                {/* Name */}
                <motion.h1
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-text-primary mb-6 leading-[1.05] tracking-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                    {profile.name}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    className="text-lg md:text-xl text-text-secondary mb-14 max-w-2xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.55 }}
                >
                    {profile.subtitle}
                </motion.p>

                {/* Metrics Cards */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                >
                    {metrics.map((m) => (
                        <div
                            key={m.label}
                            className="bg-dark-card/60 backdrop-blur-sm border border-dark-border rounded-2xl p-6 hover:border-accent-cyan/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.08)] transition-all duration-400 group"
                        >
                            <div className="text-3xl md:text-4xl font-bold text-accent-cyan mb-1 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.4)] transition-all duration-300">
                                {m.value}
                            </div>
                            <div className="text-sm text-text-secondary">{m.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.85 }}
                >
                    <a
                        href="#contact"
                        onClick={(e) => handleClick(e, '#contact')}
                        className="bg-accent-cyan text-dark-bg px-8 py-4 rounded-xl font-semibold hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:scale-[1.02] transition-all duration-300 text-lg"
                    >
                        Let's Connect
                    </a>
                    <a
                        href="#casestudy"
                        onClick={(e) => handleClick(e, '#casestudy')}
                        className="border border-dark-border text-text-primary px-8 py-4 rounded-xl font-semibold hover:border-accent-cyan hover:text-accent-cyan transition-all duration-300 text-lg"
                    >
                        View Work
                    </a>
                </motion.div>

                {/* Scroll hint */}
                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.6 }}
                >
                    <motion.div
                        className="w-5 h-8 rounded-full border-2 border-text-muted/40 flex items-start justify-center p-1"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <motion.div
                            className="w-1 h-2 bg-text-muted/60 rounded-full"
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
}
