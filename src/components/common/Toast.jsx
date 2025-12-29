export default function Toast({ message, type = "success" }) {
  const colors = {
    success: "bg-green-500 dark:bg-green-600",
    error: "bg-red-500 dark:bg-red-600",
    info: "bg-indigo-500 dark:bg-indigo-600",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 text-white px-4 py-3
      rounded-xl shadow-lg dark:shadow-slate-900/50 
      ${colors[type]} 
      animate-slide-up transition-all duration-300
      backdrop-blur-sm`}
    >
      {message}
    </div>
  );
}