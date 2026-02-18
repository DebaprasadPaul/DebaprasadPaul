
import { motion } from 'framer-motion';
import { useState } from 'react';
import ResumeModal from './ResumeModal';
import { ArrowUpRight, FileText } from 'lucide-react';

export default function ContactSection({ profile, resumes }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const links = [
        {
            label: 'Email',
            value: profile?.email || 'email@example.com',
            href: `mailto:${profile?.email}`,
            isExternal: false
        },
        {
            label: 'LinkedIn',
            value: 'Connect on LinkedIn',
            href: profile?.linkedin,
            isExternal: true
        },
        {
            label: 'GitHub',
            value: 'View Code',
            href: profile?.github_url,
            isExternal: true
        }
    ];

    return (
        <section className="relative px-6 pb-6 overflow-hidden">

            {/* Motto Section - Snaps here on nav click */}
            <div id="contact" className="min-h-screen flex flex-col justify-center items-start max-w-7xl mx-auto w-full z-10 transition-all">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-text-primary leading-tight mb-8">
                        LET'S BUILD <br />
                        <span className="text-accent-cyan">SOMETHING</span> <br />
                        THAT WORKS.
                    </h2>
                    <p className="text-xl md:text-2xl text-text-secondary max-w-2xl font-light">
                        Robust systems. Scalable architectures. <br />
                        If you value honesty in engineering, get in touch.
                    </p>
                </motion.div>
            </div>

            {/* Big Links & Documents - Revealed on Scroll */}
            <div className="min-h-[60vh] flex flex-col justify-center max-w-7xl mx-auto w-full z-10 transition-colors">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                    {/* Links */}
                    <div className="flex flex-col gap-6">
                        {links.filter(l => l.href).map((link, index) => (
                            <motion.a
                                key={index}
                                href={link.href}
                                target={link.isExternal ? "_blank" : undefined}
                                rel={link.isExternal ? "noopener noreferrer" : undefined}
                                className="group flex items-center gap-4 text-3xl md:text-5xl font-bold text-text-muted hover:text-white transition-colors duration-300"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                                <span>{link.label}</span>
                                <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-2 group-hover:-translate-y-2" size={40} />
                            </motion.a>
                        ))}
                    </div>

                    {/* Documents Trigger */}
                    <div className="flex justify-start md:justify-end">
                        <motion.button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-3 text-text-secondary hover:text-accent-cyan transition-colors group px-6 py-3 border border-dark-border rounded-full hover:border-accent-cyan/50 bg-dark-card/50 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                        >
                            <FileText size={20} />
                            <span className="font-mono text-sm uppercase tracking-wider hidden md:inline">Access Documents</span>
                        </motion.button>
                    </div>
                </div>
                {/* Footer Content - Merged */}
                <div className="w-full pt-20 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-text-secondary border-t border-dark-border/0">
                    {/* Copyright */}
                    <div className="order-2 md:order-1">
                        © {new Date().getFullYear()} {profile?.name || 'Debaprasad Paul'}. All rights reserved.
                    </div>

                    {/* Built With */}
                    <div className="flex items-center gap-1 order-1 md:order-2">
                        Built with <span className="text-accent-cyan">React</span> + <span className="text-accent-cyan">Framer Motion</span>
                    </div>
                </div>
            </div>


            <ResumeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} resumes={resumes} />
        </section >
    );
}
