import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function ManageResumes() {
    const { signOut } = useAuth();
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [newResume, setNewResume] = useState({ title: '', description: '', file: null, sort_order: 0 });
    const [totalSize, setTotalSize] = useState(0);
    const [showAddForm, setShowAddForm] = useState(false);
    const [message, setMessage] = useState(null);
    const MAX_RESUMES = 20;
    const MAX_SELECTED = 20;
    const MAX_STORAGE_MB = 400;

    useEffect(() => {
        fetchResumes();
        calculateStorageUsage();
    }, []);

    async function calculateStorageUsage() {
        try {
            const { data, error } = await supabase.storage.from('resumes').list();
            if (error) throw error;

            const totalBytes = data.reduce((acc, file) => acc + (file.metadata?.size || 0), 0);
            setTotalSize(totalBytes);
        } catch (error) {
            console.error('Error calculating storage:', error);
        }
    }

    async function fetchResumes() {
        try {
            const { data, error } = await supabase
                .from('resumes')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Filter out any potential empty/ghost rows
            const validResumes = (data || []).filter(r => r.title || r.file_url);
            setResumes(validResumes);
        } catch (error) {
            console.error('Error fetching resumes:', error);
            setMessage({ type: 'error', text: 'Error loading resumes' });
        } finally {
            setLoading(false);
        }
    }

    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const handleDeleteClick = (id, fileUrl) => {
        setDeleteConfirm({ id, fileUrl });
    };

    const confirmDelete = async () => {
        if (!deleteConfirm) return;
        const { id, fileUrl } = deleteConfirm;

        try {
            const { error: dbError } = await supabase.from('resumes').delete().eq('id', id);
            if (dbError) throw dbError;

            if (fileUrl) {
                const fileName = fileUrl.split('/').pop();
                if (fileName && fileName.includes('.')) {
                    await supabase.storage.from('resumes').remove([fileName]);
                }
            }

            setResumes(resumes.filter(r => r.id !== id));
            calculateStorageUsage(); // Recalculate size
            setMessage({ type: 'success', text: 'Resume deleted.' });
        } catch (error) {
            console.error('Error deleting resume:', error);
            setMessage({ type: 'error', text: 'Failed to delete resume.' });
        } finally {
            setDeleteConfirm(null);
        }
    };

    const handleToggleSelect = async (resume) => {
        const selectedCount = resumes.filter(r => r.is_selected).length;

        // If trying to select a 4th one, block it
        if (!resume.is_selected && selectedCount >= MAX_SELECTED) {
            alert(`You can only select up to ${MAX_SELECTED} resumes to display.`);
            return;
        }

        try {
            const { error } = await supabase
                .from('resumes')
                .update({ is_selected: !resume.is_selected })
                .eq('id', resume.id);

            if (error) throw error;

            // Optimistic update
            const updatedResumes = resumes.map(r =>
                r.id === resume.id ? { ...r, is_selected: !r.is_selected } : r
            );
            setResumes(updatedResumes);

        } catch (error) {
            console.error('Error updating selection:', error);
            alert('Failed to update selection');
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        setMessage(null);

        if (resumes.length >= MAX_RESUMES) {
            setMessage({ type: 'error', text: `Maximum of ${MAX_RESUMES} resumes allowed.` });
            setUploading(false);
            return;
        }

        try {
            let fileUrl = '';

            if (newResume.file) {
                // Check if file fits in remaining space
                const fileSizeMB = newResume.file.size / (1024 * 1024);
                const usedMB = totalSize / (1024 * 1024);

                if (usedMB + fileSizeMB > MAX_STORAGE_MB) {
                    throw new Error(`Not enough storage space. Remaining: ${(MAX_STORAGE_MB - usedMB).toFixed(2)} MB`);
                }

                const fileExt = newResume.file.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('resumes')
                    .upload(fileName, newResume.file);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from('resumes').getPublicUrl(fileName);
                fileUrl = data.publicUrl;
            }

            const { data, error } = await supabase.from('resumes').insert([{
                title: newResume.title,
                description: newResume.description,
                file_url: fileUrl,
                is_selected: false // Default to not selected
            }]).select();

            if (error) throw error;

            setResumes([data[0], ...resumes]);
            setNewResume({ title: '', description: '', file: null });
            setShowAddForm(false);
            calculateStorageUsage(); // Update usage
            setMessage({ type: 'success', text: 'Resume added successfully!' });

        } catch (error) {
            console.error('Error adding resume:', error);

            // Handle session expiry/corruption (Invalid Compact JWS)
            if (error.message && (error.message.includes('Invalid Compact JWS') || error.message.includes('JWT'))) {
                alert('Session expired or invalid. Logging out to refresh...');
                await signOut();
                window.location.href = '/portfolio/admin';
                return;
            }

            setMessage({ type: 'error', text: 'Failed to save: ' + error.message });
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;

    const usedMB = (totalSize / (1024 * 1024)).toFixed(2);
    const percentUsed = Math.min((totalSize / (MAX_STORAGE_MB * 1024 * 1024)) * 100, 100);

    return (
        <div className="min-h-screen bg-dark-bg p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Manage Documents</h1>
                    <Link to="/admin/dashboard" className="px-4 py-2 border border-dark-border text-text-secondary rounded-lg hover:text-white transition-colors">
                        Back to Dashboard
                    </Link>
                </div>

                {/* Storage Meter */}
                <div className="bg-dark-card border border-dark-border p-4 rounded-xl mb-6">
                    <div className="flex justify-between text-sm text-text-secondary mb-2">
                        <span>Storage Usage</span>
                        <span>{usedMB} MB / {MAX_STORAGE_MB} MB</span>
                    </div>
                    <div className="w-full bg-dark-bg h-2.5 rounded-full overflow-hidden border border-dark-border">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${percentUsed > 90 ? 'bg-red-500' : 'bg-accent-cyan'}`}
                            style={{ width: `${percentUsed}%` }}
                        ></div>
                    </div>
                </div>

                {message && (
                    <div className={`p-4 rounded mb-4 ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {message.text}
                    </div>
                )}

                {/* Confirmation Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-dark-card border border-dark-border p-6 rounded-xl max-w-sm w-full shadow-2xl"
                        >
                            <h3 className="text-xl font-bold text-white mb-2">Confirm Delete</h3>
                            <p className="text-text-secondary mb-6">Are you sure you want to delete this resume? This action cannot be undone.</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-4 py-2 text-text-secondary hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {resumes.length < MAX_RESUMES ? (
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="mb-6 bg-accent-cyan text-dark-bg px-4 py-2 rounded font-bold hover:bg-cyan-400 transition-colors"
                    >
                        {showAddForm ? 'Cancel' : '+ Add New Document'}
                    </button>
                ) : (
                    <div className="mb-6 p-3 bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 rounded-lg inline-block text-sm">
                        Max capacity reached ({MAX_RESUMES} documents). Delete some to add more.
                    </div>
                )}

                {showAddForm && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-dark-card border border-dark-border p-6 rounded-xl mb-8 space-y-4"
                        onSubmit={handleAddSubmit}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                placeholder="Title (e.g. Finance Ops)"
                                className="bg-dark-bg border border-dark-border p-2 rounded text-white"
                                value={newResume.title}
                                onChange={e => setNewResume({ ...newResume, title: e.target.value })}
                                required
                            />
                            <input
                                type="file"
                                accept=".pdf"
                                className="bg-dark-bg border border-dark-border p-2 rounded text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-cyan file:text-dark-bg hover:file:bg-cyan-400"
                                onChange={e => setNewResume({ ...newResume, file: e.target.files[0] })}
                                required
                            />
                        </div>
                        <textarea
                            placeholder="Description (short summary)"
                            className="w-full bg-dark-bg border border-dark-border p-2 rounded text-white"
                            rows={2}
                            value={newResume.description}
                            onChange={e => setNewResume({ ...newResume, description: e.target.value })}
                        />
                        <div className="flex items-center justify-end gap-4">
                            <button
                                type="submit"
                                disabled={uploading}
                                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-500 disabled:opacity-50"
                            >
                                {uploading ? 'Uploading...' : 'Save'}
                            </button>
                        </div>
                    </motion.form>
                )}

                <div className="grid gap-4">
                    {resumes.map((resume) => (
                        <div key={resume.id} className={`bg-dark-card border ${resume.is_selected ? 'border-accent-cyan/50 shadow-[0_0_15px_-5px_rgba(34,211,238,0.1)]' : 'border-dark-border'} p-4 rounded-xl flex justify-between items-center group transition-all`}>
                            <div className="flex items-start gap-4">
                                <input
                                    type="checkbox"
                                    checked={!!resume.is_selected}
                                    onChange={() => handleToggleSelect(resume)}
                                    className="mt-1 w-5 h-5 rounded border-dark-border bg-dark-bg text-accent-cyan focus:ring-accent-cyan/50"
                                />
                                <div>
                                    <h3 className="font-bold text-white flex items-center gap-2">
                                        {resume.title}
                                        {resume.is_selected && <span className="text-[10px] bg-accent-cyan text-dark-bg px-2 py-0.5 rounded-full font-bold">SHOWN</span>}
                                    </h3>
                                    <p className="text-sm text-text-secondary">{resume.description}</p>
                                    <a href={resume.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent-cyan hover:underline truncate max-w-md block">
                                        {resume.file_url}
                                    </a>
                                </div>
                            </div>

                            <button
                                onClick={() => handleDeleteClick(resume.id, resume.file_url)}
                                className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 rounded hover:bg-red-500/10"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                    {resumes.length === 0 && (
                        <div className="text-center text-text-secondary py-8">
                            No documents found. Add one above!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import { Link } from 'react-router-dom';
