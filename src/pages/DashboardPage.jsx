import { useEffect, useState } from "react";

/* ===== Desktop components ===== */
import DashboardSkeleton from "../components/dashboard/DashboardSkeleton";
import RunningTaskCard from "../components/dashboard/RunningTaskCard";
import ActivityChart from "../components/dashboard/ActivityChart";
import UpcomingTask from "../components/dashboard/UpcomingTask";
import TaskToday from "../components/dashboard/TaskToday";

/* ===== Mobile components ===== */
import MobileDashboardSkeleton from "../components/dashboard/MobileDashboardSkeleton";
import MobileRunningTask from "../components/dashboard/MobileRunningTask";
import MobileActivity from "../components/dashboard/MobileActivity";
import MobileUpcomingTask from "../components/dashboard/MobileUpcomingTask";
import MobileTaskToday from "../components/dashboard/MobileTaskToday";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <>
        <div className="lg:hidden px-4">
          <MobileDashboardSkeleton />
        </div>
        <div className="hidden lg:block">
          <DashboardSkeleton />
        </div>
      </>
    );
  }

  return (
    <div className="p-4 lg:p-0">
      {/* ================= MOBILE DASHBOARD ================= */}
      <div className="lg:hidden space-y-6">
        <MobileRunningTask />
        <MobileActivity />
        <MobileUpcomingTask />
        <MobileTaskToday />
      </div>

      {/* ================= DESKTOP DASHBOARD ================= */}
      <div className="hidden lg:grid grid-cols-12 gap-8">
        {/* LEFT CONTENT */}
        <div className="col-span-12 xl:col-span-9 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <RunningTaskCard />
            <ActivityChart />
          </div>
          <UpcomingTask />
        </div>

        {/* RIGHT PANEL */}
        <div className="col-span-12 xl:col-span-3">
          <div className="sticky top-6">
            <TaskToday />
          </div>
        </div>
      </div>
    </div>
  );
}
