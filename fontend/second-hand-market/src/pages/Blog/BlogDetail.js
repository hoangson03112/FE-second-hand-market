import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  
  // Sử dụng useRef để theo dõi việc đã tăng view chưa
  const viewIncremented = useRef(false);

  useEffect(() => {
    fetchBlog();
    fetchRelatedBlogs();
    
    // Chỉ tăng view một lần
    if (!viewIncremented.current) {
      const timer = setTimeout(() => {
        incrementView();
        viewIncremented.current = true;
      }, 500); // Tăng delay để đảm bảo component đã mount hoàn toàn
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [id]);

  // Reset viewIncremented khi id thay đổi
  useEffect(() => {
    viewIncremented.current = false;
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`http://localhost:2000/eco-market/blogs/${id}`);
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

  // Thêm function riêng để tăng view với error handling tốt hơn
  const incrementView = async () => {
    try {
      const response = await fetch(`http://localhost:2000/eco-market/blogs/${id}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Cập nhật lại blog để có view count mới nhất
      const result = await response.json();
      console.log('View incremented successfully:', result);
    } catch (error) {
      console.error('Error incrementing view:', error);
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      const response = await fetch('http://localhost:2000/eco-market/blogs?limit=3');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRelatedBlogs(data.blogs.filter(b => b._id !== id).slice(0, 3));
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  const handleLike = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập để thích bài viết');
      return;
    }

    try {
      const response = await fetch(`http://localhost:2000/eco-market/blogs/${id}/like`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
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

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary"></div>
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container className="py-5 text-center">
        <h2>Không tìm thấy bài viết</h2>
        <Link to="/eco-market/blogs" className="btn btn-primary">
          Quay lại danh sách blog
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Img src={blog.image} alt={blog.title} style={{height: '400px', objectFit: 'cover'}} />
            <Card.Body>
              <div className="mb-3">
                {blog.tags.map((tag, index) => (
                  <Badge key={index} bg="success" className="me-2">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="mb-3">{blog.title}</h1>

              <div className="d-flex justify-content-between align-items-center mb-4 text-muted">
                <div className="d-flex align-items-center">
                  <img
                    src={blog.author?.avatar || '/images/default-avatar.png'}
                    alt={blog.author?.fullName}
                    className="rounded-circle me-2"
                    width="40"
                    height="40"
                  />
                  <div>
                    <div>{blog.author?.fullName}</div>
                    <small>{new Date(blog.publishedAt).toLocaleDateString('vi-VN')}</small>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span><i className="bi bi-eye"></i> {blog.views}</span>
                  <Button 
                    variant={isLiked ? "danger" : "outline-danger"}
                    size="sm"
                    onClick={handleLike}
                  >
                    <i className="bi bi-heart"></i> {likesCount}
                  </Button>
                </div>
              </div>

              <div 
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br>') }}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Header>
              <h5>Bài viết liên quan</h5>
            </Card.Header>
            <Card.Body>
              {relatedBlogs.map((relatedBlog) => (
                <div key={relatedBlog._id} className="mb-3 pb-3 border-bottom">
                  <Link to={`/eco-market/blogs/${relatedBlog._id}`} className="text-decoration-none">
                    <div className="d-flex">
                      <img
                        src={relatedBlog.image}
                        alt={relatedBlog.title}
                        className="me-2"
                        style={{width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px'}}
                      />
                      <div>
                        <h6 className="mb-1">{relatedBlog.title}</h6>
                        <small className="text-muted">
                          {new Date(relatedBlog.publishedAt).toLocaleDateString('vi-VN')}
                        </small>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BlogDetail;