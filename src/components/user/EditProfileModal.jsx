import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";
import Input from "../common/Input";

export default function EditProfileModal({ onClose }) {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    FirstName: user?.FirstName || "",
    LastName: user?.LastName || "",
    Phone: user?.Phone || "",
    Address: user?.Address || "",
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await authService.updateProfile(formData);
      await refreshUser();
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
      // Có thể thêm state error để hiển thị lỗi nếu cần
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Edit Profile
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="First Name"
            value={formData.FirstName}
            onChange={(e) =>
              setFormData({ ...formData, FirstName: e.target.value })
            }
            className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          />
          <Input
            placeholder="Last Name"
            value={formData.LastName}
            onChange={(e) =>
              setFormData({ ...formData, LastName: e.target.value })
            }
            className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          />
        </div>

        <Input
          placeholder="Phone"
          value={formData.Phone}
          onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
          className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
        />

        <Input
          placeholder="Address"
          value={formData.Address}
          onChange={(e) =>
            setFormData({ ...formData, Address: e.target.value })
          }
          className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
        />

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-70 transition-colors"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
