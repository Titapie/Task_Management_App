export default function Select({ options = [], ...props }) {
  return (
    <select
      {...props}
      className="w-full px-4 py-2.5 rounded-xl border
      border-slate-300 bg-white text-sm outline-none"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
