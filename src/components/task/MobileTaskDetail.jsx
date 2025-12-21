import TaskDetailContent from "./TaskDetailContent";
import TaskDetailSidebar from "./TaskDetailSidebar";

export default function MobileTaskDetail() {
  return (
    <div className="lg:hidden space-y-8">
      <TaskDetailContent />
      <TaskDetailSidebar />
    </div>
  );
}
