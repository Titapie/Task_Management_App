export default function DatePicker(props) {
  return (
    <input
      type="date"
      {...props}
      className="w-full px-4 py-2.5 rounded-xl border 
      border-slate-300 dark:border-slate-600 
      bg-white dark:bg-slate-700 
      text-gray-900 dark:text-white text-sm
      outline-none
      focus:border-indigo-500 dark:focus:border-indigo-400
      focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50
      transition-all duration-200
      hover:border-slate-400 dark:hover:border-slate-500
      cursor-pointer
      animate-fade-in-fast
      [color-scheme:light] dark:[color-scheme:dark]"
    />
  );
}