import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

export default function DateRangePicker() {
  const [range, setRange] = useState([null, null]);
  const [startDate, endDate] = range;

  return (
    <DatePicker
      selectsRange
      startDate={startDate}
      endDate={endDate}
      onChange={(update) => setRange(update)}
      placeholderText="Select date range"
      className="w-full px-4 py-2.5 rounded-xl border
      border-slate-300 text-sm"
    />
  );
}
