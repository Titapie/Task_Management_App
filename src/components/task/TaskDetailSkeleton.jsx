export default function TaskDetailSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-6 animate-pulse">
      {/* Main */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        <div className="h-56 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-6 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-3 bg-slate-200 dark:bg-slate-800 rounded"
            />
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    </div>
  );
}
