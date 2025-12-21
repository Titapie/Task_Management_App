import { useEffect, useState } from "react";
import TaskDetailSkeleton from "../components/task/TaskDetailSkeleton";
import TaskDetailContent from "../components/task/TaskDetailContent";
import TaskDetailSidebar from "../components/task/TaskDetailSidebar";
import MobileTaskDetail from "../components/task/MobileTaskDetail";

export default function TaskDetailPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <TaskDetailSkeleton />;

  return (
    <>
      {/* ===== MOBILE ===== */}
      <MobileTaskDetail />

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <TaskDetailContent />
        </div>
        <div className="col-span-4">
          <TaskDetailSidebar />
        </div>
      </div>
    </>
  );
}
