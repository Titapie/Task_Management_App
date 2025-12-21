import { Users } from "lucide-react";

export default function MobileUpcomingTask() {
  return (
    <div className="lg:hidden space-y-3">
      <h3 className="font-bold text-sm text-slate-900 dark:text-white px-1">
        Upcoming Task
      </h3>

      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-5 border border-slate-50 dark:border-slate-800 transition-colors shadow-sm">
        {/* Task Image */}
        <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400"
            className="w-full h-full object-cover"
            alt="upcoming task"
          />
        </div>

        <p className="font-bold text-sm text-slate-900 dark:text-white">
          Creating Mobile App Design
        </p>
        <p className="text-[10px] text-slate-400 font-medium mb-4">
          UI/UX Design
        </p>

        {/* Progress Bar */}
        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-indigo-600 rounded-full" />
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            🕒 3 Days Left
          </span>

          {/* Team Avatars */}
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <img
                key={i}
                src={`https://i.pravatar.cc/100?u=${i + 10}`}
                className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 shadow-sm"
                alt="team member"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
