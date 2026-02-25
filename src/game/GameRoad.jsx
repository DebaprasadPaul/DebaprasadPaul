import { useRef, useEffect, useState } from 'react';
import { useAudio } from './AudioContext';

import imgHouse from '../assets/game/House.png';
import imgSandPit from '../assets/game/Sand Pit.png';
import imgSwing from '../assets/game/Swing.png';
import imgSlide from '../assets/game/Slide.png';
import imgSchool from '../assets/game/School.png';
import imgChaiShop from '../assets/game/Chai Tapri.png';
import imgOffice from '../assets/game/Office Building.png';
import imgTree from '../assets/game/Tree.png';
import imgBicycle from '../assets/game/Bicycle.png';
import EasterEggManager from './EasterEggManager';

/* ───────── PIXEL-ART BUILDINGS (scaled ~40% smaller) ───────── */

function House({ x, y }) {
    return <image href={imgHouse} x={x - 50} y={y - 50} width="100" height="100" preserveAspectRatio="xMidYMid meet" />;
}

function SandPit({ x, y }) {
    return <image href={imgSandPit} x={x - 45} y={y - 45} width="90" height="90" preserveAspectRatio="xMidYMid meet" />;
}

function Swing({ x, y }) {
    return <image href={imgSwing} x={x - 35} y={y - 50} width="70" height="85" preserveAspectRatio="xMidYMid meet" />;
}

function Slide({ x, y }) {
    return <image href={imgSlide} x={x - 35} y={y - 50} width="70" height="85" preserveAspectRatio="xMidYMid meet" />;
}

function School({ x, y }) {
    return <image href={imgSchool} x={x - 70} y={y - 65} width="140" height="100" preserveAspectRatio="xMidYMid meet" />;
}

function ChaiShop({ x, y }) {
    return <image href={imgChaiShop} x={x - 45} y={y - 40} width="90" height="70" preserveAspectRatio="xMidYMid meet" />;
}

function Office({ x, y }) {
    return <image href={imgOffice} x={x - 50} y={y - 110} width="100" height="140" preserveAspectRatio="xMidYMid meet" />;
}

/* ───────── SMALL DECORATIONS ───────── */

function Tree({ x, y, s = 1 }) {
    const w = 45 * s;
    const h = 65 * s;
    return <image href={imgTree} x={x - w / 2} y={y - h + 12} width={w} height={h} preserveAspectRatio="xMidYMid meet" />;
}

function Bush({ x, y }) {
    return (
        <g transform={`translate(${x}, ${y})`}>
            <ellipse cx="0" cy="0" rx="8" ry="5" fill="#3D6B2E" />
            <ellipse cx="-4" cy="1" rx="5" ry="3.5" fill="#5A8C3C" opacity="0.7" />
            <ellipse cx="4" cy="1" rx="5" ry="3.5" fill="#5A8C3C" opacity="0.7" />
        </g>
    );
}

function Flowers({ x, y }) {
    return (
        <g transform={`translate(${x}, ${y})`}>
            {['#FF69B4', '#FFD700', '#FF6347', '#FFA500', '#DC143C'].map((c, i) => (
                <g key={i}>
                    <line x1={(i - 2) * 4} y1={2} x2={(i - 2) * 4} y2={6} stroke="#3D6B2E" strokeWidth="0.6" />
                    <circle cx={(i - 2) * 4} cy={i % 2 ? -0.5 : 0.5} r={1.8} fill={c} opacity={0.7} />
                </g>
            ))}
        </g>
    );
}

function Bench({ x, y }) {
    return (
        <g transform={`translate(${x}, ${y})`}>
            <rect x="-8" y="-3" width="16" height="2" fill="#5C4033" />
            <rect x="-8" y="-7" width="16" height="2" fill="#6B5233" />
            <rect x="-7" y="-1" width="2" height="5" fill="#5C4033" />
            <rect x="5" y="-1" width="2" height="5" fill="#5C4033" />
        </g>
    );
}

function Lamp({ x, y }) {
    return (
        <g transform={`translate(${x}, ${y})`}>
            <rect x="-0.5" y="-18" width="1" height="20" fill="#5C4033" />
            <ellipse cx="0" cy="-19" rx="3" ry="2" fill="#C89B3C" opacity="0.7" />
            <circle cx="0" cy="-19" r="1.5" fill="#FFD700" opacity="0.3" />
        </g>
    );
}

function Fence({ x, y, w = 30 }) {
    const n = Math.floor(w / 8);
    return (
        <g transform={`translate(${x}, ${y})`}>
            <line x1="0" y1="-4" x2={w} y2="-4" stroke="#8B7355" strokeWidth="1" />
            <line x1="0" y1="-1" x2={w} y2="-1" stroke="#8B7355" strokeWidth="1" />
            {Array.from({ length: n + 1 }, (_, i) => (
                <rect key={i} x={i * 8 - 0.5} y="-6" width="1" height="8" fill="#6B5233" />
            ))}
        </g>
    );
}


/* ════════════════════════════════════════════
   ROAD PATH — tight serpentine curves spanning
   the full width of the canvas for a Village
   lane feel, NOT a highway.

   Buildings sit RIGHT NEXT to the road at each
   curve so the HTML cards don't need to reach far.

   Canvas: 800 x 2200 (taller for more twists)
   ════════════════════════════════════════════ */

// The road now zig-zags widely: left-right-left-right
const ROAD_D = `M 400 50
  C 500 70, 620 100, 680 160
  C 740 220, 720 280, 640 330
  C 560 380, 400 400, 300 420
  C 200 440, 120 480, 100 540
  C 80 600, 120 660, 200 710
  C 280 760, 400 780, 500 810
  C 600 840, 700 880, 720 940
  C 740 1000, 680 1050, 580 1090
  C 480 1130, 360 1150, 260 1190
  C 160 1230, 100 1280, 110 1340
  C 120 1400, 200 1440, 300 1470
  C 400 1500, 500 1530, 560 1570
  C 620 1610, 660 1660, 640 1720
  C 620 1780, 540 1820, 440 1850
  C 340 1880, 240 1920, 200 1970
  C 160 2020, 200 2070, 300 2100
  C 400 2130, 420 2150, 400 2170`;


export default function GameRoad({ scrollProgress = 0, onOpenMinigame, onFoundEgg }) {
    const { playSfx } = useAudio();
    const pathRef = useRef(null);
    const [bikeX, setBikeX] = useState(400);
    const [bikeY, setBikeY] = useState(50);
    const [bikeFacing, setBikeFacing] = useState(true);

    useEffect(() => {
        const path = pathRef.current;
        if (!path) return;
        const totalLen = path.getTotalLength();
        const p = Math.min(1, Math.max(0, scrollProgress / 100));
        const pt = path.getPointAtLength(p * totalLen);
        const pt2 = path.getPointAtLength(Math.min(p * totalLen + 3, totalLen));
        setBikeX(pt.x);
        setBikeY(pt.y);
        setBikeFacing(pt2.x >= pt.x);
    }, [scrollProgress]);

    return (
        <svg viewBox="0 0 800 2200" className="w-full h-auto block" preserveAspectRatio="xMidYMin meet">
            {/* Background */}
            <rect width="800" height="2200" fill="#E8DCC6" />

            {/* Subtle grass patches — dense coverage */}
            {[
                [120, 100, 30], [350, 60, 22], [680, 80, 28],
                [120, 180, 35], [450, 200, 25], [680, 250, 30],
                [250, 320, 28], [600, 350, 32],
                [150, 480, 30], [400, 520, 26], [660, 500, 32],
                [200, 600, 30], [500, 580, 25], [350, 660, 28],
                [400, 680, 28], [600, 740, 24],
                [200, 900, 35], [450, 850, 25], [620, 870, 30],
                [360, 960, 30], [150, 1020, 26],
                [350, 1100, 32], [550, 1060, 24], [700, 1140, 28],
                [150, 1250, 28], [400, 1300, 24], [650, 1300, 28],
                [250, 1430, 26], [500, 1480, 22],
                [300, 1560, 30], [600, 1600, 24], [150, 1640, 26],
                [550, 1750, 28], [350, 1800, 24],
                [200, 1910, 32], [450, 1940, 22], [650, 1980, 26],
                [300, 2080, 22], [500, 2050, 25], [150, 2130, 20],
            ].map(([cx, cy, rx], i) => (
                <ellipse key={`g${i}`} cx={cx} cy={cy} rx={rx} ry={rx * 0.4} fill="#5A8C3C" opacity="0.12" />
            ))}

            {/* ── Left-edge trees ── */}
            {[60, 180, 310, 470, 600, 680, 830, 1000, 1130, 1300, 1460, 1600, 1780, 1920, 2080].map((ty, i) => (
                <Tree key={`tl${i}`} x={14 + (i % 4) * 10} y={ty} s={0.45 + (i % 4) * 0.06} />
            ))}
            {/* ── Right-edge trees ── */}
            {[90, 220, 400, 550, 710, 850, 980, 1150, 1320, 1480, 1650, 1810, 1950, 2100].map((ty, i) => (
                <Tree key={`tr${i}`} x={774 + (i % 3) * 7} y={ty} s={0.45 + (i % 3) * 0.06} />
            ))}
            {/* ── Interior trees near landmarks ── */}
            <Tree x={200} y={80} s={0.45} />
            <Tree x={430} y={300} s={0.4} />
            <Tree x={350} y={580} s={0.42} />
            <Tree x={650} y={640} s={0.38} />
            <Tree x={400} y={950} s={0.4} />
            <Tree x={150} y={1080} s={0.38} />
            <Tree x={350} y={1350} s={0.4} />
            <Tree x={650} y={1480} s={0.42} />
            <Tree x={400} y={1700} s={0.38} />
            <Tree x={200} y={1850} s={0.4} />
            <Tree x={500} y={2120} s={0.42} />

            {/* ── BUSHES — dense ── */}
            {[
                [60, 120], [740, 100], [250, 90], [500, 110],
                [60, 320], [740, 180], [350, 280], [150, 360],
                [80, 530], [730, 490], [400, 460], [600, 530],
                [60, 680], [740, 650], [280, 720], [500, 700],
                [60, 870], [740, 850], [150, 950], [600, 920],
                [80, 1100], [730, 1050], [400, 1080], [280, 1160],
                [60, 1290], [740, 1250], [450, 1280], [600, 1350],
                [80, 1500], [730, 1480], [350, 1530], [200, 1560],
                [60, 1680], [740, 1640], [480, 1700], [300, 1740],
                [80, 1850], [730, 1820], [400, 1880], [550, 1850],
                [60, 2020], [740, 1980], [300, 2050], [500, 2000],
                [200, 2150], [600, 2130],
            ].map(([bx, by], i) => (
                <Bush key={`b${i}`} x={bx} y={by} />
            ))}

            {/* ── FLOWERS — scattered everywhere ── */}
            {[
                [100, 70], [700, 60], [320, 100], [550, 80],
                [100, 210], [700, 300], [400, 250], [250, 200],
                [90, 400], [710, 380], [350, 440], [550, 420],
                [90, 500], [710, 460], [250, 560], [480, 580],
                [100, 700], [710, 730], [350, 750], [550, 680],
                [100, 800], [710, 830], [400, 860], [200, 830],
                [90, 1000], [710, 980], [350, 1030], [550, 1000],
                [90, 1070], [710, 1050], [250, 1120], [480, 1100],
                [100, 1280], [700, 1300], [400, 1250], [300, 1320],
                [100, 1380], [700, 1500], [350, 1440], [550, 1420],
                [90, 1600], [710, 1580], [400, 1640], [250, 1620],
                [90, 1700], [700, 1750], [350, 1780], [550, 1720],
                [100, 1900], [700, 1880], [300, 1950], [480, 1920],
                [90, 2060], [710, 2040], [400, 2100], [250, 2080],
            ].map(([fx, fy], i) => (
                <Flowers key={`f${i}`} x={fx} y={fy} />
            ))}

            {/* ── LAMPS near road ── */}
            {[
                [550, 120], [200, 300], [500, 450], [200, 600],
                [600, 700], [230, 900], [550, 1050],
                [200, 1200], [500, 1350], [200, 1500],
                [550, 1650], [280, 1800], [500, 1950],
            ].map(([lx, ly], i) => (
                <Lamp key={`la${i}`} x={lx} y={ly} />
            ))}

            {/* ── Benches ── */}
            {[
                [50, 200], [750, 200], [50, 420], [750, 400],
                [50, 680], [750, 700], [50, 960], [750, 1000],
                [50, 1250], [750, 1280], [50, 1550], [750, 1600],
                [50, 1850], [750, 1850],
            ].map(([bx, by], i) => (
                <Bench key={`be${i}`} x={bx} y={by} />
            ))}

            {/* ── Fences near stops ── */}
            <Fence x={380} y={90} w={35} />
            <Fence x={50} y={560} w={30} />
            <Fence x={650} y={950} w={35} />
            <Fence x={50} y={1350} w={30} />
            <Fence x={600} y={1500} w={35} />
            <Fence x={50} y={1750} w={30} />
            <Fence x={400} y={2060} w={35} />

            {/* ═══════ THE ROAD ═══════ */}
            {/* Road shadow */}
            <path d={ROAD_D} fill="none" stroke="#B8A080" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
            {/* Road surface — a simple warm dirt path, narrower */}
            <path ref={pathRef} d={ROAD_D} fill="none" stroke="#C4A870" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
            {/* Center line — dashed */}
            <path d={ROAD_D} fill="none" stroke="#A89060" strokeWidth="1" strokeDasharray="6 8" strokeLinecap="round" opacity="0.4" />

            {/* Gravel dots along road */}
            {[100, 250, 400, 550, 700, 850, 1000, 1150, 1300, 1450, 1600, 1750, 1900, 2050].map((_, i) => {
                // Scatter tiny dots near the path at various vertical positions
                const cx = 350 + Math.sin(i * 1.7) * 150;
                const cy = 80 + i * 150;
                return (
                    <g key={`gr${i}`}>
                        <rect x={cx - 1} y={cy} width="2" height="2" fill="#9E8A6A" opacity="0.3" />
                        <rect x={cx + 5} y={cy + 4} width="1.5" height="1.5" fill="#B09878" opacity="0.25" />
                        <rect x={cx - 4} y={cy + 7} width="1" height="1" fill="#9E8A6A" opacity="0.2" />
                    </g>
                );
            })}


            {/* ═══════ LANDMARKS — INSIDE each curve pocket ═══════ */}

            {/* HOME — start of road at (400,50), just to the left */}
            <House x={300} y={75} />

            {/* SAND PIT — road goes right (680,160) then left (300,420)
                Inside pocket of this right curve sits at center-right ~(550,260) */}
            <SandPit x={540} y={260} />

            {/* PLAYGROUND — road goes left (100,540) then right (500,810)
                Inside pocket of this left curve ~(200,620) */}
            <Swing x={180} y={610} />
            <Slide x={240} y={620} />

            {/* SCHOOL — road goes right (720,940) then left (260,1190)
                Inside pocket of this right curve ~(560,1000) */}
            <School x={560} y={1000} />

            {/* CHAI SHOP — road goes left (110,1340) then right (560,1570)
                Inside pocket of this left curve ~(220,1400) */}
            <ChaiShop x={210} y={1400} />

            {/* OFFICE — road ends near (400,2170). Road curves left at (200,1970)
                then right to end. Inside pocket ~(310,2060) */}
            <Office x={310} y={2060} />

            {/* ═══════ SECRETS / EASTER EGGS ═══════ */}
            <EasterEggManager onOpenMinigame={onOpenMinigame} onFoundEgg={onFoundEgg} />

            {/* ═══════ BICYCLE ═══════ */}
            <g
                style={{ transform: `translate(${bikeX}px, ${bikeY}px)`, transition: 'transform 0.12s ease-out', cursor: 'pointer' }}
                onClick={() => playSfx('bell')}
            >
                <g transform={`scale(${bikeFacing ? 0.35 : -0.35}, 0.35)`}>
                    <image href={imgBicycle} x="-50" y="-40" width="100" height="80" preserveAspectRatio="xMidYMid meet" />
                </g>
            </g>
        </svg>
    );
}
