import { motion } from 'framer-motion';

// Static data outside component — no re-creation on render
const CATEGORIES = [
    {
        title: 'Finance & Analytics',
        skills: [
            'Portfolio Management', 'Risk Analytics', 'P2P Operations',
            'Financial Modeling', 'MIS Reporting', 'Variance Analysis',
        ],
    },
    {
        title: 'Systems & Process',
        skills: [
            'Process Architecture', 'Workflow Automation', 'Operational Governance',
            'SOP Design', 'Root Cause Analysis', 'Stakeholder Mapping',
        ],
    },
    {
        title: 'Technology & Tools',
        skills: [
            'Advanced Excel / VBA', 'Python (Pandas)', 'SQL / Databases',
            'Power BI / Dashboards', 'AI Prompt Engineering', 'React / Web Dev',
        ],
    },
];

export default function Skills() {
    return (
        <section id="skills" className="px-6 py-24">
            <div className="max-w-6xl mx-auto">
                <motion.h2
                    className="text-4xl md:text-5xl font-bold text-text-primary mb-16 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Skills & Toolset
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {CATEGORIES.map((cat, catIndex) => (
                        <motion.div
                            key={cat.title}
                            className="bg-dark-card border border-dark-border rounded-2xl p-8 hover:border-accent-cyan transition-colors duration-300"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: catIndex * 0.15 }}
                        >
                            <h3 className="text-lg font-bold text-accent-cyan mb-6">
                                {cat.title}
                            </h3>

                            {/* Batch: all skills animate together with parent card, not individually */}
                            <div className="flex flex-wrap gap-2">
                                {cat.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="text-xs font-medium px-3 py-1.5 rounded-full border border-dark-border text-text-secondary hover:border-accent-cyan hover:text-accent-cyan hover:shadow-[0_0_12px_rgba(34,211,238,0.15)] transition-all duration-200 cursor-default"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
