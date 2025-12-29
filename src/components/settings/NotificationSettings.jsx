function Toggle({ label, checked }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-slate-600 dark:text-slate-400">
        {label}
      </span>
      <div
        className={`w-10 h-5 rounded-full p-0.5 transition
          ${checked ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"}`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full transition
            ${checked ? "translate-x-5" : ""}`}
        />
      </div>
    </div>
  );
}

export default function NotificationSettings() {
  return (
    <div className="space-y-5">
      <Toggle label="Message" checked />
      <Toggle label="Task Update" />
      <Toggle label="Task Deadline" checked />
      <Toggle label="Mentor Help" />

      <button className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold">
        Save Changes
      </button>
    </div>
  );
}
