import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import PortfolioSite from './PortfolioSite';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import EditProfile from './admin/EditProfile';
import UpdateMetrics from './admin/UpdateMetrics';
import ManageResumes from './admin/ManageResumes';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SplashScreen />} />
                <Route path="/site" element={<PortfolioSite />} />
                <Route path="/admin" element={<AdminLogin />} />

                {/* Protected Admin Routes */}
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/admin/profile" element={
                    <ProtectedRoute>
                        <EditProfile />
                    </ProtectedRoute>
                } />
                <Route path="/admin/metrics" element={
                    <ProtectedRoute>
                        <UpdateMetrics />
                    </ProtectedRoute>
                } />
                <Route path="/admin/resumes" element={
                    <ProtectedRoute>
                        <ManageResumes />
                    </ProtectedRoute>
                } />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
