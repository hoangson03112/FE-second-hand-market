// BlogForm.js
import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, TextField, Button, FormControl,
  InputLabel, Select, MenuItem, Chip, Alert, Grid
} from '@mui/material';
import { Save, Preview } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    tags: [],
    status: 'draft'
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    if (isEdit) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(` /blogs/${id}`);
      const data = await response.json();
      setFormData({
        title: data.blog.title,
        content: data.blog.content,
        excerpt: data.blog.excerpt,
        image: data.blog.image,
        tags: data.blog.tags || [],
        status: data.blog.status
      });
    } catch (error) {
      showAlert('Lỗi khi tải blog', 'error');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.excerpt || !formData.image) {
      showAlert('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = isEdit ? ` /blogs/${id}` : ' /blogs';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showAlert(
          isEdit ? 'Cập nhật blog thành công!' : 'Tạo blog thành công!',
          'success'
        );
        setTimeout(() => navigate('/eco-market/admin/blogs'), 1500);
      } else {
        throw new Error('Có lỗi xảy ra');
      }
    } catch (error) {
      showAlert('Có lỗi xảy ra khi lưu blog', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  return (
    <Box>
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        {isEdit ? 'Chỉnh sửa Blog' : 'Tạo Blog Mới'}
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tiêu đề blog"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả ngắn"
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                multiline
                rows={2}
                inputProps={{ maxLength: 200 }}
                helperText={`${formData.excerpt.length}/200 ký tự`}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL hình ảnh"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                required
              />
              {formData.image && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={formData.image}
                    alt="Preview"
                    style={{ width: '100%', maxWidth: 400, height: 200, objectFit: 'cover' }}
                  />
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nội dung blog"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                multiline
                rows={10}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="Thêm tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button onClick={handleAddTag}>Thêm</Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  label="Trạng thái"
                >
                  <MenuItem value="draft">Bản nháp</MenuItem>
                  <MenuItem value="published">Xuất bản</MenuItem>
                  <MenuItem value="archived">Lưu trữ</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/eco-market/admin/blogs')}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={loading}
                >
                  {loading ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Tạo Blog')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default BlogForm;