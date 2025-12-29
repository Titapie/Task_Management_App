import { Mail, Phone, MapPin } from "lucide-react";

export default function UserProfile({ isMobile = false }) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-3xl p-6 space-y-6 ${
        isMobile ? "" : "max-w-xl"
      }`}
    >
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <img
          src="https://i.pravatar.cc/150?u=skylar"
          className="w-20 h-20 rounded-full"
          alt="avatar"
        />
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Skylar Dias
          </h3>
          <p className="text-sm text-slate-400">UI/UX Designer</p>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-3">
          <Mail size={16} /> skylar@email.com
        </div>
        <div className="flex items-center gap-3">
          <Phone size={16} /> +84 987 654 321
        </div>
        <div className="flex items-center gap-3">
          <MapPin size={16} /> Ho Chi Minh City
        </div>
      </div>

      {/* Edit button */}
      <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold">
        Edit Profile
      </button>
    </div>
  );
}
