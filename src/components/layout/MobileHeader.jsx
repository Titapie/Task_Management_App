import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  Bell,
  Moon,
  Sun,
  Search,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";

export default function MobileHeader({ onOpenSidebar }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="
        flex items-center justify-between gap-4
        bg-white dark:bg-slate-900
        p-4 rounded-2xl lg:hidden
        shadow-sm transition-colors
        border border-slate-100 dark:border-slate-800
      "
    >
      {/* LEFT: Menu */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onOpenSidebar}
          className="
            shrink-0
            w-10 h-10 rounded-xl
            bg-slate-50 dark:bg-slate-800
            flex items-center justify-center
            text-slate-900 dark:text-white
          "
        >
          <Menu size={20} />
        </button>

        {/* Search Input */}
        <div className="relative flex-1 max-w-[200px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search..."
            className="
              w-full h-10 pl-10 pr-4 rounded-xl text-sm
              bg-slate-50 dark:bg-slate-800
              text-slate-900 dark:text-white
              placeholder-slate-400
              outline-none focus:ring-2 focus:ring-indigo-500/20
              transition-all
            "
          />
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-2 shrink-0">
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
        <button
          className="
            relative w-10 h-10 rounded-xl
            bg-slate-50 dark:bg-slate-800
            flex items-center justify-center
            text-slate-400 hover:text-slate-600 dark:hover:text-slate-300
            transition-colors
          "
        >
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full" />
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 rounded-full bg-slate-200 border border-slate-100 overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {user?.AvatarUrl || user?.avatar ? (
              <img
                src={user.AvatarUrl || user.avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-sm">
                {(user?.FullName || user?.FirstName || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {user?.FullName ||
                    (user?.FirstName
                      ? `${user.FirstName} ${user.LastName}`
                      : "User")}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.Email || "user@example.com"}
                </p>
              </div>

              <div className="px-2 py-1">
                <Link
                  to="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 rounded-xl transition-colors"
                >
                  <User size={18} />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 rounded-xl transition-colors"
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </Link>
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2" />

              <div className="px-2 py-1">
                <button
                  onClick={() => {
                    logout();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
