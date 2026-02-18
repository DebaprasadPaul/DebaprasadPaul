import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { smoothScrollTo } from '../utils/smoothScroll';

const SECTION_GROUPS = [
    {
        id: 'systems-strategy',
        label: 'Systems & Strategy',
        sections: ['philosophy', 'casestudy', 'blueprint'],
        href: '#philosophy'
    },
    {
        id: 'experience',
        label: 'Experience',
        sections: ['experience'],
        href: '#experience'
    },
    {
        id: 'engineering-skills',
        label: 'Engineering & Skills',
        sections: ['skills', 'ai-engineering'],
        href: '#skills'
    }
];

// Helper to check if we are near the contact section (for pill hiding)
const isNearContact = () => {
    const contactSection = document.getElementById('contact');
    if (!contactSection) return false;
    const rect = contactSection.getBoundingClientRect();
    return rect.top < window.innerHeight - 100; // 100px threshold
};

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [activeGroup, setActiveGroup] = useState('');
    const [scrollProgress, setScrollProgress] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showPill, setShowPill] = useState(true);

    // Refs for nav items to calculate pill position
    const navItemRefs = useRef({});
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

    // Track scroll for floating transition & pill visibility
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrolled(currentScrollY > 60);

            // Hide pill if at top (Hero) OR near bottom (Contact)
            // Show only when scrolled past Hero AND not yet at Contact
            const isAtTop = currentScrollY < 100;
            const isMobile = window.innerWidth < 768; // Optimization
            setShowPill(!isMobile && !isAtTop && !isNearContact());
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll Progress & Active Group Detection
    useEffect(() => {
        const calculateProgress = () => {
            let currentGroup = '';

            // Determine which group is currently most visible
            for (const group of SECTION_GROUPS) {
                const startEl = document.getElementById(group.sections[0]);
                const endEl = document.getElementById(group.sections[group.sections.length - 1]);

                if (startEl && endEl) {
                    const startRect = startEl.getBoundingClientRect();
                    const endRect = endEl.getBoundingClientRect();

                    const groupTop = startRect.top;
                    const groupBottom = endRect.bottom;
                    const groupHeight = groupBottom - groupTop;

                    if (groupTop < window.innerHeight / 2 && groupBottom > window.innerHeight / 2) {
                        currentGroup = group.id;

                        const scrolledInGroup = -groupTop + 100; // Offset for navbar
                        const progress = Math.min(100, Math.max(0, (scrolledInGroup / groupHeight) * 100));
                        if (window.innerWidth >= 768) {
                            setScrollProgress(progress);
                        }
                        break;
                    }
                }
            }

            if (currentGroup) {
                setActiveGroup(currentGroup);
            }
        };

        window.addEventListener('scroll', calculateProgress);
        calculateProgress();
        return () => window.removeEventListener('scroll', calculateProgress);
    }, []);

    // Update Indicator Position/Width based on active group + progress
    useEffect(() => {
        if (!activeGroup || !showPill || !navItemRefs.current[activeGroup]) {
            setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
            return;
        }

        const activeItem = navItemRefs.current[activeGroup];
        // Since the navbar container is mx-auto centered, we need relative position if we used absolute.
        // But here we are engaging inside the relative container of the nav items group.
        // We'll trust offsetLeft/offsetWidth if the parent is relative.

        const itemLeft = activeItem.offsetLeft;
        const itemWidth = activeItem.offsetWidth;

        // Logic: Start as dot (4px) in center.
        // Grow linearly to full width as scrollProgress goes 0 -> 100.
        // Actually, user wants: 
        // 1. Start as dot. 
        // 2. Grow into line (extends right).
        // 3. Move to next.

        // We'll simplify: Width maps to progress. Center stays aligned or left stays aligned?
        // User said: "Extends from center to right" -> "transform-origin: center left"

        // Let's calculate desired width
        // Min width 4px. Max width = itemWidth.
        const targetWidth = 4 + (scrollProgress / 100) * (itemWidth - 4);

        // Calculate Left position to keep it centered-ish or starting from center?
        // If it starts as a dot in the center: left = center - 2px.
        // If it grows to the right: left stays at center? No, then it's off-center.

        // User: "Extends from center to right". 
        // This implies the LEFT edge starts at center, and it grows right.
        // But then at full width it would be shifted right.
        // Usually "grows from center" means it expands both ways.

        // Let's try: Center the indicator always.
        // Left = Center of item - (CurrentWidth / 2)
        const centerOfItem = itemLeft + itemWidth / 2;
        const calculatedLeft = centerOfItem - targetWidth / 2;

        setIndicatorStyle({
            left: calculatedLeft,
            width: targetWidth,
            opacity: 1
        });

    }, [activeGroup, scrollProgress, showPill]);


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
                        maxWidth: scrolled ? 1000 : 1400,
                        borderRadius: scrolled ? 9999 : 0,
                        background: scrolled
                            ? 'rgba(15, 15, 20, 0.8)'
                            : 'rgba(15, 15, 20, 0)',
                        backdropFilter: scrolled ? 'blur(24px) saturate(1.8)' : 'blur(0px)',
                        WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(1.8)' : 'blur(0px)',
                        border: scrolled
                            ? '1px solid rgba(34, 211, 238, 0.1)'
                            : '1px solid rgba(0,0,0,0)',
                        boxShadow: scrolled
                            ? '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.04)'
                            : '0 0px 0px rgba(0, 0, 0, 0)',
                        padding: scrolled ? '0 32px' : '0 0px',
                    }}
                    initial={{ y: -80, opacity: 0, maxWidth: 1400, borderRadius: 0 }}
                    transition={{
                        y: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                        borderRadius: { duration: 0.45 },
                        padding: { duration: 0.5 },
                        background: { duration: 0.4 },
                    }}
                    style={{ margin: '0 auto' }}
                >
                    <motion.div
                        className="mx-auto px-8 flex items-center justify-between" // Refinement: px-8
                        animate={{ height: scrolled ? 60 : 72 }} // Refinement: Reduced Height (~60px)
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Logo */}
                        <a
                            href="#hero"
                            onClick={(e) => handleNavClick(e, '#hero')}
                            className="group flex items-center gap-2" // Refinement: gap-2
                        >
                            <div className="w-10 h-10 flex items-center justify-center text-text-primary group-hover:text-accent-cyan transition-colors duration-300">
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
                            {/* Refinement: GlitchedFolio in Uppercase style */}
                            <span className="hidden sm:inline text-xl font-semibold tracking-tight text-white uppercase transition-colors">
                                GlitchedFolio
                            </span>
                        </a>

                        {/* Desktop links */}
                        <div className="hidden md:flex items-center gap-6 relative"> {/* Refinement: gap-6 */}
                            {SECTION_GROUPS.map((group) => {
                                const isActive = activeGroup === group.id;
                                return (
                                    <div
                                        key={group.id}
                                        className="relative flex flex-col items-center"
                                        ref={el => navItemRefs.current[group.id] = el}
                                    >
                                        <a
                                            href={group.href}
                                            onClick={(e) => handleNavClick(e, group.href)}
                                            className="relative px-3 py-2 text-sm font-medium transition-colors duration-200 z-10"
                                        >
                                            <span className={isActive ? 'text-accent-cyan' : 'text-text-secondary hover:text-text-primary transition-colors'}>
                                                {group.label}
                                            </span>
                                        </a>
                                    </div>
                                );
                            })}

                            {/* Refinement: Dot-Line-Dot Indicator */}
                            {/* Rendered OUTSIDE map, absolute relative to the flex container */}
                            <motion.div
                                className="absolute bottom-1 h-1 bg-accent-cyan rounded-full pointer-events-none"
                                animate={{
                                    left: indicatorStyle.left,
                                    width: indicatorStyle.width,
                                    opacity: indicatorStyle.opacity
                                }}
                                transition={{
                                    left: { type: "spring", damping: 25, stiffness: 400 }, // Spring for movement
                                    width: { duration: 0.1, ease: "linear" }, // Linear for filling
                                    opacity: { duration: 0.2 }
                                }}
                                style={{ position: 'absolute' }}
                            />
                        </div>

                        {/* Contact Button */}
                        <a
                            href="#contact"
                            onClick={(e) => handleNavClick(e, '#contact')}
                            className="hidden md:inline-flex ml-8 px-6 py-2 text-sm font-semibold rounded-full border-2 border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-dark-bg transition-all duration-300"
                        // Refinement: ml-8, px-6, py-2, text-sm
                        >
                            Contact
                        </a>

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
                        <nav className="flex flex-col items-center gap-8">
                            {SECTION_GROUPS.map((group, i) => (
                                <motion.a
                                    key={group.id}
                                    href={group.href}
                                    onClick={(e) => handleNavClick(e, group.href)}
                                    className={`text-2xl font-semibold transition-colors ${activeGroup === group.id
                                        ? 'text-accent-cyan'
                                        : 'text-text-secondary hover:text-text-primary'
                                        }`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ delay: i * 0.06, duration: 0.3 }}
                                >
                                    {group.label}
                                </motion.a>
                            ))}

                            <motion.a
                                href="#contact"
                                onClick={(e) => handleNavClick(e, '#contact')}
                                className="mt-6 px-10 py-4 text-xl font-bold rounded-full border-2 border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-dark-bg transition-all duration-300"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: SECTION_GROUPS.length * 0.06, duration: 0.3 }}
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


