import React from 'react';

interface SearchBarProps {
  searchKeyword: string;
  onSearchChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchKeyword,
  onSearchChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="flex">
      <input
        type="text"
        placeholder="Tìm kiếm blog..."
        value={searchKeyword}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
      >
        <i className="bi bi-search"></i>
      </button>
    </form>
  );
};
