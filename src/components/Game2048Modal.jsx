import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../game/AudioContext';

const SIZE = 4;

export default function Game2048Modal({ isOpen, onClose }) {
    const { playSfx } = useAudio();
    const [board, setBoard] = useState(Array(SIZE * SIZE).fill(null));
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const boardRef = useRef(null);

    const initBoard = () => {
        let newBoard = Array(SIZE * SIZE).fill(null);
        newBoard = addRandomTile(newBoard);
        newBoard = addRandomTile(newBoard);
        setBoard(newBoard);
        setScore(0);
        setGameOver(false);
        if (boardRef.current) boardRef.current.focus();
    };

    useEffect(() => {
        if (isOpen) {
            initBoard();
        }
    }, [isOpen]);

    const addRandomTile = (currentBoard) => {
        const emptyIndices = currentBoard
            .map((val, idx) => (val === null ? idx : null))
            .filter(val => val !== null);

        if (emptyIndices.length === 0) return currentBoard;

        const randomIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        const newBoard = [...currentBoard];
        newBoard[randomIdx] = Math.random() < 0.9 ? 2 : 4;
        return newBoard;
    };

    const handleKeyDown = (e) => {
        if (gameOver || !isOpen) return;

        let dir = null;
        if (e.key === 'ArrowUp' || e.key === 'w') dir = 'UP';
        else if (e.key === 'ArrowDown' || e.key === 's') dir = 'DOWN';
        else if (e.key === 'ArrowLeft' || e.key === 'a') dir = 'LEFT';
        else if (e.key === 'ArrowRight' || e.key === 'd') dir = 'RIGHT';

        if (dir) {
            e.preventDefault();
            move(dir);
        }
    };

    const move = (dir) => {
        let newBoard = [...board];
        let changed = false;
        let addedScore = 0;

        const slideAndMerge = (row) => {
            // Remove nulls
            let newRow = row.filter(val => val !== null);
            // Merge adjacent equal numbers
            for (let i = 0; i < newRow.length - 1; i++) {
                if (newRow[i] !== null && newRow[i] === newRow[i + 1]) {
                    newRow[i] *= 2;
                    addedScore += newRow[i];
                    newRow[i + 1] = null;
                }
            }
            // Remove nulls again after merge
            newRow = newRow.filter(val => val !== null);
            // Pad with nulls
            while (newRow.length < SIZE) newRow.push(null);
            return newRow;
        };

        if (dir === 'LEFT' || dir === 'RIGHT') {
            for (let r = 0; r < SIZE; r++) {
                let row = [newBoard[r * SIZE], newBoard[r * SIZE + 1], newBoard[r * SIZE + 2], newBoard[r * SIZE + 3]];
                if (dir === 'RIGHT') row.reverse();

                let newRow = slideAndMerge(row);
                if (dir === 'RIGHT') newRow.reverse();

                for (let c = 0; c < SIZE; c++) {
                    if (newBoard[r * SIZE + c] !== newRow[c]) changed = true;
                    newBoard[r * SIZE + c] = newRow[c];
                }
            }
        } else if (dir === 'UP' || dir === 'DOWN') {
            for (let c = 0; c < SIZE; c++) {
                let col = [newBoard[c], newBoard[SIZE + c], newBoard[2 * SIZE + c], newBoard[3 * SIZE + c]];
                if (dir === 'DOWN') col.reverse();

                let newCol = slideAndMerge(col);
                if (dir === 'DOWN') newCol.reverse();

                for (let r = 0; r < SIZE; r++) {
                    if (newBoard[r * SIZE + c] !== newCol[r]) changed = true;
                    newBoard[r * SIZE + c] = newCol[r];
                }
            }
        }

        if (changed) {
            playSfx('hover');
            newBoard = addRandomTile(newBoard);
            setBoard(newBoard);
            setScore(s => s + addedScore);

            // Check game over
            if (!newBoard.includes(null) && !canMove(newBoard)) {
                playSfx('close');
                setGameOver(true);
            }
        }
    };

    const canMove = (b) => {
        for (let r = 0; r < SIZE; r++) {
            for (let c = 0; c < SIZE; c++) {
                const val = b[r * SIZE + c];
                if (c < SIZE - 1 && val === b[r * SIZE + c + 1]) return true; // right
                if (r < SIZE - 1 && val === b[(r + 1) * SIZE + c]) return true; // down
            }
        }
        return false;
    };

    const getTileColor = (val) => {
        switch (val) {
            case 2: return 'bg-[#E8DCC6] text-[#5C4033]';
            case 4: return 'bg-[#D4C4A0] text-[#5C4033]';
            case 8: return 'bg-[#E8943A] text-white';
            case 16: return 'bg-[#D2691E] text-white';
            case 32: return 'bg-[#C0392B] text-white';
            case 64: return 'bg-[#8B0000] text-white';
            case 128: return 'bg-[#DAA520] text-white';
            case 256: return 'bg-[#5A8C3C] text-white';
            case 512: return 'bg-[#3D6B2E] text-white';
            case 1024: return 'bg-[#006400] text-white';
            case 2048: return 'bg-[#FFD700] text-black shadow-[0_0_10px_#FFD700]';
            default: return 'bg-[#B8A08A] text-white'; // default empty
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
                    className="bg-[#3E2A1A] border-4 border-[#8B6F47] rounded-xl p-6 max-w-sm w-full shadow-[8px_8px_0px_rgba(0,0,0,0.5)] font-['Press_Start_2P']"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl text-[#F5E6D3]">2048</h2>
                        <button
                            onClick={() => { playSfx('click'); onClose(); }}
                            className="text-xl text-[#E8943A] hover:scale-125 transition-transform"
                        >
                            ✖
                        </button>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <div className="bg-[#2D1B0E] border-2 border-[#5C4033] p-2 rounded text-center">
                            <span className="text-[#B8A08A] text-[8px] block mb-1">SCORE</span>
                            <span className="text-[#E8943A] text-sm">{score}</span>
                        </div>
                    </div>

                    <div
                        ref={boardRef}
                        tabIndex={0}
                        onKeyDown={handleKeyDown}
                        className="bg-[#5C4033] p-2 rounded grid grid-cols-4 gap-2 mx-auto focus:outline-none focus:ring-4 focus:ring-[#E8943A] relative"
                        style={{ width: 'fit-content' }}
                    >
                        {board.map((val, idx) => (
                            <div
                                key={idx}
                                className={`w-14 h-14 flex items-center justify-center rounded flex-shrink-0 text-sm font-bold shadow-[inset_0_-3px_0_rgba(0,0,0,0.1)] ${val ? getTileColor(val) : 'bg-[#3E2A1A]'}`}
                            >
                                {val}
                            </div>
                        ))}

                        {gameOver && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded p-4 text-center">
                                <span className="text-[#E8943A] text-xl mb-4 drop-shadow-md">GAME OVER</span>
                                <button
                                    onClick={() => { playSfx('click'); initBoard(); }}
                                    className="px-4 py-2 bg-[#E8943A] border-4 border-[#5C4033] text-[#2D1B0E] rounded shadow-[4px_4px_0px_rgba(0,0,0,0.3)] text-xs hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,0.3)] transition-all"
                                >
                                    RETRY
                                </button>
                            </div>
                        )}
                    </div>

                    <p className="text-[#B8A08A] text-[8px] text-center mt-6 leading-loose">
                        Use W A S D or Arrow Keys.<br />Merge tiles to reach 2048!
                    </p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
