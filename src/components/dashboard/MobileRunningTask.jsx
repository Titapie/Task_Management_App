export default function MobileRunningTask() {
  return (
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-[32px] p-6 lg:hidden shadow-lg transition-colors">
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
        Running Task
      </p>

      <div className="mt-3 flex items-center justify-between">
        <h2 className="text-4xl font-bold">65</h2>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">
            Total
          </p>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            100 Task
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-5">
        {/* Circular Progress Bar */}
        <div className="relative w-16 h-16">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="5"
              fill="transparent"
              className="text-slate-100 dark:text-slate-800 transition-colors"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="5"
              fill="transparent"
              strokeDasharray={175}
              strokeDashoffset={175 * (1 - 0.45)}
              strokeLinecap="round"
              className="text-indigo-600 dark:text-indigo-500 transition-all duration-1000"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
            45%
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          Task
          <br />
          Completed
        </p>
      </div>
    </div>
  );
}
