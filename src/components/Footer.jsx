import { Mail, Linkedin, Github } from 'lucide-react';

export default function Footer({ profile }) {
    return (
        <footer className="border-t border-dark-border px-6 py-8">
            <div className="max-w-6xl mx-auto flex flex-col md:grid md:grid-cols-3 items-center gap-6 md:gap-4">
                {/* Copyright - Left */}
                <div className="text-sm text-text-secondary text-center md:text-left order-2 md:order-1">
                    © {new Date().getFullYear()} {profile?.name || 'Debaprasad Paul'}. All rights reserved.
                </div>

                {/* Links - Center */}
                <div className="flex items-center justify-center gap-6 order-1 md:order-2">
                    <a
                        href={`mailto:${profile?.email}`}
                        className="flex items-center gap-2 text-text-secondary hover:text-accent-cyan transition-colors"
                        title="Email"
                    >
                        <Mail size={18} />
                        <span className="hidden md:inline text-sm">Email</span>
                    </a>
                    <a
                        href={profile?.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-text-secondary hover:text-accent-cyan transition-colors"
                        title="LinkedIn"
                    >
                        <Linkedin size={18} />
                        <span className="hidden md:inline text-sm">LinkedIn</span>
                    </a>
                    {profile?.github_url && (
                        <a
                            href={profile?.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-text-secondary hover:text-accent-cyan transition-colors"
                            title="GitHub"
                        >
                            <Github size={18} />
                            <span className="hidden md:inline text-sm">GitHub</span>
                        </a>
                    )}
                </div>

                {/* Built With - Right */}
                <div className="text-xs text-text-muted flex items-center justify-center md:justify-end gap-1 order-3 md:order-3">
                    Built with
                    <span className="text-accent-cyan">React</span>
                    +
                    <span className="text-accent-cyan">Framer Motion</span>
                </div>
            </div>
        </footer>
    );
}
