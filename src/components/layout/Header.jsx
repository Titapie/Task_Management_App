// import { useAuth } from "../../context/AuthContext";

// export default function Header() {
//   const { user, loading, logout } = useAuth();

//   return (
//     <div className="p-3 bg-yellow-100">
//       <div>loading: {String(loading)}</div>
//       <div>user: {user ? user.Email : "null"}</div>
//       {user && (
//         <button
//           onClick={logout}
//           className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
//         >
//           Đăng xuất
//         </button>
//       )}
//     </div>
//   );
// }
import { Bell, Moon, Sun, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Header() {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-[80px] bg-white dark:bg-slate-950 flex items-center justify-between px-8">
      {/* LEFT: Greeting */}
      <div className="flex flex-col">
        <h1 className="text-[20px] font-bold text-slate-900 dark:text-white leading-tight">
          {loading
            ? "Loading..."
            : user
            ? `Hi, ${user.FullName || "User"}`
            : "Welcome"}
        </h1>
        <p className="text-[13px] text-slate-400 font-medium">
          Let’s finish your task today!
        </p>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-6">
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-indigo-600 transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notification Icon with precise red dot */}
        <button className="relative p-2">
          <Bell size={22} className="text-slate-400 dark:text-slate-500" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-950 rounded-full" />
        </button>

        {/* User Profile Area */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 border border-slate-100 shadow-sm">
            {user?.AvatarUrl ? (
              <img
                src={user.AvatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">
                {user?.FullName?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>

          {user && (
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
