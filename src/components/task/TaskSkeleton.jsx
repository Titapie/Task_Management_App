export default function TaskSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-5 w-32 bg-slate-200 rounded" />
        <div className="h-9 w-40 bg-slate-200 rounded-xl" />
      </div>

      {/* Time Limit */}
      <div className="space-y-4">
        <div className="h-4 w-24 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-[28px] p-4 space-y-4">
              <div className="h-36 bg-slate-200 rounded-2xl" />
              <div className="h-4 w-3/4 bg-slate-200 rounded" />
              <div className="h-3 w-1/3 bg-slate-200 rounded" />
              <div className="h-2 bg-slate-200 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* New Task */}
      <div className="space-y-4">
        <div className="h-4 w-24 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-[28px] p-4 space-y-4">
              <div className="h-36 bg-slate-200 rounded-2xl" />
              <div className="h-4 w-2/3 bg-slate-200 rounded" />
              <div className="h-3 w-1/4 bg-slate-200 rounded" />
              <div className="h-2 bg-slate-200 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
