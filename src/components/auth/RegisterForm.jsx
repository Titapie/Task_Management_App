import { useState } from "react";
import Input from "../common/Input";

export default function RegisterForm({ onSubmit, loading, error }) {
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
  });
  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationError) setValidationError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { FirstName, LastName, Email, Password, ConfirmPassword } = formData;

    if (!FirstName.trim() || !LastName.trim() || !Email.trim() || !Password) {
      setValidationError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (Password.length < 6) {
      setValidationError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (Password !== ConfirmPassword) {
      setValidationError("Mật khẩu xác nhận không khớp");
      return;
    }

    // Gửi dữ liệu (loại bỏ ConfirmPassword)
    onSubmit({ FirstName, LastName, Email, Password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Họ</label>
          <Input
            name="FirstName"
            value={formData.FirstName}
            onChange={handleChange}
            placeholder="Nguyễn"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Tên</label>
          <Input
            name="LastName"
            value={formData.LastName}
            onChange={handleChange}
            placeholder="Văn A"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Email</label>
        <Input
          name="Email"
          type="email"
          value={formData.Email}
          onChange={handleChange}
          autoComplete="email"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Mật khẩu</label>
        <Input
          name="Password"
          type="password"
          value={formData.Password}
          onChange={handleChange}
          autoComplete="new-password"
          placeholder="••••••••"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">
          Xác nhận mật khẩu
        </label>
        <Input
          name="ConfirmPassword"
          type="password"
          value={formData.ConfirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
          placeholder="••••••••"
        />
      </div>

      {(error || validationError) && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error || validationError}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Đang đăng ký..." : "Đăng ký tài khoản"}
      </button>
    </form>
  );
}
