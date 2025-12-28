export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in-fast">
      <div 
        className="absolute inset-0 bg-black/40 dark:bg-black/60 transition-opacity duration-300" 
        onClick={onClose} 
      />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 w-[420px] shadow-xl dark:shadow-slate-900/50 animate-scale-in transition-all duration-300">
        {title && (
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white transition-colors duration-300">
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
}