export default function TaskDetailSidebar() {
  return (
    <div className="space-y-6">
      {/* Assignment */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border dark:border-slate-800">
        <h4 className="font-bold text-slate-900 dark:text-white mb-4">
          Assigned Assignments
        </h4>
        <p className="text-sm font-semibold text-slate-800 dark:text-white">
          Creating Awesome Mobile Apps
        </p>
        <p className="text-xs text-slate-400">UI/UX Design</p>
      </div>

      {/* Student */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border dark:border-slate-800 space-y-3">
        <h4 className="font-bold text-slate-900 dark:text-white">
          Detail Student
        </h4>
        <p className="text-sm text-slate-500">Student Name: Skylar Dias</p>
        <p className="text-sm text-slate-500">Student Class: MIPA 2</p>
        <p className="text-sm text-slate-500">Student Number: 10</p>
      </div>

      {/* Upload */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border dark:border-slate-800 space-y-4">
        <h4 className="font-bold text-slate-900 dark:text-white">File Task</h4>
        <div className="h-32 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-xs text-slate-400">
          Drag or browse from device
        </div>
        <button className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold">
          Submit
        </button>
      </div>
    </div>
  );
}
