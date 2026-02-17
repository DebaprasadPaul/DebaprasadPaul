import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';

export default function UpdateMetrics() {
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchMetrics();
    }, []);

    async function fetchMetrics() {
        try {
            const { data, error } = await supabase
                .from('metrics')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;
            setMetrics(data || []);
        } catch (error) {
            console.error('Error fetching metrics:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (index, field, value) => {
        const updated = [...metrics];
        updated[index][field] = value;
        setMetrics(updated);
    };

    const handleSave = async (metric) => {
        setMessage(null);
        try {
            const { error } = await supabase
                .from('metrics')
                .update({ value: metric.value, label: metric.label, sort_order: metric.sort_order })
                .eq('id', metric.id);

            if (error) throw error;
            setMessage({ type: 'success', text: 'Metric updated!', id: metric.id });

            // Clear success message after 2 seconds
            setTimeout(() => setMessage(null), 2000);
        } catch (error) {
            console.error('Error updating metric:', error);
            setMessage({ type: 'error', text: 'Failed to update.', id: metric.id });
        }
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-dark-bg p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <h1 className="text-3xl font-bold text-white">Update Metrics</h1>
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="px-4 py-2 border border-dark-border text-text-secondary rounded-lg hover:text-white transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>

                <div className="grid gap-6">
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={metric.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-dark-card border border-dark-border p-6 rounded-xl flex flex-col md:flex-row gap-4 items-end"
                        >
                            <div className="flex-1 w-full">
                                <label className="block text-xs text-text-secondary mb-1">Value (Big Text)</label>
                                <input
                                    type="text"
                                    value={metric.value}
                                    onChange={(e) => handleChange(index, 'value', e.target.value)}
                                    className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-accent-cyan font-bold"
                                />
                            </div>

                            <div className="flex-1 w-full">
                                <label className="block text-xs text-text-secondary mb-1">Label (Small Text)</label>
                                <input
                                    type="text"
                                    value={metric.label}
                                    onChange={(e) => handleChange(index, 'label', e.target.value)}
                                    className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-text-primary"
                                />
                            </div>

                            <div className="w-20">
                                <label className="block text-xs text-text-secondary mb-1">Order</label>
                                <input
                                    type="number"
                                    value={metric.sort_order}
                                    onChange={(e) => handleChange(index, 'sort_order', parseInt(e.target.value))}
                                    className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-text-primary"
                                />
                            </div>

                            <button
                                onClick={() => handleSave(metric)}
                                className="bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30 px-4 py-2 rounded hover:bg-accent-cyan hover:text-dark-bg transition-colors"
                            >
                                Save
                            </button>

                            {message && message.id === metric.id && (
                                <span className={`text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                    {message.text}
                                </span>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
