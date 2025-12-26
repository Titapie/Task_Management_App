import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';

const QuickLogin = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // ✅ Bây giờ mới hoạt động đúng

    const handleQuickLogin = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Email: 'pnhtrieu186@gmail.com',
                    Password: 'password123'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // Save token
            localStorage.setItem('token', data.token);

            // DEBUG: Log token
            console.log('Token saved:', data.token.substring(0, 50) + '...');

            // ✅ Check if admin
            const isAdmin = userService.isAdmin();

            // Decode token để lấy user info
            try {
                const token = data.token;
                const payload = JSON.parse(atob(token.split('.')[1]));
                console.log('Token payload:', payload);

                if (isAdmin) {
                    console.log('✅ User is admin, redirecting to /admin');
                    navigate('/admin');
                } else {
                    console.log('ℹ️ User is not admin, redirecting to /dashboard');
                    navigate('/dashboard');

                }
            } catch (decodeError) {
                console.error('Error decoding token:', decodeError);
                navigate('/login');
            }

            if (onSuccess) onSuccess();
        } catch (err) {
            console.error('Login error:', err);
            alert('❌ Login failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-8">Quick Login System</h1>
                <button
                    onClick={handleQuickLogin}
                    disabled={loading}
                    className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-6 text-lg font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? 'Đang đăng nhập...' : 'Quick Login'}
                </button>


            </div>
        </div>
    );
};

export default QuickLogin;