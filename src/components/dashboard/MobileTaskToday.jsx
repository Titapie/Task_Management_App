export default function MobileTaskToday() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 lg:hidden border border-slate-50 dark:border-slate-800 transition-colors shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          Task Today
        </h3>
        <button className="text-slate-400">•••</button>
      </div>

      <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=400"
          className="w-full h-full object-cover"
          alt="mobile app design"
        />
      </div>

      <p className="font-bold text-base text-slate-900 dark:text-white">
        Creating Awesome Mobile Apps
      </p>
      <p className="text-xs text-slate-400 font-medium mb-4">UI/UX Designer</p>

      <div className="flex justify-between text-[10px] font-bold mb-1">
        <span className="text-slate-900 dark:text-white">Progress</span>
        <span className="text-indigo-600">90%</span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-5">
        <div className="h-full w-[90%] bg-indigo-600 rounded-full" />
      </div>

      <div className="space-y-3">
        {[
          "Understanding the tools in Figma",
          "Understanding the basics of making designs",
          "Design a mobile application with figma",
        ].map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-indigo-600 shrink-0">
              {index + 1}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-tight">
              {item}
            </p>
          </div>
        ))}
      </div>

      <button className="mt-6 w-full bg-indigo-600 text-white py-4 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 active:scale-[0.98] transition-all">
        Go To Detail
      </button>
    </div>
  );
}
