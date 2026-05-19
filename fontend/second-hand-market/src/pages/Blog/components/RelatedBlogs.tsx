import React from 'react';
import { Link } from 'react-router-dom';

interface RelatedBlog {
  _id: string;
  title: string;
  image: string;
  publishedAt: string;
}

interface RelatedBlogsProps {
  blogs: RelatedBlog[];
}

export const RelatedBlogs: React.FC<RelatedBlogsProps> = ({ blogs }) => {
  if (blogs.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h5 className="text-lg font-semibold text-gray-900">Bài viết liên quan</h5>
      </div>
      <div className="p-4">
        {blogs.map((relatedBlog, index) => (
          <div
            key={relatedBlog._id}
            className={`pb-3 mb-3 ${index !== blogs.length - 1 ? 'border-b border-gray-200' : ''}`}
          >
            <Link
              to={`/eco-market/blogs/${relatedBlog._id}`}
              className="flex gap-3 no-underline hover:opacity-80 transition-opacity"
            >
              <img
                src={relatedBlog.image}
                alt={relatedBlog.title}
                className="w-20 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h6 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                  {relatedBlog.title}
                </h6>
                <small className="text-gray-500 text-xs">
                  {new Date(relatedBlog.publishedAt).toLocaleDateString('vi-VN')}
                </small>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
