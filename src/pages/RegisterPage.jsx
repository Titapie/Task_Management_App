import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";
import { authService } from "../services/authService";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (data) => {
    setLoading(true);
    setError("");
    try {
      await authService.register(data);
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-[520px] bg-white border border-slate-200 rounded-2xl px-8 py-9 shadow-[0_12px_30px_rgba(16,24,40,0.08)]">
        <h1 className="text-[32px] font-bold text-slate-900 leading-tight">
          Tạo tài khoản
        </h1>
        <p className="mt-2 mb-6 text-slate-500">
          Nhập thông tin cá nhân để bắt đầu.
        </p>

        <RegisterForm
          onSubmit={handleRegister}
          loading={loading}
          error={error}
        />

        <p className="mt-6 text-center text-slate-600">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
