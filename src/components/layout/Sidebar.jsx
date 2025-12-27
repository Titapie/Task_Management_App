import { NavLink } from "react-router-dom";
import {LayoutGrid, ClipboardList, Users, Settings, Briefcase} from "lucide-react";
import HelpCenterCard from "../HelpCenterCard.jsx";

export default function Sidebar({ onClose }) {
  const menu = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
    { to: "/projects", label: "Projects", icon: Briefcase },
    { to: "/tasks", label: "Task", icon: ClipboardList },
    { to: "/kanban", label: "Kanban", icon: ClipboardList },
    { to: "/profile", label: "Profile", icon: Users },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-[260px] bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 min-h-screen px-4 py-6 flex flex-col transition-colors">
      <div className="flex items-center justify-between mb-10 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
            N
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            Nuegas
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all
              ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
                  : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <HelpCenterCard />
    </aside>
  );
}
