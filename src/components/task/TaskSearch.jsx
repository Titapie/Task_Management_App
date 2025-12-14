import React, { useState, useEffect } from 'react';

const TaskSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 500); // Debounce 500ms

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Tìm kiếm task..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border rounded px-4 py-2"
      />
    </div>
  );
};

export default TaskSearch;