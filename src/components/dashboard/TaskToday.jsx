export default function TaskToday() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 card-shadow transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-900 ">Task Today</h3>
        <button className="text-slate-400">•••</button>
      </div>
      <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=400"
          className="w-full h-full object-cover"
          alt="task"
        />
      </div>
      <h4 className="font-bold text-slate-900 ">
        Creating Awesome Mobile Apps
      </h4>
      <p className="text-xs text-slate-400 mb-4">UI/UX Designer</p>

      <div className="flex justify-between text-xs font-bold mb-1">
        <span className="text-slate-900 ">Progress</span>
        <span className="text-indigo-600">90%</span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-6">
        <div className="h-full bg-indigo-600 rounded-full w-[90%]" />
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-indigo-600">
            1
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Understanding the tools in Figma
          </p>
        </div>
      </div>

      <button className="w-full mt-8 bg-indigo-600 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all">
        Go To Detail
      </button>
    </div>
  );
}
