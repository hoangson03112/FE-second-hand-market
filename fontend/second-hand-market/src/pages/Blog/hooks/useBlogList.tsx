import { useState, useEffect } from 'react';

export const useBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTag, setSelectedTag] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, selectedTag]);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `/blogs?page=${currentPage}&limit=6`;
      if (selectedTag) {
        url += `&tag=${selectedTag}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setBlogs(data.blogs);
      setTotalPages(data.totalPages);

      // Extract unique tags
      const tags = [...new Set(data.blogs.flatMap((blog: any) => blog.tags))];
      setAllTags(tags);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Không thể tải danh sách blog. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      fetchBlogs();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/blogs/search/${searchKeyword}?page=1&limit=6`);
      const data = await response.json();
      setBlogs(data.blogs);
      setTotalPages(data.totalPages);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error searching blogs:', error);
      setError('Không thể tìm kiếm blog. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return {
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
  };
};
