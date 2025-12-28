// src/components/common/Input.jsx
import React from 'react';

const Input = ({ 
  type = "text", 
  value, 
  onChange, 
  placeholder = "",
  className = "",
  ...props 
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition ${className}`}
      {...props}
    />
  );
};

export default Input;