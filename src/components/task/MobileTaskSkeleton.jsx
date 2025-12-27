export default function MobileTaskSkeleton() {
  return (
    <div className="lg:hidden space-y-6 animate-pulse">
      {/* Title */}
      <div className="h-5 w-32 bg-slate-200 rounded" />

      {/* Search */}
      <div className="h-10 w-full bg-slate-200 rounded-xl" />

      {/* Time Limit */}
      <div className="space-y-4">
        <div className="h-4 w-24 bg-slate-200 rounded" />

        <div className="bg-white rounded-[28px] p-4 space-y-4">
          <div className="h-32 bg-slate-200 rounded-2xl" />
          <div className="h-4 w-3/4 bg-slate-200 rounded" />
          <div className="h-3 w-1/3 bg-slate-200 rounded" />
          <div className="h-2 bg-slate-200 rounded-full" />
        </div>
      </div>

      {/* New Task */}
      <div className="space-y-4">
        <div className="h-4 w-24 bg-slate-200 rounded" />

        <div className="bg-white rounded-[28px] p-4 space-y-4">
          <div className="h-32 bg-slate-200 rounded-2xl" />
          <div className="h-4 w-2/3 bg-slate-200 rounded" />
          <div className="h-3 w-1/4 bg-slate-200 rounded" />
          <div className="h-2 bg-slate-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}
