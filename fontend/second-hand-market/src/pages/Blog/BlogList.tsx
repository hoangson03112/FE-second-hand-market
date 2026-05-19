import React from 'react';
import { useBlogList } from './hooks/useBlogList';
import { BlogCard as BlogCardComponent } from './components/BlogCard';
import { SearchBar } from './components/SearchBar';
import { TagFilter } from './components/TagFilter';

const BlogList = () => {
  const {
    blogs,
    loading,
    currentPage,
    totalPages,
    selectedTag,
    searchKeyword,
    allTags,
    error,
    setCurrentPage,
    setSelectedTag,
    setSearchKeyword,
    handleSearch,
    formatDate,
    truncateText,
  } = useBlogList();

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Blog Đồ Cũ</h1>
          <p className="text-gray-600">Khám phá những câu chuyện thú vị về đồ cũ và môi trường</p>
        </div>
        <div className="md:col-span-1">
          <SearchBar
            searchKeyword={searchKeyword}
            onSearchChange={setSearchKeyword}
            onSubmit={handleSearch}
          />
        </div>
      </div>

      {/* Tag Filter */}
      <div className="mb-6">
        <TagFilter
          allTags={allTags}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      ) : (
        <>
          {/* Blog Grid */}
          {blogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {blogs.map((blog) => (
                <BlogCardComponent
                  key={blog._id}
                  blog={blog}
                  formatDate={formatDate}
                  truncateText={truncateText}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h4 className="text-xl font-semibold text-gray-700 mb-2">
                Không tìm thấy blog nào
              </h4>
              <p className="text-gray-600">Hãy thử tìm kiếm với từ khóa khác</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Trước
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 border rounded transition-colors ${
                      currentPage === index + 1
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sau
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogList;
