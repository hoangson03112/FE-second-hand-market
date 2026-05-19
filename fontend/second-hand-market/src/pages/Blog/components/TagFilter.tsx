import React from 'react';

interface TagFilterProps {
  allTags: string[];
  selectedTag: string;
  onTagSelect: (tag: string) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  allTags,
  selectedTag,
  onTagSelect,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onTagSelect('')}
        className={`px-3 py-2 rounded text-sm font-medium transition-colors cursor-pointer ${
          selectedTag === ''
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Tất cả
      </button>
      {allTags.map((tag, index) => (
        <button
          key={index}
          onClick={() => onTagSelect(tag)}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors cursor-pointer ${
            selectedTag === tag
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};
