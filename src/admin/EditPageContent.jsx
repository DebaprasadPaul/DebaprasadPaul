import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SECTIONS = [
    { id: 'story', label: '📖 Story', description: 'Your personal narrative — who you are and how you got here.' },
    { id: 'skills', label: '⚡ Skills', description: 'Technical and soft skills, tools, and expertise areas.' },
    { id: 'work', label: '💼 Work', description: 'Projects, roles, and key professional achievements.' },
];

export default function EditPageContent() {
    const [contents, setContents] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(null); // which section is saving
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchContent();
    }, []);

    async function fetchContent() {
        try {
            const { data, error } = await supabase.from('nav_content').select('*');
            if (error) {
                // Table might not exist yet — that's OK, just show empty form
                console.warn('nav_content table not found, showing empty form:', error.message);
                setMessage({ type: 'info', text: 'ℹ nav_content table not found in Supabase yet. Create it to save changes. You can still edit fields below.' });
                setLoading(false);
                return;
            }
            const mapped = {};
            if (data) {
                data.forEach(row => {
                    mapped[row.id] = { title: row.title, content: row.content };
                });
            }
            setContents(mapped);
        } catch (error) {
            console.warn('Could not fetch nav_content:', error);
            setMessage({ type: 'info', text: 'ℹ Could not connect to Supabase. You can still edit fields below for reference.' });
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (sectionId, field, value) => {
        setContents(prev => ({
            ...prev,
            [sectionId]: {
                ...prev[sectionId],
                [field]: value,
            }
        }));
    };

    async function handleSave(sectionId) {
        setSaving(sectionId);
        setMessage(null);

        const data = contents[sectionId];
        if (!data || !data.title || !data.content) {
            setMessage({ type: 'error', text: 'Title and content are required.' });
            setSaving(null);
            return;
        }

        try {
            // Upsert (insert or update based on id)
            const { error } = await supabase
                .from('nav_content')
                .upsert({
                    id: sectionId,
                    title: data.title,
                    content: data.content,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'id' });

            if (error) throw error;
            setMessage({ type: 'success', text: `${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} saved successfully!` });
        } catch (error) {
            console.error('Error saving content:', error);
            setMessage({ type: 'error', text: `Failed to save ${sectionId}. Check console.` });
        } finally {
            setSaving(null);
        }
    }

    if (loading) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-dark-bg p-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-white">Edit Page Content</h1>
                    <Link to="/admin/dashboard" className="px-4 py-2 border border-dark-border text-text-secondary rounded-lg hover:text-white transition-colors">
                        ← Back
                    </Link>
                </div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-500/10 text-green-400' :
                                message.type === 'info' ? 'bg-amber-500/10 text-amber-400' :
                                    'bg-red-500/10 text-red-400'
                            }`}
                    >
                        {message.text}
                    </motion.div>
                )}

                <p className="text-text-secondary text-sm mb-8">
                    Edit the content shown in the Story, Skills, and Work dialog boxes on the main site.
                    Use line breaks to create paragraphs. Changes take effect immediately after saving.
                </p>

                {SECTIONS.map(section => (
                    <div key={section.id} className="mb-10 p-6 bg-dark-card border border-dark-border rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-semibold text-white">{section.label}</h2>
                                <p className="text-text-secondary text-xs mt-1">{section.description}</p>
                            </div>
                            <button
                                onClick={() => handleSave(section.id)}
                                disabled={saving === section.id}
                                className="bg-accent-cyan text-dark-bg px-5 py-2 rounded-lg font-bold text-sm hover:bg-cyan-400 transition-colors disabled:opacity-50"
                            >
                                {saving === section.id ? 'Saving...' : 'Save'}
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Title (with emoji)</label>
                                <input
                                    type="text"
                                    value={contents[section.id]?.title || ''}
                                    onChange={(e) => handleChange(section.id, 'title', e.target.value)}
                                    placeholder={`e.g. ${section.label}`}
                                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-cyan"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Content (use line breaks for paragraphs)</label>
                                <textarea
                                    value={contents[section.id]?.content || ''}
                                    onChange={(e) => handleChange(section.id, 'content', e.target.value)}
                                    rows={10}
                                    placeholder="Write the content that appears in the dialog..."
                                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-cyan font-mono text-sm leading-relaxed"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
