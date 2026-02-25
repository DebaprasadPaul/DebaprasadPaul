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

const DEFAULT_NAV_CONTENT = {
    story: {
        title: '📖 My Story',
        content: `From barefoot mornings in a small-town home to managing ₹15 Cr+ portfolios — this is the journey of a boy who believed numbers could tell stories.

It started with curiosity. A fascination with how systems work, how money flows, how risk hides in plain sight. While others saw spreadsheets, I saw puzzles waiting to be solved.

After years of building financial frameworks, designing risk models, and stabilizing volatile portfolios, I realized something — the best systems aren't just efficient, they're elegant.

Today I architect structured frameworks that turn chaos into clarity. Every process I design carries that same childhood wonder: "What if we could make this better?"

This portfolio is my story told the way I see the world — as a journey, with stops along the way, and always room for one more adventure.`
    },
    skills: {
        title: '⚡ Skills & Expertise',
        content: `FINANCIAL OPERATIONS
• Portfolio Management (₹15 Cr+)
• Risk Analysis & Mitigation
• P2P Payment Systems
• Financial Modeling & Forecasting

SYSTEMS ARCHITECTURE  
• Process Engineering & Design
• Workflow Automation
• Data Pipeline Architecture
• Performance Optimization (93-95% stabilization)

ANALYTICAL TOOLS
• Advanced Excel & VBA
• Python for Finance
• SQL & Database Design
• Business Intelligence Dashboards

SOFT SKILLS
• Strategic Thinking
• Cross-functional Leadership
• Stakeholder Communication
• Problem Decomposition`
    },
    work: {
        title: '💼 Work & Projects',
        content: `PORTFOLIO STABILIZATION ENGINE
Designed a structured framework that took a volatile ₹15 Cr+ portfolio from unpredictable swings to 93-95% stabilized performance. Built custom risk models and automated rebalancing triggers.

P2P PAYMENT OPERATIONS
Architected end-to-end payment processing systems handling high-volume transactions. Designed reconciliation workflows that reduced discrepancies by 80%.

FINANCIAL REPORTING AUTOMATION
Built automated reporting pipelines that transformed raw financial data into actionable insights. Reduced manual reporting time from days to hours.

PROCESS RE-ENGINEERING
Led multiple process optimization initiatives, mapping existing workflows, identifying bottlenecks, and designing streamlined alternatives. Each project delivered measurable efficiency gains.

EQUITY RESEARCH FRAMEWORK
Developed a multi-agent research workflow combining PESTLE analysis, VRIO frameworks, and financial modeling to produce institutional-grade equity research reports.`
    }
};

export function usePortfolioData() {
    const [profile, setProfile] = useState(DEFAULT_PROFILE);
    const [metrics, setMetrics] = useState(DEFAULT_METRICS);
    const [resumes, setResumes] = useState(DEFAULT_RESUMES);
    const [navContent, setNavContent] = useState(DEFAULT_NAV_CONTENT);
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

                // Fetch nav content
                try {
                    const { data: navData } = await supabase.from('nav_content').select('*');
                    if (navData && navData.length > 0) {
                        const mapped = {};
                        navData.forEach(row => {
                            mapped[row.id] = { title: row.title, content: row.content };
                        });
                        setNavContent(prev => ({ ...prev, ...mapped }));
                    }
                } catch (e) {
                    // nav_content table may not exist yet, use defaults
                }

            } catch (error) {
                console.error('Error fetching portfolio data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return { profile, metrics, resumes, navContent, loading };
}
