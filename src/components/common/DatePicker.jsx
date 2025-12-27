export default function DatePicker(props) {
  return (
    <input
      type="date"
      {...props}
      className="w-full px-4 py-2.5 rounded-xl border
      border-slate-300 bg-white text-sm"
    />
  );
}
