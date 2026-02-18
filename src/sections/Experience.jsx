import { motion } from 'framer-motion';
import { useState, useMemo, useCallback } from 'react';

// Static data outside component
const MILESTONES = [
    {
        period: '2025 – Present',
        label: 'Operations & Strategy',
        summary: 'Leading financial operations, P2P processes, and MIS system design at scale.',
        details: [
            'Driving end-to-end Procure-to-Pay operations — invoice validation, vendor reconciliation, and financial controls',
            'Building MIS dashboards for real-time cost monitoring and performance tracking',
            'Establishing process governance frameworks and regulatory compliance protocols',
        ],
    },
    {
        period: '2024 – 2025',
        label: 'Portfolio & Risk Management',
        summary: 'Managing ₹12–15 Cr retail loan portfolios with 93–95% performance stability.',
        details: [
            'Managed retail loan portfolio oversight with aging analysis and recovery monitoring',
            'Led vendor performance supervision and compliance-aligned MIS reporting',
            'Conducted risk exposure tracking aligned with internal credit policies',
        ],
    },
    {
        period: '2023 – 2024',
        label: 'Recovery & Regional Oversight',
        summary: 'Overseeing multi-district delinquent portfolio recovery across Northeast India.',
        details: [
            'Supervised North East delinquent retail loan portfolio — risk exposure, bucket movement, and compliance',
            'Coordinated agency supervision and legal escalation under SARFAESI/DRT/NI Act',
            'Prepared portfolio analytics for regional review and strategic decision-making',
        ],
    },
    {
        period: 'Day One → Present',
        label: 'The Building Blocks',
        summary: 'Every system starts with a foundation. Engineering, finance, and the mindset to connect the dots.',
        details: [
            'PGDM in Finance — Pune Institute of Business Management (2023–2025)',
            'B.Tech in Electrical Engineering — MCKV Institute of Engineering (2018–2022)',
            'Developed analytical thinking, quantitative modeling, and structured problem-solving skills',
        ],
    },
];

export default function Experience() {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <section id="experience" className="px-6 py-24">
            <div className="max-w-4xl mx-auto">
                <motion.h2
                    className="text-4xl md:text-5xl font-bold text-text-primary mb-6 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    The Journey So Far
                </motion.h2>

                <motion.p
                    className="text-lg text-text-secondary text-center mb-16 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    Hover over each milestone to see what I was building.
                </motion.p>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent-cyan/40 to-transparent md:-translate-x-[0.5px]" />

                    {MILESTONES.map((m, index) => {
                        const isLeft = index % 2 === 0;
                        const isHovered = hoveredIndex === index;

                        return (
                            <motion.div
                                key={index}
                                className={`relative flex items-start mb-14 last:mb-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.12 }}
                            >
                                {/* Timeline dot */}
                                <div
                                    className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full mt-6 z-10"
                                    style={{
                                        background: isHovered ? '#22D3EE' : '#2A2A3A',
                                        boxShadow: isHovered
                                            ? '0 0 16px rgba(34, 211, 238, 0.6)'
                                            : '0 0 8px rgba(34, 211, 238, 0.2)',
                                        transform: `translateX(-50%) scale(${isHovered ? 1.5 : 1})`,
                                        transition: 'all 0.3s ease',
                                    }}
                                />

                                {/* Card */}
                                <div className={`ml-12 md:ml-0 md:w-[45%] ${isLeft ? 'md:pr-10' : 'md:pl-10'}`}>
                                    <div
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                        className="bg-dark-card rounded-xl p-6 cursor-default"
                                        style={{
                                            border: isHovered ? '1px solid #22D3EE' : '1px solid #2A2A3A',
                                            boxShadow: isHovered ? '0 0 24px rgba(34, 211, 238, 0.08)' : 'none',
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        <span className="inline-block text-[11px] font-semibold text-accent-cyan uppercase tracking-widest mb-3">
                                            {m.period}
                                        </span>

                                        <h3
                                            className="text-lg font-bold mb-2"
                                            style={{
                                                color: isHovered ? '#22D3EE' : '#F9FAFB',
                                                transition: 'color 0.2s ease',
                                            }}
                                        >
                                            {m.label}
                                        </h3>

                                        <p className="text-sm text-text-secondary leading-relaxed">
                                            {m.summary}
                                        </p>

                                        {/* Hover reveal */}
                                        <motion.div
                                            initial={false}
                                            animate={{
                                                height: isHovered ? 'auto' : 0,
                                                opacity: isHovered ? 1 : 0,
                                            }}
                                            transition={{ duration: 0.3, ease: 'easeOut' }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-4 mt-4 border-t border-dark-border/50">
                                                <ul className="space-y-2">
                                                    {m.details.map((item, i) => (
                                                        <motion.li
                                                            key={i}
                                                            className="text-xs text-text-secondary flex items-start gap-2 leading-relaxed"
                                                            initial={{ opacity: 0, x: -8 }}
                                                            animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                                                            transition={{ duration: 0.25, delay: i * 0.08 }}
                                                        >
                                                            <span className="text-accent-cyan mt-0.5 flex-shrink-0">→</span>
                                                            {item}
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
