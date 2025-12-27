export default function HelpCenterCard() {
  return (
    <div className="mt-auto p-5 bg-slate-900 dark:bg-slate-950 rounded-[32px] text-center relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20">
      {/* Các hình khối trang trí ẩn hiện phía dưới (Decorative Shapes) */}
      <div className="absolute -top-6 -right-6 w-16 h-16 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all" />
      <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-indigo-600/10 rounded-full blur-xl" />

      <div className="relative z-10">
        {/* Icon Circle với hiệu ứng Ring */}
        <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-inner group-hover:scale-110 transition-transform duration-300">
          ?
        </div>

        <h4 className="text-sm text-white font-bold mb-1">Help Center</h4>
        <p className="text-[10px] text-slate-400 font-medium mb-5 px-2 leading-relaxed">
          Having trouble? Please contact us for more questions.
        </p>

        {/* Nút bấm hiệu ứng trắng bóng */}
        <button className="w-full bg-white hover:bg-slate-50 text-slate-900 py-3 rounded-2xl text-[11px] font-extrabold uppercase tracking-wider shadow-lg transform active:scale-95 transition-all">
          Go To Help Center
        </button>
      </div>
    </div>
  );
}
