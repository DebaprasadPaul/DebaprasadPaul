import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const DEFAULT_PROFILE = {
    name: 'Debaprasad Paul',
    tagline: 'Financial Operations & Systems Architect',
    subtitle: 'building structured frameworks that turn volatile portfolios into stable, scalable systems.',
    email: 'deba90020@gmail.com',
    linkedin: 'https://www.linkedin.com/in/debaprasad-paul-56a2b8158/'
};

const DEFAULT_METRICS = [
    { id: 1, value: '₹15 Cr+', label: 'Portfolio Managed' },
    { id: 2, value: '93–95%', label: 'Stabilized Performance' },
    { id: 3, value: '5+', label: 'Systems Designed' },
];

const DEFAULT_RESUMES = [
    {
        title: 'Finance Operations & P2P',
        description: 'Portfolio management and payment systems expertise',
        file: '/resumes/finance-operations.pdf'
    },
    {
        title: 'Risk & Portfolio Strategy',
        description: 'Risk analytics and portfolio stabilization',
        file: '/resumes/risk-strategy.pdf'
    },
    {
        title: 'Process Engineering & Systems',
        description: 'System design and process optimization',
        file: '/resumes/process-engineering.pdf'
    },
    {
        title: 'Executive Overview (1 Page)',
        description: 'Comprehensive single-page summary',
        file: '/resumes/executive-overview.pdf'
    }
];

export function usePortfolioData() {
    const [profile, setProfile] = useState(DEFAULT_PROFILE);
    const [metrics, setMetrics] = useState(DEFAULT_METRICS);
    const [resumes, setResumes] = useState(DEFAULT_RESUMES);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            // If no Supabase URL is set, just use defaults
            if (!import.meta.env.VITE_SUPABASE_URL) {
                setLoading(false);
                return;
            }

            try {
                const [profileRes, metricsRes, resumesRes] = await Promise.all([
                    supabase.from('profile').select('*').single(),
                    supabase.from('metrics').select('*').order('sort_order', { ascending: true }),
                    supabase.from('resumes').select('*').order('sort_order', { ascending: true })
                ]);

                if (profileRes.data) setProfile({ ...DEFAULT_PROFILE, ...profileRes.data });
                if (metricsRes.data && metricsRes.data.length > 0) setMetrics(metricsRes.data);
                if (resumesRes.data && resumesRes.data.length > 0) setResumes(resumesRes.data);

            } catch (error) {
                console.error('Error fetching portfolio data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return { profile, metrics, resumes, loading };
}
