import { Link } from "react-router-dom";

export default function TaskCard({ task }) {
  return (
    <Link to={`/tasks/${task.id}`} className="group block">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-[32px] border border-slate-50 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1">
        {/* Thumbnail */}
        <div className="h-44 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4 overflow-hidden relative">
          <img
            src={task.image}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            alt={task.title}
          />
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
            {task.time}
          </div>
        </div>

        {/* Info */}
        <h4 className="font-bold text-slate-900 dark:text-white mb-1 truncate group-hover:text-indigo-600 transition-colors">
          {task.title}
        </h4>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-4">
          {task.category}
        </p>

        {/* Progress bar */}
        <div className="flex justify-between text-xs font-bold mb-2">
          <span className="text-slate-900 dark:text-white">Progress</span>
          <span className="text-indigo-600">{task.progress}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
            style={{ width: `${task.progress}%` }}
          />
        </div>

        {/* Footer Card */}
        <div className="flex justify-between items-center">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <img
                key={i}
                src={`https://i.pravatar.cc/100?u=${task.id + i}`}
                className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900"
                alt="member"
              />
            ))}
          </div>
          <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest">
            Detail
          </span>
        </div>
      </div>
    </Link>
  );
}
