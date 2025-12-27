import { Clock } from "lucide-react";

export default function MobileTaskCard({ task }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[28px] p-4 border border-slate-50 dark:border-slate-800 shadow-sm">
      {/* Image */}
      <div className="h-32 rounded-2xl overflow-hidden mb-4">
        <img
          src={task.image}
          className="w-full h-full object-cover"
          alt={task.title}
        />
      </div>

      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
        {task.title}
      </h4>
      <p className="text-[10px] text-slate-400 mb-3">{task.category}</p>

      {/* Progress */}
      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mb-3">
        <div
          className="h-full bg-indigo-600 rounded-full"
          style={{ width: `${task.progress}%` }}
        />
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
        <div className="flex items-center gap-1">
          <Clock size={12} />
          {task.time}
        </div>

        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <img
              key={i}
              src={`https://i.pravatar.cc/100?u=${i}`}
              className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900"
              alt="member"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
