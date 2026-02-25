import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAudio } from './AudioContext';

import imgMushroom from '../assets/game/SecretMushroom.png';
import imgBird from '../assets/game/SecretBird.png';
import imgCartridge from '../assets/game/SecretCartridge.png';

export const easterEggsConfig = [
    {
        id: 'mushroom',
        src: imgMushroom,
        width: 48,
        height: 48,
        game: 'trivia',
    },
    {
        id: 'bird',
        src: imgBird,
        width: 48,
        height: 48,
        game: 'snake',
    },
    {
        id: 'cartridge',
        src: imgCartridge,
        width: 52,
        height: 52,
        game: '2048',
    }
];

/*
 * Each egg gets its OWN dedicated Y band so they NEVER overlap:
 *   Mushroom: Y 300-500   (near top, between Home & SandPit)
 *   Bird:     Y 800-1100  (middle, between Playground & School)
 *   Cartridge: Y 1500-1800 (bottom, between Chai & Office)
 *
 * X positions alternate left/right in the interior grass (not edges).
 */
const DEDICATED_ZONES = {
    mushroom: { yMin: 350, yMax: 500, xOptions: [[120, 220], [580, 680]] },
    bird: { yMin: 850, yMax: 1100, xOptions: [[120, 220], [580, 680]] },
    cartridge: { yMin: 1500, yMax: 1750, xOptions: [[120, 220], [580, 680]] },
};

function randomizeForEgg(eggId) {
    const zone = DEDICATED_ZONES[eggId];
    const xRange = zone.xOptions[Math.floor(Math.random() * zone.xOptions.length)];
    return {
        x: xRange[0] + Math.random() * (xRange[1] - xRange[0]),
        y: zone.yMin + Math.random() * (zone.yMax - zone.yMin),
    };
}

export default function EasterEggManager({ onOpenMinigame, onFoundEgg }) {
    const { playSfx } = useAudio();
    const [eggs, setEggs] = useState([]);

    // Initialize all 3 eggs with their dedicated positions
    useEffect(() => {
        const init = easterEggsConfig.map((egg) => ({
            ...egg,
            ...randomizeForEgg(egg.id),
            timesPlayed: 0,
        }));
        setEggs(init);
    }, []);

    // Click handler: play game, re-randomize position after
    const handleClick = useCallback((id, gameType) => {
        playSfx('open');

        // Count first discovery
        setEggs(prev => {
            const egg = prev.find(e => e.id === id);
            if (egg && egg.timesPlayed === 0 && onFoundEgg) {
                onFoundEgg();
            }
            return prev.map(e =>
                e.id === id ? { ...e, timesPlayed: e.timesPlayed + 1 } : e
            );
        });

        if (onOpenMinigame) {
            onOpenMinigame(gameType);
        }

        // Re-randomize position within its dedicated zone
        setTimeout(() => {
            setEggs(prev => prev.map(e =>
                e.id === id ? { ...e, ...randomizeForEgg(id) } : e
            ));
        }, 800);
    }, [playSfx, onOpenMinigame, onFoundEgg]);

    return (
        <g>
            {/* ALL 3 eggs always rendered */}
            {eggs.map(egg => (
                <motion.g
                    key={egg.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleClick(egg.id, egg.game)}
                    onMouseEnter={() => playSfx('hover')}
                >
                    <motion.image
                        href={egg.src}
                        x={egg.x - egg.width / 2}
                        y={egg.y - egg.height / 2}
                        width={egg.width}
                        height={egg.height}
                        animate={{
                            y: [egg.y - egg.height / 2, egg.y - egg.height / 2 - 6, egg.y - egg.height / 2]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 2 + Math.random(),
                            ease: "easeInOut"
                        }}
                    />
                </motion.g>
            ))}
        </g>
    );
}
