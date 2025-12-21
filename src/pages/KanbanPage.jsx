import { useState, useEffect } from "react";
import KanbanBoard from "../components/kanban/KanbanBoard";
import KanbanSkeleton from "../components/kanban/KanbanSkeleton";

const columnsData = [
  {
    title: "To Do",
    tasks: ["Design wireframe", "Create moodboard", "Research User Persona"],
  },
  {
    title: "In Progress",
    tasks: ["Develop Dashboard", "Kanban Layout Implementation"],
  },
  {
    title: "Done",
    tasks: ["Login UI Design", "Register UI Design", "Setup Tailwind v4"],
  },
];

export default function KanbanPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end px-1">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Kanban Board
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Project: Nuegas Dashboard Redesign
          </p>
        </div>
        <button className="hidden md:block bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 dark:shadow-none transition-transform active:scale-95">
          Add New Column
        </button>
      </div>

      {loading ? <KanbanSkeleton /> : <KanbanBoard columns={columnsData} />}
    </div>
  );
}
