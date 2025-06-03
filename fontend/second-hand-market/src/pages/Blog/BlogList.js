// BlogList.js (Public)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Form, Pagination } from 'react-bootstrap';
import './BlogList.css';

const BlogList = () => {
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
      let url = `http://localhost:2000/eco-market/blogs?page=${currentPage}&limit=6`;
      if (selectedTag) {
        url += `&tag=${selectedTag}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setBlogs(data.blogs);
      setTotalPages(data.totalPages);
      
      // Extract unique tags
      const tags = [...new Set(data.blogs.flatMap(blog => blog.tags))];
      setAllTags(tags);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      fetchBlogs();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:2000/eco-market/blogs/search/${searchKeyword}?page=1&limit=6`);
      const data = await response.json();
      setBlogs(data.blogs);
      setTotalPages(data.totalPages);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error searching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col md={8}>
          <h1 className="blog-title">Blog Đồ Cũ</h1>
          <p className="text-muted">Khám phá những câu chuyện thú vị về đồ cũ và môi trường</p>
        </Col>
        <Col md={4}>
          <Form onSubmit={handleSearch}>
            <div className="d-flex">
              <Form.Control
                type="text"
                placeholder="Tìm kiếm blog..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <button type="submit" className="btn btn-primary ms-2">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </Form>
        </Col>
      </Row>

      {/* Filter Tags */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex flex-wrap gap-2">
            <Badge
              bg={selectedTag === '' ? 'primary' : 'secondary'}
              className="p-2 cursor-pointer"
              onClick={() => setSelectedTag('')}
            >
              Tất cả
            </Badge>
            {allTags.map((tag, index) => (
              <Badge
                key={index}
                bg={selectedTag === tag ? 'primary' : 'secondary'}
                className="p-2 cursor-pointer"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : (
        <>
          <Row>
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <Col md={6} lg={4} key={blog._id} className="mb-4">
                  <Card className="blog-card h-100 shadow-sm">
                    <div className="blog-image-container">
                      <Card.Img
                        variant="top"
                        src={blog.image}
                        alt={blog.title}
                        className="blog-image"
                      />
                      <div className="blog-overlay">
                        <Link to={`/eco-market/blogs/${blog._id}`} className="btn btn-primary btn-sm">
                          Đọc tiếp
                        </Link>
                      </div>
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <div className="mb-2">
                        {blog.tags.map((tag, index) => (
                          <Badge key={index} bg="success" className="me-1 mb-1">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Card.Title className="blog-card-title">
                        <Link to={`/eco-market/blogs/${blog._id}`} className="text-decoration-none">
                          {truncateText(blog.title, 60)}
                        </Link>
                      </Card.Title>
                      <Card.Text className="blog-excerpt text-muted">
                        {truncateText(blog.excerpt, 100)}
                      </Card.Text>
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center text-muted small">
                          <div className="d-flex align-items-center">
                            <img
                              src={blog.author?.avatar || '/images/default-avatar.png'}
                              alt={blog.author?.fullName}
                              className="rounded-circle me-2"
                              width="24"
                              height="24"
                            />
                            <span>{blog.author?.fullName}</span>
                          </div>
                          <div className="d-flex align-items-center gap-3">
                            <span>
                              <i className="bi bi-eye me-1"></i>
                              {blog.views}
                            </span>
                            <span>{formatDate(blog.publishedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col className="text-center py-5">
                <h4>Không tìm thấy blog nào</h4>
                <p className="text-muted">Hãy thử tìm kiếm với từ khóa khác</p>
              </Col>
            )}
          </Row>

          {totalPages > 1 && (
            <Row className="mt-4">
              <Col className="d-flex justify-content-center">
                <Pagination>
                  <Pagination.Prev
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  />
                  {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={currentPage === index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  />
                </Pagination>
              </Col>
            </Row>
          )}
        </>
      )}
    </Container>
  );
};

export default BlogList;