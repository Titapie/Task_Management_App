export default function KanbanSkeleton() {
  return (
    <div className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto pb-4 scrollbar-hide">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="min-w-[280px] flex-1 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-[24px] space-y-4 animate-pulse"
        >
          <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-md ml-2" />
          {[1, 2, 3].map((j) => (
            <div
              key={j}
              className="h-24 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
