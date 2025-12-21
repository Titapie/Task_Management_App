import { useEffect, useState } from "react";

/* Desktop */
import TaskSkeleton from "../components/task/TaskSkeleton";
import TaskCard from "../components/task/TaskCard";

/* Mobile */
import MobileTaskSkeleton from "../components/task/MobileTaskSkeleton";
import MobileTaskCard from "../components/task/MobileTaskCard";

export default function TaskPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const timeLimitTasks = [
    {
      id: 1,
      title: "Creating Awesome Mobile Apps",
      category: "UI/UX Design",
      progress: 90,
      time: "1 Hour",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    },
    {
      id: 2,
      title: "Creating Fresh Website",
      category: "Web Developer",
      progress: 85,
      time: "2 Hour",
      image: "https://images.unsplash.com/photo-1509395176047-4a66953fd231",
    },
    {
      id: 3,
      title: "Creating Color Palettes",
      category: "UI/UX Design",
      progress: 100,
      time: "1 Hour",
      image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
    },
  ];

  const newTasks = [
    {
      id: 4,
      title: "Creating Mobile App Design",
      category: "UI/UX Design",
      progress: 75,
      time: "3 Days Left",
      image: "https://images.unsplash.com/photo-1558655146-d09347e92766",
    },
    {
      id: 5,
      title: "Creating Perfect Website",
      category: "Web Developer",
      progress: 85,
      time: "4 Days Left",
      image: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f",
    },
  ];

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <>
        {/* Mobile Skeleton */}
        <div className="lg:hidden">
          <MobileTaskSkeleton />
        </div>

        {/* Desktop Skeleton */}
        <div className="hidden lg:block space-y-10 animate-pulse">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <TaskSkeleton key={i} />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ================= MOBILE ================= */}
      <div className="lg:hidden space-y-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Explore Task
        </h2>

        {/* Search (UI only) */}
        <input
          placeholder="Search Task"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm bg-white dark:bg-slate-900"
        />

        {/* Time Limit */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Time Limit
            </h3>
            <button className="text-xs text-indigo-600">See All</button>
          </div>
          <MobileTaskCard task={timeLimitTasks[0]} />
        </section>

        {/* New Task */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              New Task
            </h3>
            <button className="text-xs text-indigo-600">See All</button>
          </div>
          <MobileTaskCard task={newTasks[0]} />
        </section>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden lg:block space-y-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Explore Task
        </h2>

        {/* Time Limit */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Time Limit
            </h3>
            <button className="text-sm font-bold text-indigo-600 hover:underline">
              See All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {timeLimitTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </section>

        {/* New Task */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              New Task
            </h3>
            <button className="text-sm font-bold text-indigo-600 hover:underline">
              See All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
