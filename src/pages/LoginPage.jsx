import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (loading) return null;
  if (user) {
      const role = String(user?.Role ?? user?.role ?? "").toLowerCase();
      return <Navigate to={role === "admin" ? "/admin" : "/dashboard"} replace />;
            } 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Vui lòng nhập email và mật khẩu");
      return;
    }

    try {
      setSubmitting(true);

      const u = await login({
        Email: email.trim(),
        Password: password,
      });

      navigate(u?.Role === "admin" ? "/admin" : "/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card auth-card--login">

        <h1 className="auth-title">Đăng nhập tài khoản</h1>
        <p className="auth-sub">
          Nhập email và mật khẩu để tiếp tục.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="email@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="field">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <div className="alert">{error}</div>}

          <div className="auth-actions">
            <Link to="/forgotpassword" className="auth-link">
              Quên mật khẩu?
            </Link>
          </div>

          <button className="btn btn--full" type="submit" disabled={submitting}>
            {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="auth-footer-text">
          Bạn chưa có tài khoản?{" "}
          <Link to="/register" className="auth-link">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
