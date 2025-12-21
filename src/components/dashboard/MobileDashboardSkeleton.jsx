export const SkeletonBlock = ({ className }) => (
  <div
    className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl ${className}`}
  />
);

export const SkeletonLine = ({ className }) => (
  <div
    className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded ${className}`}
  />
);
export default function MobileDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse lg:hidden px-4 py-2">
      {/* 1. Header Skeleton (Menu + Bell + Avatar) */}
      <div className="flex justify-between items-center h-14 bg-white dark:bg-slate-900 rounded-xl px-4 border border-transparent dark:border-slate-800">
        <SkeletonBlock className="w-10 h-10 rounded-xl" />
        <div className="flex gap-3">
          <SkeletonBlock className="w-8 h-8 rounded-full" />
          <SkeletonBlock className="w-9 h-9 rounded-full" />
        </div>
      </div>

      {/* 2. Running Task Card (Khối màu tối trong Wireframe) */}
      <div className="h-44 bg-slate-900 dark:bg-slate-950 rounded-[32px] p-6 space-y-4">
        <SkeletonLine className="w-24 h-3 bg-slate-700" />
        <div className="flex justify-between items-end">
          <SkeletonLine className="w-16 h-10 bg-slate-700" />
          <SkeletonBlock className="w-12 h-12 rounded-full bg-slate-700" />
        </div>
      </div>

      {/* 3. Activity Chart Skeleton */}
      <div className="h-40 bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-transparent dark:border-slate-800">
        <div className="flex justify-between mb-6">
          <SkeletonLine className="w-20 h-4" />
          <SkeletonLine className="w-16 h-3" />
        </div>
        <div className="flex items-end justify-between h-16 gap-2">
          {[...Array(7)].map((_, i) => (
            <SkeletonBlock
              key={i}
              className={`flex-1 ${i % 2 === 0 ? "h-full" : "h-2/3"}`}
            />
          ))}
        </div>
      </div>

      {/* 4. Monthly Mentors Section */}
      <Section titleWidth="w-32" />

      {/* 5. Upcoming Tasks Section */}
      <div className="space-y-4">
        <SkeletonLine className="w-36 h-5 ml-2" />
        <Card h="h-72" />
      </div>

      {/* 6. Task Today Detail */}
      <div className="h-80 bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-transparent dark:border-slate-800">
        <SkeletonLine className="w-24 h-5 mb-4" />
        <SkeletonBlock className="h-32 w-full mb-4" />
        <SkeletonLine className="w-full h-4 mb-2" />
        <SkeletonLine className="w-2/3 h-4" />
      </div>
    </div>
  );
}

function Section({ titleWidth = "w-40" }) {
  return (
    <div className="px-1">
      <SkeletonLine className={`${titleWidth} h-5 mb-4`} />
      <div className="space-y-4">
        {/* Giả lập 2 thẻ Mentor nằm ngang (Row) */}
        <div className="bg-white dark:bg-slate-900 h-24 rounded-[24px] p-4 flex items-center gap-4 border border-transparent dark:border-slate-800">
          <SkeletonBlock className="w-12 h-12 rounded-full shrink-0" />
          <div className="space-y-2 flex-1">
            <SkeletonLine className="w-2/3 h-3" />
            <SkeletonLine className="w-1/3 h-2" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 h-24 rounded-[24px] p-4 flex items-center gap-4 border border-transparent dark:border-slate-800">
          <SkeletonBlock className="w-12 h-12 rounded-full shrink-0" />
          <div className="space-y-2 flex-1">
            <SkeletonLine className="w-2/3 h-3" />
            <SkeletonLine className="w-1/3 h-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ h = "h-48" }) {
  return (
    <div
      className={`${h} bg-white dark:bg-slate-900 rounded-[32px] p-4 border border-transparent dark:border-slate-800`}
    >
      <SkeletonBlock className="h-3/5 w-full mb-4 rounded-2xl" />
      <SkeletonLine className="w-3/4 h-4 mb-2" />
      <SkeletonLine className="w-1/2 h-3" />
    </div>
  );
}
