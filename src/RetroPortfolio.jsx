import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FallingLeaves from './game/FallingLeaves';
import GameRoad from './game/GameRoad';
import ModeToggle from './game/ModeToggle';
import { AudioProvider, useAudio } from './game/AudioContext';
import { usePortfolioData } from './hooks/usePortfolioData';
import ResumeModal from './components/ResumeModal';
import TriviaModal from './components/TriviaModal';
import SnakeModal from './components/SnakeModal';
import Game2048Modal from './components/Game2048Modal';
import NavDialog from './components/NavDialog';
import ContactDialog from './components/ContactDialog';
import { easterEggsConfig } from './game/EasterEggManager';
import { ArrowUpRight, FileText, Mail, Briefcase } from 'lucide-react';

// ── Navbar — functional nav with dialogs ──
function Navbar({ profile, onNavClick }) {
    const handleClick = (e, label) => {
        e.preventDefault();
        if (label === 'Home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            onNavClick(label.toLowerCase());
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50"
            style={{
                background: 'linear-gradient(180deg, #2C1E12 0%, #3B2F20 100%)',
                boxShadow: '0 3px 0 rgba(59,47,32,0.4)',
                borderBottom: '2px solid #5C4033',
            }}>
            <div className="w-full px-8 h-12 flex items-center justify-between">
                <a href="#" onClick={(e) => handleClick(e, 'Home')}
                    className="pixel-font text-[10px] text-[#E8DCC6] tracking-wider flex items-center gap-2 hover:text-[#C89B3C] transition-colors">
                    🚲 {profile?.name || 'The Journey'}
                </a>
                <div className="flex items-center gap-6">
                    {['Home', 'Story', 'Skills', 'Work', 'Contact'].map(label => (
                        <a key={label} href="#" onClick={(e) => handleClick(e, label)}
                            className="text-[12px] font-medium text-[#D4C4A0] hover:text-[#E8DCC6] transition-colors"
                            style={{ cursor: 'pointer' }}>
                            {label}
                        </a>
                    ))}
                </div>
            </div>

            {/* Audio Toggle UI */}
            <ModeToggle />
        </nav>
    );
}

// ── Visiting Card ──
function VisitingCard({ profile, onResumeClick }) {
    return (
        <div style={{ background: '#FFF8E7', border: '3px solid #3B2F20', boxShadow: '5px 5px 0 #3B2F20' }}>
            <div style={{ height: 5, background: '#5F9EA0' }} />
            <div className="p-5">
                <div style={{ borderBottom: '1px solid #D4C4A0', paddingBottom: 12, marginBottom: 12 }}>
                    <h3 className="pixel-font text-[11px] text-[#3B2F20] mb-1.5 tracking-wider">
                        {profile?.name || 'Debaprasad Paul'}
                    </h3>
                    <p className="text-[12px] text-[#5C4033] font-medium">
                        Financial Operations & Systems Architect
                    </p>
                    <p className="text-[10px] text-[#8B7355] mt-1 italic">
                        "The sand castles became portfolios. The playground rules became SOPs."
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-x-5 gap-y-2.5 text-[11px]">
                    {profile?.email && (
                        <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-[#3B2F20] hover:text-[#5F9EA0] transition-colors">
                            <Mail size={12} style={{ color: '#5F9EA0' }} /> Email
                        </a>
                    )}
                    {profile?.linkedin && (
                        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#3B2F20] hover:text-[#5F9EA0] transition-colors">
                            <Briefcase size={12} style={{ color: '#5F9EA0' }} /> LinkedIn <ArrowUpRight size={10} />
                        </a>
                    )}
                    {profile?.github_url && (
                        <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#3B2F20] hover:text-[#5F9EA0] transition-colors">
                            🐙 GitHub <ArrowUpRight size={10} />
                        </a>
                    )}
                    <button onClick={onResumeClick} className="flex items-center gap-2 text-[#3B2F20] hover:text-[#5F9EA0] transition-colors text-left">
                        <FileText size={12} style={{ color: '#5F9EA0' }} /> Resume
                    </button>
                </div>
                <div className="mt-4 pt-3" style={{ borderTop: '1px solid #D4C4A0' }}>
                    <div className="flex flex-wrap gap-1.5">
                        {['Finance', 'Operations', 'Python', 'React', 'AI/ML', 'Power BI'].map(s => (
                            <span key={s} className="px-2 py-0.5 text-[9px] text-[#3B2F20]" style={{ background: '#D4C4A0', border: '1px solid #A08860' }}>{s}</span>
                        ))}
                    </div>
                </div>
                <p className="text-[8px] mt-4 text-right" style={{ color: '#A08860' }}>© {new Date().getFullYear()} {profile?.name}</p>
            </div>
        </div>
    );
}


// ── FUN NOSTALGIC STORY CONTENT ──
const JOURNEY_STOPS = [
    {
        id: 'home',
        title: 'Home',
        emoji: '🏠',
        line: 'Where every morning smelled like chai & possibilities',
        text: 'Barefoot on cold floors. Ma yelling "late ho jaoge!" The creak of the gate. Pocket full of change and heart full of plans. We didn\'t know where the road led — we just needed our bicycle.',
    },
    {
        id: 'sandpit',
        title: 'The Sand Pit',
        emoji: '🏖️',
        line: 'Where we took our first steps... literally',
        text: 'Mud castles. Stick swords. The kid who ate sand (we all knew one). This was where imagination had no budget constraints. Where we first learned to build something from nothing — just add water toh mitti bhi clay ban jaati hai.',
    },
    {
        id: 'park',
        title: 'The Playground',
        emoji: '🌳',
        line: 'Where dreams had no limits... "Main pilot banunga!" "Nahi, racing car driver! Broom broom BROOOOM!" 🏎️',
        text: 'Higher on the swing = closer to the sky. Every kid was gonna be something BIG — engineer, pilot, astronaut, car racer. We didn\'t know what CTC meant but we knew we\'d change the world. And the slide? That was just gravity teaching us physics before school ever could.',
    },
    {
        id: 'school',
        title: 'School & College',
        emoji: '🏫',
        line: 'Bell rings, chalk fights, and that one special person...',
        text: 'Last bench legends. Borrowing notes you\'d never return. The teacher who actually made you care. Friends who became family. Late-night study sessions that were 80% gossip. Project deadlines. College fests. And somewhere between Physics class and the canteen... you met that person who made your heart do Ctrl+Alt+Del. 💫',
    },
    {
        id: 'shops',
        title: 'Chai Tapri & Hangouts',
        emoji: '☕',
        line: '"Ek cutting chai aur 2 Parle-G" — where the real meetings happened',
        text: 'The stationery shop before exams ("bhaiya, last page ka refill dena"). The chai tapri where startups were planned between sips. The cycle repair uncle who fixed more than chains — he fixed bad days. Business ideas on tissue papers. Creativity fueled by ₹10 snacks. The REAL brainstorming happened here, not in boardrooms.',
    },
    {
        id: 'road',
        title: 'The Open Road',
        emoji: '🛤️',
        line: 'When the stops became fewer and the speed picked up...',
        text: 'Internships. First salary (₹15K felt like ₹15Cr). Fast-tracking. KRAs. Reviews. The bicycle got faster. The road got wider. Responsibilities piled up like unread emails. College friends became LinkedIn connections. But the pedals? They never stopped turning.',
    },
    {
        id: 'office',
        title: 'The Office',
        emoji: '🏢',
        line: 'We arrived. Built systems. Hit targets. But sometimes... we still miss that bell. 🔔',
        text: null,
    },
];

const CARD_POSITIONS = [
    // Scale: 1 SVG unit = 2.4px on 1920 viewport. Card = 240px = 12.5%.
    // Layout: Road → Building → Card (card on empty grass side)

    // HOME(300,75): road at x≈420 RIGHT. Grass LEFT. Card LEFT: 8%
    { top: '1.5%', left: '8%' },
    // SANDPIT(540,260): road at x≈660 RIGHT. Grass LEFT. Card LEFT: 35%
    { top: '10%', left: '35%' },
    // PLAYGROUND(180,610): road at x≈140 LEFT. Grass RIGHT. Card RIGHT: 45%
    { top: '27%', left: '45%' },
    // SCHOOL(560,1000): road at x≈690 RIGHT. Grass LEFT. Card LEFT: 35%
    { top: '44%', left: '35%' },
    // CHAI(210,1400): road at x≈170 LEFT. Grass RIGHT. Card RIGHT: 42%
    { top: '62%', left: '42%' },
    // OPEN ROAD ~78%. No building. Card on right grass.
    { top: '78%', left: '45%' },
    // OFFICE(310,2060): road at x≈270 LEFT. Grass RIGHT. Card RIGHT: 55%
    { top: '92%', left: '55%' },
];

function PortfolioJourney() {
    const { profile, metrics, resumes, navContent } = usePortfolioData();
    // ── GAME STATE ──
    const [scrollProgress, setScrollProgress] = useState(0);
    const [expandedStop, setExpandedStop] = useState(null);
    const { isAutoPlay, setIsAutoPlay, speak, stopSpeaking, playSfx } = useAudio();
    const [tourIndex, setTourIndex] = useState(-1);
    const [isResumeOpen, setIsResumeOpen] = useState(false);
    const [foundSecrets, setFoundSecrets] = useState(0);
    const [activeMinigame, setActiveMinigame] = useState(null);
    const [activeDialog, setActiveDialog] = useState(null); // 'story' | 'skills' | 'work' | 'contact' | null
    const rafRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                setScrollProgress(Math.min(100, Math.max(0, progress)));
            });
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const toggleStop = useCallback((id) => {
        const isOpening = expandedStop !== id;
        setExpandedStop(isOpening ? id : null);

        if (isOpening) {
            playSfx('bell');  // Ring bicycle bell before stopping
            setTimeout(() => {
                playSfx('open');
                const stopData = JOURNEY_STOPS.find(s => s.id === id);
                if (stopData) {
                    speak(stopData.id, stopData.text);
                }
            }, 400); // Short delay after bell
        } else {
            playSfx('close');
            stopSpeaking();
        }
    }, [expandedStop, speak, stopSpeaking, playSfx]);

    // --- AUTO TOUR LOGIC ---
    useEffect(() => {
        if (!isAutoPlay) {
            setTourIndex(-1);
            return;
        }
        if (tourIndex === -1) {
            setTourIndex(0); // Start the tour!
        }
    }, [isAutoPlay]);

    useEffect(() => {
        if (!isAutoPlay) return;

        if (tourIndex >= 0 && tourIndex < JOURNEY_STOPS.length) {
            const stop = JOURNEY_STOPS[tourIndex];
            setExpandedStop(stop.id);

            // Auto-scroll to the item's approx position
            const pos = CARD_POSITIONS[tourIndex];
            if (pos) {
                setTimeout(() => {
                    const percentString = pos.top.replace('%', '');
                    const percent = parseFloat(percentString) / 100;
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    window.scrollTo({
                        top: (percent * docHeight) - (window.innerHeight * 0.2), // Scroll slightly above the item
                        behavior: 'smooth'
                    });
                }, 100); // slight delay ensures rendering
            }

            // Ring bell before speaking
            playSfx('bell');

            // Speak the text after bell, and when finished wait 1.5s then advance
            setTimeout(() => {
                speak(stop.id, stop.text, () => {
                    setTimeout(() => {
                        setTourIndex(prev => prev !== -1 ? prev + 1 : prev);
                    }, 1500);
                });
            }, 500);
        } else if (tourIndex >= JOURNEY_STOPS.length) {
            // Tour finished!
            setIsAutoPlay(false);
            setTourIndex(-1);
            setExpandedStop(null);
        }
    }, [tourIndex, isAutoPlay, speak, setIsAutoPlay]);
    // -----------------------

    return (
        <div className="relative min-h-screen overflow-x-hidden" style={{ background: '#E8DCC6' }}>
            <Navbar profile={profile} onNavClick={(section) => { playSfx('open'); setActiveDialog(section); }} />
            <FallingLeaves />

            {/* Intro card — centered */}
            <div className="relative z-10 px-8 pt-16 pb-2 flex justify-center">
                <div className="retro-card" style={{ maxWidth: 340 }}>
                    <h1 className="pixel-font text-[11px] mb-2 text-center" style={{ color: '#3B2F20' }}>{profile.name}</h1>
                    <p className="text-[11px] leading-relaxed text-center" style={{ color: '#5C4033' }}>{profile.subtitle}</p>
                </div>
            </div>

            {/* ── Full-width journey canvas ── */}
            <div className="relative w-full">
                <GameRoad
                    scrollProgress={scrollProgress}
                    onOpenMinigame={(game) => setActiveMinigame(game)}
                    onFoundEgg={() => setFoundSecrets(prev => prev + 1)}
                />

                {/* Story cards over the road */}
                <div className="absolute inset-0 pointer-events-none">
                    {JOURNEY_STOPS.map((stop, index) => {
                        const pos = CARD_POSITIONS[index];
                        const isOffice = stop.id === 'office';

                        return (
                            <div
                                key={stop.id}
                                id={stop.id}
                                className="absolute pointer-events-auto"
                                style={{
                                    top: pos.top,
                                    ...(pos.left ? { left: pos.left } : {}),
                                    ...(pos.right ? { right: pos.right } : {}),
                                    width: isOffice ? '280px' : '240px',
                                    zIndex: expandedStop === stop.id ? 20 : 10,
                                }}
                            >
                                <button
                                    onClick={() => toggleStop(stop.id)}
                                    onMouseEnter={() => playSfx('hover')}
                                    className="w-full text-left cursor-pointer"
                                >
                                    <div className="retro-card transition-all">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-base">{stop.emoji}</span>
                                            <span className="pixel-font text-[8px]" style={{ color: '#3B2F20' }}>{stop.title}</span>
                                        </div>
                                        <p className="text-[10px] italic leading-snug" style={{ color: '#5C4033' }}>{stop.line}</p>
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {expandedStop === stop.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            {isOffice ? (
                                                <div className="mt-1">
                                                    <VisitingCard profile={profile} onResumeClick={() => setIsResumeOpen(true)} />
                                                </div>
                                            ) : (
                                                <div className="retro-card mt-1 text-left">
                                                    <p className="text-[11px] leading-relaxed" style={{ color: '#3B2F20' }}>{stop.text}</p>

                                                    {stop.id === 'home' && metrics.length > 0 && (
                                                        <div className="mt-3 space-y-1.5">
                                                            {metrics.map(m => (
                                                                <div key={m.label} className="flex justify-between text-[10px]">
                                                                    <span style={{ color: '#5C4033' }}>{m.label}</span>
                                                                    <span className="font-bold" style={{ color: '#C89B3C' }}>{m.value}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {stop.id === 'sandpit' && (
                                                        <p className="mt-3 text-[10px] italic" style={{ color: '#5C4033' }}>
                                                            🎯 Observe → 🧩 Segment → 🔬 Test → 📐 Scale → 🔄 Refine
                                                        </p>
                                                    )}

                                                    {stop.id === 'park' && (
                                                        <div className="mt-3 text-[10px]" style={{ color: '#5C4033' }}>
                                                            <p className="font-bold">₹2Cr → ₹15Cr Portfolio | 93-95% Stability</p>
                                                            <p className="mt-1">Turned childhood dreams into adult precision engines.</p>
                                                        </div>
                                                    )}

                                                    {stop.id === 'school' && (
                                                        <div className="mt-3 text-[10px] space-y-1.5" style={{ color: '#5C4033' }}>
                                                            <p>🎓 PGDM Finance — Pune</p>
                                                            <p>⚡ B.Tech Electrical — Kolkata</p>
                                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                                {['Python', 'SQL', 'Excel/VBA', 'React', 'Power BI', 'Git'].map(s => (
                                                                    <span key={s} className="px-2 py-0.5 text-[9px]" style={{ background: '#D4C4A0', border: '1px solid #A08860', color: '#3B2F20' }}>{s}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {stop.id === 'shops' && (
                                                        <div className="mt-3 text-[10px] space-y-1" style={{ color: '#5C4033' }}>
                                                            <p>💰 <strong>Finance:</strong> Portfolio Analytics, MIS, Credit Risk</p>
                                                            <p>⚙️ <strong>Ops:</strong> Process Architecture, Automation, SOPs</p>
                                                            <p>🤖 <strong>AI:</strong> Multi-Agent Systems, Prompt Engineering</p>
                                                        </div>
                                                    )}

                                                    {stop.id === 'road' && (
                                                        <div className="mt-3 text-[10px] space-y-1" style={{ color: '#5C4033' }}>
                                                            <p>🏢 <strong>2025:</strong> Financial Ops Lead — P2P, MIS, Governance</p>
                                                            <p>📈 <strong>2024:</strong> Portfolio Strategist — ₹12-15Cr Retail</p>
                                                            <p>🗺️ <strong>2023:</strong> Recovery Architect — 6 Districts NE</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>

            <ModeToggle />

            {/* Secrets Found Overlay Tracker (appears after finding 1) */}
            <AnimatePresence>
                {foundSecrets > 0 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="fixed bottom-[140px] right-6 z-50 p-2 px-3 border-4 rounded bg-[#3E2A1A] border-[#8B6F47] text-[#DAA520] font-['Press_Start_2P'] text-[9px] shadow-[4px_4px_0px_rgba(0,0,0,0.3)] flex items-center gap-2"
                    >
                        <span>✨</span>
                        <span>SECRETS: {foundSecrets}/{easterEggsConfig.length}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Progress bar */}
            <div className="fixed top-12 left-0 right-0 h-[3px] z-50" style={{ background: 'rgba(212,196,160,0.3)' }}>
                <div className="h-full transition-all duration-150" style={{ width: `${scrollProgress}%`, background: '#5F9EA0' }} />
            </div>

            <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} resumes={resumes} />
            <TriviaModal isOpen={activeMinigame === 'trivia'} onClose={() => setActiveMinigame(null)} />
            <SnakeModal isOpen={activeMinigame === 'snake'} onClose={() => setActiveMinigame(null)} />
            <Game2048Modal isOpen={activeMinigame === '2048'} onClose={() => setActiveMinigame(null)} />

            {/* Nav Dialogs — Story, Skills, Work */}
            {['story', 'skills', 'work'].map(key => (
                <NavDialog
                    key={key}
                    isOpen={activeDialog === key}
                    onClose={() => setActiveDialog(null)}
                    title={navContent[key]?.title || key}
                    content={navContent[key]?.content || ''}
                />
            ))}

            {/* Contact Dialog */}
            <ContactDialog
                isOpen={activeDialog === 'contact'}
                onClose={() => setActiveDialog(null)}
                email={profile?.email || 'deba90020@gmail.com'}
            />
        </div>
    );
}

export default function RetroPortfolio() {
    return (
        <AudioProvider>
            <PortfolioJourney />
        </AudioProvider>
    );
}
