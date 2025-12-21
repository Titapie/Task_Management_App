export default function RunningTaskCard() {
  return (
    <div className="bg-[#0F172A] dark:bg-slate-950 text-white rounded-[32px] p-8 card-shadow">
      <p className="text-sm text-slate-400 font-medium">Running Task</p>
      <div className="mt-4 flex items-end justify-between">
        <h2 className="text-5xl font-bold">65</h2>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-slate-800"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={175}
                strokeDashoffset={175 * 0.55}
                className="text-indigo-500"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
              45%
            </span>
          </div>
          <div className="text-xs text-slate-400">
            100 Task
            <br />
            Completed
          </div>
        </div>
      </div>
    </div>
  );
}
