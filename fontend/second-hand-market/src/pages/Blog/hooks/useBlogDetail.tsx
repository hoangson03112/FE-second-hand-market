import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNotification } from '../../../hooks/useNotification';

export const useBlogDetail = () => {
  const { id } = useParams();
  const { showWarning } = useNotification();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);
  const viewIncremented = useRef(false);

  useEffect(() => {
    fetchBlog();
    fetchRelatedBlogs();

    if (!viewIncremented.current) {
      const timer = setTimeout(() => {
        incrementView();
        viewIncremented.current = true;
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [id]);

  useEffect(() => {
    viewIncremented.current = false;
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/blogs/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBlog(data.blog);
      setLikesCount(data.blog.likes.length);

      const token = localStorage.getItem('token');
      if (token) {
        setIsLiked(false);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementView = async () => {
    try {
      const response = await fetch(`/blogs/${id}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('View incremented successfully:', result);
    } catch (error) {
      console.error('Error incrementing view:', error);
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      const response = await fetch('/blogs?limit=3');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRelatedBlogs(data.blogs.filter((b: any) => b._id !== id).slice(0, 3));
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  const handleLike = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      showWarning('Vui lòng đăng nhập để thích bài viết');
      return;
    }

    try {
      const response = await fetch(`/blogs/${id}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setIsLiked(data.isLiked);
      setLikesCount(data.likesCount);
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  return {
    blog,
    loading,
    isLiked,
    likesCount,
    relatedBlogs,
    handleLike,
  };
};
