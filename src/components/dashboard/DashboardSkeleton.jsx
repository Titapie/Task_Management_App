export const SkeletonPulse = ({ className }) => (
  <div
    className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl ${className}`}
  />
);

export const SkeletonTitle = ({ className }) => (
  <SkeletonPulse className={`h-5 w-40 mb-4 ${className}`} />
);
export default function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen bg-[#F6F7FB] dark:bg-slate-950">
      {/* 1. SIDEBAR SKELETON */}
      <aside className="hidden lg:flex w-[260px] flex-col p-6 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-10">
          <SkeletonPulse className="w-10 h-10" />
          <SkeletonPulse className="h-6 w-24" />
        </div>
        <div className="space-y-4 flex-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonPulse key={i} className="h-12 w-full" />
          ))}
        </div>
        <SkeletonPulse className="h-40 w-full rounded-2xl" />
      </aside>

      <div className="flex-1 flex flex-col">
        {/* HEADER SKELETON */}
        <header className="h-[80px] px-8 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <div>
            <SkeletonPulse className="h-6 w-32 mb-2" />
            <SkeletonPulse className="h-4 w-48" />
          </div>
          <div className="flex items-center gap-4">
            <SkeletonPulse className="w-10 h-10 rounded-full" />
            <SkeletonPulse className="w-10 h-10 rounded-full" />
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <SkeletonPulse className="w-10 h-10 rounded-full" />
            </div>
          </div>
        </header>

        {/* MAIN CONTENT SKELETON */}
        <main className="p-8 grid grid-cols-12 gap-8 overflow-y-auto">
          {/* LEFT: Stats, Mentors, Upcoming Task (9 Columns) */}
          <div className="col-span-12 xl:col-span-9 space-y-10">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SkeletonPulse className="h-[180px] rounded-[32px]" />
              <SkeletonPulse className="h-[180px] rounded-[32px]" />
            </div>

            {/* Monthly Mentors Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <SkeletonTitle />
                <div className="flex gap-2">
                  <SkeletonPulse className="w-8 h-8 rounded-full" />
                  <SkeletonPulse className="w-8 h-8 rounded-full" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SkeletonPulse className="h-24 rounded-[24px]" />
                <SkeletonPulse className="h-24 rounded-[24px]" />
              </div>
            </section>

            {/* Upcoming Task Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <SkeletonTitle />
                <div className="flex gap-2">
                  <SkeletonPulse className="w-8 h-8 rounded-full" />
                  <SkeletonPulse className="w-8 h-8 rounded-full" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SkeletonPulse className="h-80 rounded-[32px]" />
                <SkeletonPulse className="h-80 rounded-[32px]" />
              </div>
            </section>
          </div>

          {/* RIGHT: Calendar & Task Today (3 Columns) */}
          <div className="col-span-12 xl:col-span-3 space-y-8">
            {/* Mini Calendar Skeleton */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800">
              <SkeletonPulse className="h-6 w-full mb-6" />
              <div className="grid grid-cols-7 gap-2">
                {[...Array(7)].map((_, i) => (
                  <SkeletonPulse key={i} className="h-10 w-full" />
                ))}
              </div>
            </div>

            {/* Task Today Detail Skeleton */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800">
              <SkeletonPulse className="h-8 w-32 mb-6" />
              <SkeletonPulse className="h-40 w-full mb-4 rounded-2xl" />
              <SkeletonPulse className="h-6 w-full mb-2" />
              <SkeletonPulse className="h-4 w-24 mb-6" />
              <div className="space-y-3">
                <SkeletonPulse className="h-12 w-full" />
                <SkeletonPulse className="h-12 w-full" />
                <SkeletonPulse className="h-12 w-full" />
              </div>
              <SkeletonPulse className="h-14 w-full mt-8 rounded-2xl" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
