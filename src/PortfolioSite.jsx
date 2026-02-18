import { lazy, Suspense } from 'react';
import BackgroundFlares from './components/BackgroundFlares';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';

// Lazy-load non-critical sections for performance
const Philosophy = lazy(() => import('./sections/Philosophy'));
const CaseStudy = lazy(() => import('./sections/CaseStudy'));
const SystemBlueprint = lazy(() => import('./sections/SystemBlueprint'));
const Experience = lazy(() => import('./sections/Experience'));
const Skills = lazy(() => import('./sections/Skills'));
const AIEngineering = lazy(() => import('./sections/AIEngineering'));
const ContactSection = lazy(() => import('./components/ContactSection'));
const Footer = lazy(() => import('./components/Footer'));

import { usePortfolioData } from './hooks/usePortfolioData';

export default function PortfolioSite() {
    const { profile, metrics, resumes } = usePortfolioData();

    return (
        <div className="relative min-h-screen bg-dark-bg text-text-primary overflow-x-hidden">
            {/* Animated background */}
            <BackgroundFlares />

            {/* Navigation */}
            <Navbar />

            {/* Content layer */}
            <div className="relative z-10">
                {/* Hero loads immediately */}
                <Hero profile={profile} metrics={metrics} />

                {/* Lazy-loaded sections */}
                <Suspense fallback={null}>
                    <Philosophy />
                    <CaseStudy />
                    <SystemBlueprint />
                    <Experience />
                    <Skills />
                    <AIEngineering />
                    <ContactSection profile={profile} resumes={resumes} />
                    {/* Footer merged into ContactSection */}
                </Suspense>
            </div>
        </div>
    );
}
