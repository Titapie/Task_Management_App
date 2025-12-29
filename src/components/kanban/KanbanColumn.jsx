import { Plus } from "lucide-react";
import KanbanCard from "./KanbanCard";

export default function KanbanColumn({ col }) {
  return (
    <div className="min-w-[300px] flex-1 bg-slate-100/50 dark:bg-slate-950/40 p-3 rounded-[32px] flex flex-col h-full border border-transparent dark:border-slate-900 transition-colors">
      <div className="flex justify-between items-center p-3 mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-extrabold text-[11px] text-slate-800 dark:text-slate-200 uppercase tracking-widest">
            {col.title}
          </h3>
          <span className="bg-white dark:bg-slate-800 text-slate-500 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
            {col.tasks.length}
          </span>
        </div>
        <button className="text-slate-400 hover:text-indigo-600 p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all">
          <Plus size={18} />
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1 scrollbar-hide flex-1">
        {col.tasks.map((task, i) => (
          <KanbanCard key={i} task={task} index={i} />
        ))}
      </div>
    </div>
  );
}
