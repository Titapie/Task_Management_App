export default function MobileActivity() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 lg:hidden transition-colors border border-transparent dark:border-slate-800">
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
          Activity
        </h3>
        <span className="text-xs text-slate-400 font-medium">This Week</span>
      </div>

      {/* Biểu đồ cột đơn giản cho Mobile */}
      <div className="h-24 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-end justify-between px-4 pb-2 gap-1">
        {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
          <div
            key={i}
            className={`w-full rounded-t-sm transition-all ${
              i === 3 ? "bg-indigo-600" : "bg-indigo-100 dark:bg-slate-700"
            }`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}
