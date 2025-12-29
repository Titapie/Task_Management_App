export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base = "px-5 py-2.5 rounded-xl text-sm font-semibold transition";

  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-100",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button {...props} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
