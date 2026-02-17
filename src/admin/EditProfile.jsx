import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';

export default function EditProfile() {
    const [profile, setProfile] = useState({
        name: '',
        tagline: '',
        subtitle: '',
        email: '',
        linkedin: '',
        github_url: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            const { data, error } = await supabase.from('profile').select('*').single();
            if (error && error.code !== 'PGRST116') throw error; // PGRST116 is no rows found
            if (data) setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage({ type: 'error', text: 'Failed to load profile data.' });
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            // Check if profile exists to decide update vs insert
            const { data: existing } = await supabase.from('profile').select('id').single();

            if (existing) {
                const { error } = await supabase
                    .from('profile')
                    .update(profile)
                    .eq('id', existing.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('profile').insert([profile]);
                if (error) throw error;
            }

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            console.error('Error saving profile:', error);
            setMessage({ type: 'error', text: 'Failed to save changes.' });
        } finally {
            setSaving(false);
        }
    }

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-dark-bg p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Edit Profile</h1>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                            }`}
                    >
                        {message.text}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-cyan"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Tagline (Uppercase small text)</label>
                        <input
                            type="text"
                            name="tagline"
                            value={profile.tagline || ''}
                            onChange={handleChange}
                            className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-cyan"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Subtitle (Main description)</label>
                        <textarea
                            name="subtitle"
                            value={profile.subtitle || ''}
                            onChange={handleChange}
                            rows={3}
                            className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-cyan"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={profile.email || ''}
                            onChange={handleChange}
                            className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-cyan"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">LinkedIn URL</label>
                        <input
                            type="url"
                            name="linkedin"
                            value={profile.linkedin || ''}
                            onChange={handleChange}
                            className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-cyan"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">GitHub URL</label>
                        <input
                            type="url"
                            name="github_url"
                            value={profile.github_url || ''}
                            onChange={handleChange}
                            className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-cyan"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-accent-cyan text-dark-bg px-6 py-3 rounded-lg font-bold hover:bg-cyan-400 transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-6 py-3 border border-dark-border text-text-secondary rounded-lg hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
