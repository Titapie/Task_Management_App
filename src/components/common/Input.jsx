// src/components/common/Input.jsx
import React, { useRef, useEffect } from 'react';

const Input = ({ 
  type = "text", 
  value, 
  onChange, 
  placeholder = "",
  className = "",
  multiline = false,
  rows = 4,
  ...props 
}) => {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (multiline && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value, multiline]);

  const baseClassName = `w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition ${className}`;

  if (multiline) {
    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`${baseClassName} resize-none`}
        {...props}
      />
    );
  }

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={baseClassName}
      {...props}
    />
  );
};

export default Input;