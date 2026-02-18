import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { smoothScrollTo } from '../utils/smoothScroll';

const NAV_LINKS = [
    { label: 'Philosophy', href: '#philosophy' },
    { label: 'Case Study', href: '#casestudy' },
    { label: 'Blueprint', href: '#blueprint' },
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' },
    { label: 'AI Engineering', href: '#ai-engineering' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);

    // Track scroll for floating transition
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Intersection Observer for active section
    useEffect(() => {
        const sectionIds = ['hero', 'philosophy', 'casestudy', 'blueprint', 'experience', 'skills', 'ai-engineering', 'contact'];
        const observers = [];
        const observedIds = new Set();
        let intervalId;

        const connectObservers = () => {
            let allFound = true;

            sectionIds.forEach((id) => {
                if (observedIds.has(id)) return;

                const el = document.getElementById(id);
                if (el) {
                    const observer = new IntersectionObserver(
                        ([entry]) => {
                            if (entry.isIntersecting) setActiveSection(id);
                        },
                        { rootMargin: '-45% 0px -45% 0px' }
                    );
                    observer.observe(el);
                    observers.push(observer);
                    observedIds.add(id);
                } else {
                    allFound = false;
                }
            });

            if (allFound) {
                clearInterval(intervalId);
            }
        };

        // Initial check
        connectObservers();

        // Poll for lazy-loaded sections
        intervalId = setInterval(connectObservers, 500);

        return () => {
            clearInterval(intervalId);
            observers.forEach((o) => o.disconnect());
        };
    }, []);

    // Lock body scroll on mobile menu
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const handleNavClick = useCallback((e, href) => {
        e.preventDefault();
        setMobileOpen(false);
        smoothScrollTo(href);
    }, []);

    return (
        <>
            {/* Outer wrapper — handles the floating positioning */}
            <div
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                    padding: scrolled ? '8px 16px' : '0',
                }}
            >
                <motion.nav
                    animate={{
                        y: 0,
                        opacity: 1,
                        maxWidth: scrolled ? 880 : 1400,
                        borderRadius: scrolled ? 9999 : 0,
                        background: scrolled
                            ? 'rgba(15, 15, 20, 0.6)'
                            : 'rgba(15, 15, 20, 0)',
                        backdropFilter: scrolled ? 'blur(24px) saturate(1.8)' : 'blur(0px)',
                        WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(1.8)' : 'blur(0px)',
                        border: scrolled
                            ? '1px solid rgba(34, 211, 238, 0.1)'
                            : '1px solid rgba(0,0,0,0)',
                        boxShadow: scrolled
                            ? '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.04)'
                            : '0 0px 0px rgba(0, 0, 0, 0)',
                        padding: scrolled ? '0 16px' : '0 0px',
                    }}
                    initial={{ y: -80, opacity: 0, maxWidth: 1400, borderRadius: 0 }}
                    transition={{
                        y: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                        opacity: { duration: 0.6 },
                        maxWidth: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                        borderRadius: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                        background: { duration: 0.4, ease: 'easeOut' },
                        backdropFilter: { duration: 0.4 },
                        WebkitBackdropFilter: { duration: 0.4 },
                        border: { duration: 0.3 },
                        boxShadow: { duration: 0.5, ease: 'easeOut' },
                        padding: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                    }}
                    style={{ margin: '0 auto' }}
                >
                    <motion.div
                        className="mx-auto px-6 flex items-center justify-between"
                        animate={{ height: scrolled ? 46 : 56 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Logo */}
                        <a
                            href="#hero"
                            onClick={(e) => handleNavClick(e, '#hero')}
                            className="group flex items-center gap-2"
                        >
                            <div className="w-10 h-10 -ml-2 flex items-center justify-center text-text-primary group-hover:text-accent-cyan transition-colors duration-300">
                                <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
                                    <defs>
                                        <mask id="nav-cat-mask">
                                            <rect width="100" height="100" fill="white" />
                                            <motion.circle
                                                cx="35" cy="55" r="6" fill="black"
                                                animate={{ scaleY: [1, 0.1, 1, 1, 1] }}
                                                transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1, 0.5, 1] }}
                                            />
                                            <motion.circle
                                                cx="65" cy="55" r="6" fill="black"
                                                animate={{ scaleY: [1, 0.1, 1, 1, 1] }}
                                                transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1, 0.5, 1], delay: 0.1 }}
                                            />
                                        </mask>
                                    </defs>
                                    <path
                                        d="M 20 80 Q 20 40 30 40 L 25 10 L 40 25 Q 50 20 60 25 L 75 10 L 70 40 Q 80 40 80 80 Z"
                                        fill="currentColor"
                                        mask="url(#nav-cat-mask)"
                                    />
                                </svg>
                            </div>
                            <span className="hidden sm:inline text-[10px] text-text-muted font-medium tracking-wider uppercase">
                                GlitchedFolio
                            </span>
                        </a>

                        {/* Desktop links */}
                        <div className="hidden md:flex items-center gap-0.5">
                            {NAV_LINKS.map((link) => {
                                const isActive = activeSection === link.href.slice(1);
                                return (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        onClick={(e) => handleNavClick(e, link.href)}
                                        className="relative px-2.5 py-1.5 text-[12px] font-medium transition-colors duration-200 rounded-md group"
                                    >
                                        <span className={isActive ? 'text-accent-cyan' : 'text-text-secondary group-hover:text-text-primary'}>
                                            {link.label}
                                        </span>
                                        {isActive && (
                                            <motion.span
                                                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent-cyan z-10"
                                                style={{ boxShadow: '0 0 10px rgba(34, 211, 238, 1)' }}
                                                layoutId="nav-dot"
                                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                            />
                                        )}
                                    </a>
                                );
                            })}

                            {/* CTA */}
                            <a
                                href="#contact"
                                onClick={(e) => handleNavClick(e, '#contact')}
                                className="ml-3 px-5 py-2 text-[12px] font-semibold rounded-full border border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan hover:text-dark-bg transition-all duration-300"
                            >
                                Contact
                            </a>
                        </div>

                        {/* Mobile hamburger */}
                        <button
                            className="md:hidden relative w-10 h-10 flex items-center justify-center -mr-2"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle menu"
                        >
                            <div className="flex flex-col items-end gap-[5px]">
                                <motion.span
                                    className="block h-[2px] bg-text-primary rounded-full origin-right"
                                    animate={{
                                        width: mobileOpen ? 20 : 20,
                                        rotate: mobileOpen ? -45 : 0,
                                        translateY: mobileOpen ? -3 : 0,
                                    }}
                                    transition={{ duration: 0.3 }}
                                />
                                <motion.span
                                    className="block h-[2px] bg-text-primary rounded-full"
                                    animate={{
                                        width: mobileOpen ? 0 : 14,
                                        opacity: mobileOpen ? 0 : 1,
                                    }}
                                    transition={{ duration: 0.2 }}
                                />
                                <motion.span
                                    className="block h-[2px] bg-text-primary rounded-full origin-right"
                                    animate={{
                                        width: mobileOpen ? 20 : 16,
                                        rotate: mobileOpen ? 45 : 0,
                                        translateY: mobileOpen ? 3 : 0,
                                    }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </button>
                    </motion.div>
                </motion.nav>
            </div>

            {/* Mobile fullscreen overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 bg-dark-bg/95 backdrop-blur-2xl flex flex-col items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <nav className="flex flex-col items-center gap-6">
                            {NAV_LINKS.map((link, i) => (
                                <motion.a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className={`text-2xl font-semibold transition-colors ${activeSection === link.href.slice(1)
                                        ? 'text-accent-cyan'
                                        : 'text-text-secondary hover:text-text-primary'
                                        }`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ delay: i * 0.06, duration: 0.3 }}
                                >
                                    {link.label}
                                </motion.a>
                            ))}

                            <motion.a
                                href="#contact"
                                onClick={(e) => handleNavClick(e, '#contact')}
                                className="mt-4 px-8 py-3 text-lg font-semibold rounded-full border border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-dark-bg transition-all duration-300"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: NAV_LINKS.length * 0.06, duration: 0.3 }}
                            >
                                Contact
                            </motion.a>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
