import React from 'react';

interface BlogDetailContentProps {
  blog: {
    title: string;
    image: string;
    tags: string[];
    author: {
      fullName: string;
      avatar?: string;
    };
    publishedAt: string;
    views: number;
    content: string;
  };
  isLiked: boolean;
  likesCount: number;
  onLike: () => void;
}

export const BlogDetailContent: React.FC<BlogDetailContentProps> = ({
  blog,
  isLiked,
  likesCount,
  onLike,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Main Image */}
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-96 object-cover"
      />

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {blog.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-green-500 text-white text-sm rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{blog.title}</h1>

        {/* Meta Info */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center">
            <img
              src={blog.author?.avatar || '/images/default-avatar.png'}
              alt={blog.author?.fullName}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <div className="font-medium text-gray-900">{blog.author?.fullName}</div>
              <small className="text-gray-500">
                {new Date(blog.publishedAt).toLocaleDateString('vi-VN')}
              </small>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              <i className="bi bi-eye mr-1"></i> {blog.views}
            </span>
            <button
              onClick={onLike}
              className={`flex items-center gap-1 px-3 py-1 rounded transition-colors ${
                isLiked
                  ? 'bg-red-500 text-white'
                  : 'border border-red-500 text-red-500 hover:bg-red-50'
              }`}
            >
              <i className="bi bi-heart"></i> {likesCount}
            </button>
          </div>
        </div>

        {/* Blog Content */}
        <div
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br>') }}
        />
      </div>
    </div>
  );
};
