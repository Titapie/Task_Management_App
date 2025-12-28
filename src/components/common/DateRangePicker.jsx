import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";

export default function DateRangePicker() {
  const [range, setRange] = useState([null, null]);
  const [startDate, endDate] = range;

  // Apply dark mode to react-datepicker
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    const datePickerWrapper = document.querySelector('.react-datepicker__input-container');
    if (datePickerWrapper && isDark) {
      datePickerWrapper.closest('.react-datepicker-wrapper')?.classList.add('dark-mode');
    }
  }, []);

  return (
    <>
      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => setRange(update)}
        placeholderText="Select date range"
        className="w-full px-4 py-2.5 rounded-xl border
        border-slate-300 dark:border-slate-600
        bg-white dark:bg-slate-700
        text-gray-900 dark:text-white text-sm
        outline-none
        focus:border-indigo-500 dark:focus:border-indigo-400
        focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50
        transition-all duration-200
        placeholder-gray-400 dark:placeholder-slate-400
        cursor-pointer"
      />
      
      <style jsx global>{`
        /* Dark mode styles for react-datepicker */
        .dark .react-datepicker {
          background-color: rgb(51 65 85) !important;
          border-color: rgb(71 85 105) !important;
        }
        
        .dark .react-datepicker__header {
          background-color: rgb(30 41 59) !important;
          border-bottom-color: rgb(71 85 105) !important;
        }
        
        .dark .react-datepicker__current-month,
        .dark .react-datepicker__day-name,
        .dark .react-datepicker-time__header {
          color: rgb(226 232 240) !important;
        }
        
        .dark .react-datepicker__day {
          color: rgb(203 213 225) !important;
        }
        
        .dark .react-datepicker__day:hover {
          background-color: rgb(71 85 105) !important;
        }
        
        .dark .react-datepicker__day--selected,
        .dark .react-datepicker__day--in-range,
        .dark .react-datepicker__day--keyboard-selected {
          background-color: rgb(99 102 241) !important;
          color: white !important;
        }
        
        .dark .react-datepicker__day--disabled {
          color: rgb(100 116 139) !important;
        }
      `}</style>
    </>
  );
}