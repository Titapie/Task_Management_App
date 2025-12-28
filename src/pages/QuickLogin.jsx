import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';

const QuickLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleQuickLogin = async () => {
        setLoading(true);
        setError(null);

        try {
            // ✅ Gọi login từ AuthContext
            const userData = await login({
                Email: 'pnhtrieu186@gmail.com',
                Password: 'password123'
            });

            console.log('✅ Login successful:', userData);
            console.log('📋 User Role:', userData?.Role);

            // ✅ Đợi một chút để AuthContext update state
            await new Promise(resolve => setTimeout(resolve, 200));

            // ✅ Kiểm tra role và redirect - kiểm tra cả 2 cách
            const isAdminFromUser = userData?.Role === 'admin';
            const isAdminFromToken = userService.isAdmin();

            console.log('🔐 Is Admin (from userData):', isAdminFromUser);
            console.log('🔐 Is Admin (from token):', isAdminFromToken);

            const isAdmin = isAdminFromUser || isAdminFromToken;

            if (isAdmin) {
                console.log('➡️ Redirecting to /admin/dashboard');
                navigate('/admin/dashboard', { replace: true });
            } else {
                console.log('➡️ Redirecting to /dashboard');
                navigate('/dashboard', { replace: true });
            }

        } catch (err) {
            console.error('❌ Login error:', err);
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-3xl">N</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                        Quick Login
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Development access only
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-600 dark:text-red-400 text-sm">
                            ❌ {error}
                        </p>
                    </div>
                )}

                <button
                    onClick={handleQuickLogin}
                    disabled={loading}
                    className="w-full py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Đang đăng nhập...
                        </span>
                    ) : (
                        '🚀 Quick Login as Admin'
                    )}
                </button>

                <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                        📧 Email: admin@gmail.com<br />
                        🔑 Password: password123<br />
                        👤 Role: Admin
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QuickLogin;