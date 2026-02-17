import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/admin');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg text-text-primary p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                <header className="flex items-center justify-between mb-12 border-b border-dark-border pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                        <p className="text-text-secondary">Welcome back, <span className="text-accent-cyan">{user?.email}</span></p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/site')}
                            className="px-4 py-2 text-text-secondary hover:text-accent-cyan transition-colors"
                        >
                            Back to Site
                        </button>
                        <button
                            onClick={handleSignOut}
                            className="px-6 py-2 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Section Cards */}
                    <div className="p-6 bg-dark-card border border-dark-border rounded-xl">
                        <h2 className="text-xl font-semibold mb-4 text-white">Profile & Settings</h2>
                        <p className="text-text-secondary text-sm mb-6">Update your name, tagline, and social links.</p>
                        <Link to="/admin/profile" className="inline-block text-accent-cyan text-sm font-medium hover:underline">
                            Edit Profile →
                        </Link>
                    </div>

                    <div className="p-6 bg-dark-card border border-dark-border rounded-xl">
                        <h2 className="text-xl font-semibold mb-4 text-white">Resumes</h2>
                        <p className="text-text-secondary text-sm mb-6">Manage and upload resume PDF files.</p>
                        <Link to="/admin/resumes" className="inline-block text-accent-cyan text-sm font-medium hover:underline">
                            Manage Resumes →
                        </Link>
                    </div>

                    <div className="p-6 bg-dark-card border border-dark-border rounded-xl">
                        <h2 className="text-xl font-semibold mb-4 text-white">Metrics</h2>
                        <p className="text-text-secondary text-sm mb-6">Update the key performance metrics on the hero section.</p>
                        <Link to="/admin/metrics" className="inline-block text-accent-cyan text-sm font-medium hover:underline">
                            Update Metrics →
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
