import { Menu, Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function MobileHeader({ onOpenSidebar }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className="
        flex items-center justify-between
        bg-white dark:bg-slate-900
        p-4 rounded-2xl lg:hidden
        shadow-sm transition-colors
        border border-slate-100 dark:border-slate-800
      "
    >
      {/* LEFT: Menu */}
      <button
        onClick={onOpenSidebar}
        className="
          w-10 h-10 rounded-xl
          bg-slate-50 dark:bg-slate-800
          flex items-center justify-center
          text-slate-900 dark:text-white
        "
      >
        <Menu size={20} />
      </button>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-2">
        {/* Toggle Dark Mode */}
        <button
          onClick={toggleTheme}
          className="
            w-10 h-10 rounded-xl
            bg-slate-50 dark:bg-slate-800
            flex items-center justify-center
            text-slate-900 dark:text-white
          "
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification */}
        <button className="relative p-2 text-slate-400">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-100 overflow-hidden">
          <img src="https://i.pravatar.cc/150?u=skylar" alt="avatar" />
        </div>
      </div>
    </div>
  );
}
