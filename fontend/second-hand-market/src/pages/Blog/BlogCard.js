import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
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
  );
};

export default BlogCard;