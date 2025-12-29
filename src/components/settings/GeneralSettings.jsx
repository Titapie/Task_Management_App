export default function GeneralSettings() {
  return (
    <div className="space-y-6">
      {/* Language */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Language
        </label>
        <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white">
          <option>English (Default)</option>
          <option>Vietnamese</option>
        </select>
      </div>

      {/* Timezone */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Timezone
        </label>
        <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white">
          <option>English (Default)</option>
        </select>
      </div>

      {/* Time Format */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Time Format
        </label>
        <div className="flex gap-4">
          <button className="px-4 py-2 rounded-xl border border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 text-sm font-semibold">
            24 Hours
          </button>
          <button className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm">
            12 Hours
          </button>
        </div>
      </div>

      {/* Save */}
      <button className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold">
        Save Changes
      </button>
    </div>
  );
}
