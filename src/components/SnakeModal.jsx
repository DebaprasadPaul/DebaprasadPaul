import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../game/AudioContext';

const GRID_SIZE = 15;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

export default function SnakeModal({ isOpen, onClose }) {
    const { playSfx } = useAudio();
    const [snake, setSnake] = useState([{ x: 7, y: 7 }]);
    const [food, setFood] = useState({ x: 10, y: 10 });
    const [dir, setDir] = useState({ x: 1, y: 0 });
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const boardRef = useRef(null);

    // Initial setup when modal opens
    useEffect(() => {
        if (isOpen) {
            setSnake([{ x: 7, y: 7 }]);
            setFood(generateFood());
            setDir({ x: 1, y: 0 });
            setGameOver(false);
            setScore(0);
            setIsPaused(false);
            if (boardRef.current) boardRef.current.focus();
        }
    }, [isOpen]);

    const generateFood = (currentSnake = snake) => {
        let newFood;
        while (true) {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
            };
            // Ensure food doesn't spawn on the snake
            if (!currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y)) {
                break;
            }
        }
        return newFood;
    };

    // Game Loop
    useEffect(() => {
        if (!isOpen || gameOver || isPaused) return;

        const moveSnake = () => {
            setSnake(prev => {
                const head = { ...prev[0] };
                head.x += dir.x;
                head.y += dir.y;

                // Wall Collision
                if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
                    playSfx('close'); // Game over sound
                    setGameOver(true);
                    return prev;
                }

                // Self Collision
                if (prev.some(seg => seg.x === head.x && seg.y === head.y)) {
                    playSfx('close');
                    setGameOver(true);
                    return prev;
                }

                const newSnake = [head, ...prev];

                // Food Collision
                if (head.x === food.x && head.y === food.y) {
                    playSfx('hover'); // Eat sound
                    setScore(s => s + 10);
                    setFood(generateFood(newSnake));
                } else {
                    newSnake.pop(); // Remove tail
                }

                return newSnake;
            });
        };

        const speed = Math.max(60, INITIAL_SPEED - (score * 0.5)); // Slower speed increment
        const intervalId = setInterval(moveSnake, speed);
        return () => clearInterval(intervalId);
    }, [isOpen, dir, food, gameOver, isPaused, score, playSfx]);

    // Keyboard Controls
    const handleKeyDown = (e) => {
        if (gameOver) return;

        switch (e.key) {
            case 'ArrowUp':
            case 'w':
                if (dir.y === 0) setDir({ x: 0, y: -1 });
                break;
            case 'ArrowDown':
            case 's':
                if (dir.y === 0) setDir({ x: 0, y: 1 });
                break;
            case 'ArrowLeft':
            case 'a':
                if (dir.x === 0) setDir({ x: -1, y: 0 });
                break;
            case 'ArrowRight':
            case 'd':
                if (dir.x === 0) setDir({ x: 1, y: 0 });
                break;
            case 'Escape':
                setIsPaused(!isPaused);
                break;
            default:
                break;
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
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
                    className="bg-[#D4C4A0] border-4 border-[#5C4033] rounded-xl p-6 max-w-sm w-full shadow-[8px_8px_0px_rgba(0,0,0,0.5)] font-['Press_Start_2P']"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl text-[#5C4033]">Snake</h2>
                        <button
                            onClick={() => { playSfx('click'); onClose(); }}
                            className="text-xl text-[#C0392B] hover:scale-125 transition-transform"
                        >
                            ✖
                        </button>
                    </div>

                    <div className="flex justify-between items-center mb-4 text-[#3B2F20] text-xs">
                        <span>SCORE: {score}</span>
                        {isPaused && <span className="text-[#C0392B] animate-pulse">PAUSED</span>}
                    </div>

                    {/* Game Board */}
                    <div
                        ref={boardRef}
                        tabIndex={0}
                        onKeyDown={handleKeyDown}
                        className="relative bg-[#E8DCC6] border-4 border-[#A08860] mx-auto focus:outline-none focus:border-[#E8943A]"
                        style={{
                            width: GRID_SIZE * CELL_SIZE,
                            height: GRID_SIZE * CELL_SIZE
                        }}
                    >
                        {!gameOver ? (
                            <>
                                {/* Food */}
                                <div
                                    className="absolute bg-[#C0392B] rounded-sm"
                                    style={{
                                        width: CELL_SIZE - 2,
                                        height: CELL_SIZE - 2,
                                        left: food.x * CELL_SIZE + 1,
                                        top: food.y * CELL_SIZE + 1,
                                    }}
                                />

                                {/* Snake */}
                                {snake.map((seg, i) => (
                                    <div
                                        key={i}
                                        className="absolute bg-[#5A8C3C] border border-[#3D6B2E]"
                                        style={{
                                            width: CELL_SIZE,
                                            height: CELL_SIZE,
                                            left: seg.x * CELL_SIZE,
                                            top: seg.y * CELL_SIZE,
                                            opacity: i === 0 ? 1 : 0.8, // Head is darker
                                            borderRadius: i === 0 ? '4px' : '0'
                                        }}
                                    />
                                ))}
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm p-4 text-center">
                                <span className="text-[#C0392B] text-xl mb-4">GAME OVER</span>
                                <button
                                    onClick={() => {
                                        playSfx('click');
                                        setSnake([{ x: 7, y: 7 }]);
                                        setFood(generateFood([{ x: 7, y: 7 }]));
                                        setDir({ x: 1, y: 0 });
                                        setScore(0);
                                        setGameOver(false);
                                        if (boardRef.current) boardRef.current.focus();
                                    }}
                                    className="px-4 py-2 bg-[#E8943A] border-4 border-[#5C4033] text-[#2D1B0E] rounded shadow-[4px_4px_0px_rgba(0,0,0,0.3)] text-xs hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,0.3)] transition-all"
                                >
                                    RETRY
                                </button>
                            </div>
                        )}
                    </div>

                    <p className="text-[#8B6F47] text-[8px] text-center mt-4 leading-loose">
                        Use W A S D or Arrow Keys.<br />Click board to focus.
                    </p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
