import React from 'react';
import { Link } from 'react-router-dom';

interface BlogCardProps {
  blog: {
    _id: string;
    title: string;
    excerpt: string;
    image: string;
    tags: string[];
    author: {
      fullName: string;
      avatar?: string;
    };
    views: number;
    publishedAt: string;
  };
  formatDate: (date: string) => string;
  truncateText: (text: string, maxLength: number) => string;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog, formatDate, truncateText }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col">
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-lg group">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            to={`/eco-market/blogs/${blog._id}`}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            Đọc tiếp
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-1">
          {blog.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-green-500 text-white text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="mb-2">
          <Link
            to={`/eco-market/blogs/${blog._id}`}
            className="text-gray-800 font-semibold text-lg hover:text-green-600 transition-colors no-underline"
          >
            {truncateText(blog.title, 60)}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
          {truncateText(blog.excerpt, 100)}
        </p>

        {/* Footer */}
        <div className="mt-auto flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center">
            <img
              src={blog.author?.avatar || '/images/default-avatar.png'}
              alt={blog.author?.fullName}
              className="w-6 h-6 rounded-full mr-2"
            />
            <span>{blog.author?.fullName}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>
              <i className="bi bi-eye mr-1"></i>
              {blog.views}
            </span>
            <span>{formatDate(blog.publishedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
