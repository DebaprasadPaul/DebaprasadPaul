import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../game/AudioContext';

const TRIVIA_QUESTIONS = [
    {
        q: "What was the typical 'start up' meeting spot in college?",
        opts: ["A fancy boardroom", "The local Chai Tapri", "A Zoom call", "The Library"],
        a: 1,
        msg: "Correct! Where the finest business ideas were drafted on wet tissue paper. ☕"
    },
    {
        q: "What is the universal quick-fix tool for 90s electronics?",
        opts: ["Blowing into the cartridge", "Restarting the router", "Updating drivers", "Calling IT support"],
        a: 0,
        msg: "Ah, the breath of life. Works 60% of the time, every time. 🎮"
    },
    {
        q: "The true measure of wealth in elementary school was...",
        opts: ["Stock options", "A 64-pack of Crayola with the sharpener", "Bitcoin", "A Swiss bank account"],
        a: 1,
        msg: "Exactly. The sharpener on the back was a flex. 🖍️"
    }
];

export default function TriviaModal({ isOpen, onClose }) {
    const { playSfx } = useAudio();
    const [qIndex, setQIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [showResult, setShowResult] = useState(false);

    // Pick a random question on mount if we want, or just loop
    React.useEffect(() => {
        if (isOpen) {
            setQIndex(Math.floor(Math.random() * TRIVIA_QUESTIONS.length));
            setSelected(null);
            setShowResult(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const question = TRIVIA_QUESTIONS[qIndex];

    const handleAnswer = (idx) => {
        if (showResult) return;
        setSelected(idx);
        setShowResult(true);
        if (idx === question.a) {
            playSfx('open'); // Success sound
        } else {
            playSfx('close'); // Fail/error sound
        }
    };

    const handleNext = () => {
        playSfx('click');
        onClose(); // Just close for now after answering one
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.8, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 50 }}
                        className="bg-[#D4C4A0] border-4 border-[#5C4033] rounded-xl p-6 max-w-md w-full shadow-[8px_8px_0px_rgba(0,0,0,0.5)] font-['Press_Start_2P']"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl text-[#5C4033]">Nostalgia Trivia</h2>
                            <button
                                onClick={() => { playSfx('click'); onClose(); }}
                                className="text-xl text-[#C0392B] hover:scale-125 transition-transform"
                            >
                                ✖
                            </button>
                        </div>

                        <div className="bg-[#E8DCC6] border-2 border-[#A08860] p-4 rounded mb-6 text-sm text-[#3B2F20] leading-loose">
                            {question.q}
                        </div>

                        <div className="space-y-3">
                            {question.opts.map((opt, idx) => {
                                let btnClass = "bg-[#C4B48A] border-[#A08860] text-[#5C4033]";
                                if (showResult) {
                                    if (idx === question.a) btnClass = "bg-[#5A8C3C] border-[#3D6B2E] text-white"; // Correct
                                    else if (idx === selected) btnClass = "bg-[#C0392B] border-[#8A251C] text-white"; // Wrong
                                }

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(idx)}
                                        onMouseEnter={() => playSfx('hover')}
                                        disabled={showResult}
                                        className={`w-full text-left p-3 border-4 rounded shadow-[2px_2px_0px_rgba(0,0,0,0.2)] text-xs transition-colors ${btnClass} ${!showResult && 'hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,0.2)]'}`}
                                    >
                                        <span className="mr-2 opacity-50">{idx + 1}.</span> {opt}
                                    </button>
                                );
                            })}
                        </div>

                        {showResult && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-6 text-center"
                            >
                                <p className={`text-xs mb-4 ${selected === question.a ? 'text-[#5A8C3C]' : 'text-[#C0392B]'}`}>
                                    {selected === question.a ? question.msg : 'Wrong! The correct answer was: ' + question.opts[question.a]}
                                </p>
                                <button
                                    onClick={handleNext}
                                    onMouseEnter={() => playSfx('hover')}
                                    className="px-6 py-3 bg-[#E8943A] border-4 border-[#5C4033] text-[#2D1B0E] rounded shadow-[4px_4px_0px_rgba(0,0,0,0.3)] text-xs hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,0.3)] transition-all"
                                >
                                    CONTINUE
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
