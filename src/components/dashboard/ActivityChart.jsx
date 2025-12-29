export default function ActivityChart() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 card-shadow transition-colors">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-bold text-slate-900 ">Activity</h3>
        <select className="bg-transparent text-xs font-bold text-slate-400 outline-none cursor-pointer">
          <option>This Week</option>
          <option>Last Week</option>
        </select>
      </div>

      {/* Chart Placeholder Area */}
      <div className="h-[120px] flex items-end gap-2 px-2">
        {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-2 group"
          >
            <div
              className="w-full bg-indigo-50 dark:bg-slate-800 rounded-t-lg group-hover:bg-indigo-600 transition-all relative overflow-hidden"
              style={{ height: `${h}%` }}
            >
              {i === 3 && <div className="absolute inset-0 bg-indigo-600" />}{" "}
              {/* Cột active */}
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              {["S", "M", "T", "W", "T", "F", "S"][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
