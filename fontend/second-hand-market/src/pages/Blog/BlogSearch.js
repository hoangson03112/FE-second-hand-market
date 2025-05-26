import React, { useState } from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap';

const BlogSearch = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(keyword);
  };

  const handleInputChange = async (value) => {
    setKeyword(value);
    if (value.length > 2) {
      try {
        const response = await fetch(`http://localhost:2000/eco-market/blogs/search/${value}?limit=5`);
        const data = await response.json();
        setSuggestions(data.blogs);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="position-relative">
      <Form onSubmit={handleSearch}>
        <div className="d-flex">
          <Form.Control
            type="text"
            placeholder="Tìm kiếm blog..."
            value={keyword}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          <Button type="submit" variant="primary" className="ms-2">
            <i className="bi bi-search"></i>
          </Button>
        </div>
      </Form>
      
      {suggestions.length > 0 && (
        <ListGroup className="position-absolute w-100 mt-1" style={{zIndex: 1000}}>
          {suggestions.map((blog) => (
            <ListGroup.Item 
              key={blog._id} 
              action 
              onClick={() => onSearch(blog.title)}
              className="d-flex align-items-center"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="me-2"
                style={{width: '40px', height: '30px', objectFit: 'cover'}}
              />
              <div>
                <div className="fw-bold">{blog.title}</div>
                <small className="text-muted">{blog.excerpt.substring(0, 50)}...</small>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default BlogSearch;