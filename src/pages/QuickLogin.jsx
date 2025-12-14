// file login nhanh, ko merge vào main
import { useState } from 'react';

const QuickLogin = ({ onSuccess, autoLogin = false }) => {
  // useEffect(() => {
  //   if (autoLogin && localStorage.getItem('token')) {
  //     // Token tồn tại nhưng có thể hết hạn, thử refresh
  //     handleQuickLogin();
  //   }
  // }, []);

  
  const [loading, setLoading] = useState(false);

  const handleQuickLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Email: 'pnhtrieu186@gmail.com',  // Thay email
          Password: 'password123'          // Thay password
        })
      });
      const data = await response.json();
      localStorage.setItem('token', data.token);
      onSuccess();
    } catch (err) {
      alert('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <button 
        onClick={handleQuickLogin}
        disabled={loading}
        className="px-6 py-3 bg-blue-500 text-white rounded"
      >
        {loading ? 'Đang đăng nhập...' : 'Quick Login'}
      </button>
    </div>
  );
};

export default QuickLogin;