import { useState } from "react";

export default function MobileSettingsPage() {
  const [tab, setTab] = useState("General");

  return (
    <div className="lg:hidden space-y-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
        Settings
      </h2>

      {/* Tabs */}
      <div className="flex gap-6 border-b">
        {["General", "Notification"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 text-sm font-semibold ${
              tab === t
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-slate-400"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "General" ? (
        <div className="space-y-4">
          <label className="text-sm font-semibold">Language</label>
          <select className="w-full p-3 rounded-xl border">
            <option>English (Default)</option>
            <option>Vietnamese</option>
          </select>

          <label className="text-sm font-semibold">Time Format</label>
          <div className="flex gap-3">
            <button className="flex-1 py-2 rounded-xl border border-indigo-600 text-indigo-600">
              24 Hours
            </button>
            <button className="flex-1 py-2 rounded-xl border">12 Hours</button>
          </div>

          <button className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold">
            Save Changes
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {["Message", "Task Update", "Task Deadline", "Mentor Help"].map(
            (item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm">{item}</span>
                <div className="w-10 h-5 bg-indigo-600 rounded-full p-0.5">
                  <div className="w-4 h-4 bg-white rounded-full translate-x-5" />
                </div>
              </div>
            )
          )}

          <button className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold">
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
