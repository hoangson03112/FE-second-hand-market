import React from 'react';
import { Link } from 'react-router-dom';
import { useBlogDetail } from './hooks/useBlogDetail';
import { BlogDetailContent } from './components/BlogDetailContent';
import { RelatedBlogs } from './components/RelatedBlogs';

const BlogDetail = () => {
  const { blog, loading, isLiked, likesCount, relatedBlogs, handleLike } = useBlogDetail();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bài viết</h2>
        <Link
          to="/eco-market/blogs"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors no-underline"
        >
          Quay lại danh sách blog
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <BlogDetailContent
            blog={blog}
            isLiked={isLiked}
            likesCount={likesCount}
            onLike={handleLike}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <RelatedBlogs blogs={relatedBlogs} />
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
