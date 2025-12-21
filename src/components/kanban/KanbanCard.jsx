import { MoreHorizontal, MessageSquare, Paperclip } from "lucide-react";

export default function KanbanCard({ task, index }) {
  const priorities = ["High", "Medium", "Low"];
  const priority = priorities[index % 3];

  const priorityStyles = {
    High: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
    Medium:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
    Low: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-[24px] shadow-sm border border-slate-50 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all group cursor-grab active:cursor-grabbing">
      <div className="flex justify-between items-start mb-3">
        <span
          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${priorityStyles[priority]}`}
        >
          {priority}
        </span>
        <button className="text-slate-300 hover:text-slate-600 transition-colors">
          <MoreHorizontal size={14} />
        </button>
      </div>

      <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4 leading-tight">
        {task}
      </p>

      <div className="flex justify-between items-center pt-3 border-t border-slate-50 dark:border-slate-700/50">
        <div className="flex gap-3 text-slate-400">
          <div className="flex items-center gap-1 text-[10px] font-medium">
            <MessageSquare size={12} /> 3
          </div>
          <div className="flex items-center gap-1 text-[10px] font-medium">
            <Paperclip size={12} /> 2
          </div>
        </div>
        <div className="flex -space-x-1.5">
          <img
            src={`https://i.pravatar.cc/100?u=${task}`}
            className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800"
            alt=""
          />
          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[8px] font-bold">
            +2
          </div>
        </div>
      </div>
    </div>
  );
}
