// AdminBlogList.js
import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Select, FormControl, InputLabel, Pagination, Alert
} from '@mui/material';
import { Edit, Delete, Add, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, blog: null });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, [page, statusFilter]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:2000/eco-market/blogs/admin/all?page=${page}&status=${statusFilter}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setBlogs(data.blogs);
      setTotalPages(data.totalPages);
    } catch (error) {
      showAlert('Lỗi khi tải blogs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:2000/eco-market/blogs/${deleteDialog.blog._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      showAlert('Xóa blog thành công', 'success');
      fetchBlogs();
    } catch (error) {
      showAlert('Lỗi khi xóa blog', 'error');
    }
    setDeleteDialog({ open: false, blog: null });
  };

  const handleStatusChange = async (blogId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:2000/eco-market/blogs/${blogId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      showAlert('Cập nhật trạng thái thành công', 'success');
      fetchBlogs();
    } catch (error) {
      showAlert('Lỗi khi cập nhật trạng thái', 'error');
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box>
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Quản lý Blog
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/eco-market/admin/blogs/new')}
        >
          Tạo Blog Mới
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Trạng thái"
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="published">Đã xuất bản</MenuItem>
            <MenuItem value="draft">Bản nháp</MenuItem>
            <MenuItem value="archived">Đã lưu trữ</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Tác giả</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Lượt xem</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog._id}>
                <TableCell>
                  <img
                    src={blog.image}
                    alt={blog.title}
                    style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {blog.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {blog.excerpt}
                  </Typography>
                </TableCell>
                <TableCell>{blog.author?.fullName}</TableCell>
                <TableCell>
                  <Select
                    value={blog.status}
                    onChange={(e) => handleStatusChange(blog._id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="draft">Bản nháp</MenuItem>
                    <MenuItem value="published">Đã xuất bản</MenuItem>
                    <MenuItem value="archived">Đã lưu trữ</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Chip
                    label={blog.views}
                    size="small"
                    icon={<Visibility />}
                  />
                </TableCell>
                <TableCell>
                  {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => navigate(`/eco-market/admin/blogs/edit/${blog._id}`)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => setDeleteDialog({ open: true, blog })}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, blog: null })}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa blog "{deleteDialog.blog?.title}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, blog: null })}>
            Hủy
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminBlogList;