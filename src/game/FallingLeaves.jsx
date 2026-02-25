import { useMemo } from 'react';

// Simple CSS-based falling leaves — slow & gentle
export default function FallingLeaves() {
    const leaves = useMemo(() => {
        return Array.from({ length: 15 }, (_, i) => ({
            left: `${Math.random() * 100}%`,
            delay: `${Math.random() * 20}s`,
            duration: `${18 + Math.random() * 12}s`, // 18–30 seconds (very slow)
            size: 6 + Math.random() * 6,
            color: ['#C89B3C', '#A0522D', '#8B4513', '#D4A76A', '#B5651D'][i % 5],
            opacity: 0.4 + Math.random() * 0.3,
        }));
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
            {leaves.map((leaf, i) => (
                <div
                    key={i}
                    className="leaf"
                    style={{
                        left: leaf.left,
                        animationDelay: leaf.delay,
                        animationDuration: leaf.duration,
                        width: leaf.size,
                        height: leaf.size,
                        backgroundColor: leaf.color,
                        opacity: leaf.opacity,
                        borderRadius: '1px',  // Slightly pixelated
                    }}
                />
            ))}
        </div>
    );
}
