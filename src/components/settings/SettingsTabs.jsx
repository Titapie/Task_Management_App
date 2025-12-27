export default function SettingsTabs({ active, onChange }) {
  return (
    <div className="flex gap-6 border-b border-slate-200 dark:border-slate-800 mb-6">
      {["General", "Notification"].map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`pb-3 text-sm font-semibold transition
            ${
              active === tab
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
