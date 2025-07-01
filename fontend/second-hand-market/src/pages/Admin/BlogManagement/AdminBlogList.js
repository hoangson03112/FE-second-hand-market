// AdminBlogList.js - Enhanced Version
import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Select, FormControl, InputLabel, Pagination, Alert, Grid,
  Card, CardMedia, CardContent, Avatar, Skeleton, Fade,
  Stack, Divider, Tooltip, InputAdornment
} from '@mui/material';
import { 
  Edit, Delete, Add, Visibility, Search, FilterList,
  CalendarToday, Person, TrendingUp, Article
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
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
      const response = await fetch(` /blogs/admin/all?page=${page}&status=${statusFilter}`, {
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
      await fetch(` /blogs/${deleteDialog.blog._id}`, {
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
      await fetch(` /blogs/${blogId}/status`, {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published': return '🟢';
      case 'draft': return '🟡';
      case 'archived': return '⚪';
      default: return '⚪';
    }
  };

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.author?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatsCard = ({ icon, title, value, color }) => (
    <Card sx={{ 
      p: 2, 
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      border: `1px solid ${color}30`,
      borderRadius: 2
    }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar sx={{ bgcolor: color, width: 48, height: 48 }}>
          {icon}
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold" color={color}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );

  const BlogCard = ({ blog }) => (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4
      }
    }}>
      <CardMedia
        component="img"
        height="200"
        image={blog.image}
        alt={blog.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
          {blog.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 40, overflow: 'hidden' }}>
          {blog.excerpt}
        </Typography>
        
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Avatar sx={{ width: 24, height: 24 }}>
            <Person fontSize="small" />
          </Avatar>
          <Typography variant="body2">{blog.author?.fullName}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Chip
            label={`${getStatusIcon(blog.status)} ${blog.status}`}
            color={getStatusColor(blog.status)}
            size="small"
          />
          <Stack direction="row" alignItems="center" spacing={1}>
            <Visibility fontSize="small" color="action" />
            <Typography variant="body2">{blog.views}</Typography>
          </Stack>
        </Stack>

        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
          {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            startIcon={<Edit />}
            onClick={() => navigate(`/eco-market/admin/blogs/edit/${blog._id}`)}
            variant="outlined"
            fullWidth
          >
            Sửa
          </Button>
          <Button
            size="small"
            startIcon={<Delete />}
            onClick={() => setDeleteDialog({ open: true, blog })}
            color="error"
            variant="outlined"
            fullWidth
          >
            Xóa
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );

  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[...Array(6)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" height={32} />
              <Skeleton variant="text" height={20} width="80%" />
              <Skeleton variant="text" height={20} width="60%" />
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Skeleton variant="rectangular" width="48%" height={36} />
                <Skeleton variant="rectangular" width="48%" height={36} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <Fade in timeout={500}>
        <Box>
          {alert.show && (
            <Alert 
              severity={alert.type} 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                boxShadow: 2
              }}
            >
              {alert.message}
            </Alert>
          )}

          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 1, color: '#1976d2' }}>
              📝 Quản lý Blog
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Quản lý và theo dõi tất cả các bài viết blog của bạn
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                icon={<Article />}
                title="Tổng Blog"
                value={blogs.length}
                color="#1976d2"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                icon={<TrendingUp />}
                title="Đã xuất bản"
                value={blogs.filter(b => b.status === 'published').length}
                color="#2e7d32"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                icon={<Edit />}
                title="Bản nháp"
                value={blogs.filter(b => b.status === 'draft').length}
                color="#ed6c02"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                icon={<Visibility />}
                title="Tổng lượt xem"
                value={blogs.reduce((sum, blog) => sum + (blog.views || 0), 0)}
                color="#9c27b0"
              />
            </Grid>
          </Grid>

          {/* Controls */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 2 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
              <TextField
                placeholder="Tìm kiếm blog..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ flexGrow: 1 }}
              />
              
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <FilterList />
                    <span>Trạng thái</span>
                  </Stack>
                </InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Trạng thái"
                >
                  <MenuItem value="all">🌐 Tất cả</MenuItem>
                  <MenuItem value="published">🟢 Đã xuất bản</MenuItem>
                  <MenuItem value="draft">🟡 Bản nháp</MenuItem>
                  <MenuItem value="archived">⚪ Đã lưu trữ</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/eco-market/admin/blogs/new')}
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  boxShadow: 3
                }}
              >
                Tạo Blog Mới
              </Button>
            </Stack>
          </Paper>

          {/* Content */}
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {/* Grid View */}
              <Grid container spacing={3}>
                {filteredBlogs.map((blog) => (
                  <Grid item xs={12} sm={6} md={4} key={blog._id}>
                    <BlogCard blog={blog} />
                  </Grid>
                ))}
              </Grid>

              {filteredBlogs.length === 0 && !loading && (
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    📝 Không tìm thấy blog nào
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Hãy tạo blog đầu tiên của bạn'}
                  </Typography>
                </Paper>
              )}
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Paper sx={{ p: 2, borderRadius: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Paper>
            </Box>
          )}
        </Box>
      </Fade>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialog.open} 
        onClose={() => setDeleteDialog({ open: false, blog: null })}
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Delete color="error" />
            <Typography variant="h6" fontWeight="bold">
              Xác nhận xóa
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Bạn có chắc chắn muốn xóa blog{' '}
            <strong>"{deleteDialog.blog?.title}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button 
            onClick={() => setDeleteDialog({ open: false, blog: null })}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Xóa Blog
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminBlogList;