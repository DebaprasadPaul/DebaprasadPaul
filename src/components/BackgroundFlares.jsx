import { useEffect, useRef, useState } from 'react';

export default function BackgroundFlares() {
    const canvasRef = useRef(null);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        const isTouch =
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            window.matchMedia('(pointer: coarse)').matches;

        setIsTouchDevice(isTouch);
        // if (isTouch) return; // Removed to allow animation on mobile


        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId;
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let targetMouseX = mouseX;
        let targetMouseY = mouseY;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        const handleMouseMove = (e) => {
            targetMouseX = e.clientX;
            targetMouseY = e.clientY;
        };

        if (!isTouch) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        // Particle configuration
        const PARTICLE_COUNT = isTouch ? 40 : 80; // Reduce particles on mobile for performance
        const particles = [];

        // Color palette: cyan, indigo, white, soft pink
        const colors = [
            { r: 34, g: 211, b: 238 },   // cyan
            { r: 99, g: 102, b: 241 },   // indigo
            { r: 255, g: 255, b: 255 },  // white
            { r: 244, g: 114, b: 182 },  // pink
            { r: 251, g: 191, b: 36 },   // amber
        ];

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 3 + 0.8; // 0.8 - 3.8px
            const isLine = Math.random() > 0.65; // 35% are short dashes

            particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                baseX: Math.random() * window.innerWidth,
                baseY: Math.random() * window.innerHeight,
                size,
                isLine,
                lineLength: isLine ? Math.random() * 8 + 4 : 0,
                angle: Math.random() * Math.PI * 2,
                color,
                opacity: Math.random() * 0.5 + 0.15, // 0.15 - 0.65
                // Slow, organic drift
                driftSpeedX: (Math.random() - 0.5) * 0.3,
                driftSpeedY: (Math.random() - 0.5) * 0.3,
                driftPhase: Math.random() * Math.PI * 2,
                driftAmplitudeX: Math.random() * 30 + 10,
                driftAmplitudeY: Math.random() * 20 + 8,
                // Mouse responsiveness (slow, smooth)
                mouseInfluence: Math.random() * 0.012 + 0.003,
                // Twinkle
                twinkleSpeed: Math.random() * 0.015 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2,
            });
        }

        let time = 0;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Smooth, slow mouse lerp
            mouseX += (targetMouseX - mouseX) * 0.04;
            mouseY += (targetMouseY - mouseY) * 0.04;

            time += 0.008;

            particles.forEach((p) => {
                // Slow organic drift around base position
                const driftX = Math.sin(time * p.driftSpeedX * 2 + p.driftPhase) * p.driftAmplitudeX;
                const driftY = Math.cos(time * p.driftSpeedY * 2 + p.driftPhase * 1.3) * p.driftAmplitudeY;

                // Gentle mouse influence (repulsion/attraction mix)
                const dx = mouseX - p.baseX;
                const dy = mouseY - p.baseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 300;
                // Only calculate mouse influence on non-touch devices
                const influence = (!isTouch && dist < maxDist) ? (1 - dist / maxDist) * p.mouseInfluence : 0;

                p.x = p.baseX + driftX + dx * influence * 8;
                p.y = p.baseY + driftY + dy * influence * 8;

                // Keep particles within viewport bounds
                const margin = 20;
                if (p.x < -margin) p.baseX = canvas.width + margin;
                if (p.x > canvas.width + margin) p.baseX = -margin;
                if (p.y < -margin) p.baseY = canvas.height + margin;
                if (p.y > canvas.height + margin) p.baseY = -margin;

                // Twinkle opacity
                const twinkle = Math.sin(time * p.twinkleSpeed * 10 + p.twinklePhase) * 0.3 + 0.7;
                const finalOpacity = p.opacity * twinkle;

                const { r, g, b } = p.color;

                ctx.save();
                ctx.globalAlpha = finalOpacity;

                if (p.isLine) {
                    // Draw short dash/line
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.angle + time * 0.2);
                    ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
                    ctx.lineWidth = p.size * 0.6;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(-p.lineLength / 2, 0);
                    ctx.lineTo(p.lineLength / 2, 0);
                    ctx.stroke();
                } else {
                    // Draw dot/circle
                    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
            if (!isTouchDevice) {
                window.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, [isTouchDevice]);

    // if (isTouchDevice) return null; // Enabled for all devices now

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
        />
    );
}
