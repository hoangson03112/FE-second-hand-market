import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  MenuItem,
  Button,
  Grid,
  Typography,
  Chip,
  Stack,
  Collapse,
  IconButton
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

const OrderFilter = ({ onFilterChange, totalOrders = 0 }) => {
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    searchTerm: '',
    minAmount: '',
    maxAmount: ''
  });

  // Status options
  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'shipped', label: 'Đã giao vận' },
    { value: 'delivered', label: 'Đã giao hàng' },
    { value: 'cancelled', label: 'Đã hủy' }
  ];

  // Time range options
  const timeRangeOptions = [
    { value: '', label: 'Tất cả thời gian' },
    { value: 'today', label: 'Hôm nay' },
    { value: 'week', label: '7 ngày qua' },
    { value: 'month', label: '30 ngày qua' },
    { value: 'quarter', label: '3 tháng qua' }
  ];

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    
    // Apply time range presets
    if (field === 'timeRange' && value) {
      const now = new Date();
      let fromDate = '';
      
      switch (value) {
        case 'today':
          fromDate = now.toISOString().split('T')[0];
          newFilters.dateFrom = fromDate;
          newFilters.dateTo = fromDate;
          break;
        case 'week':
          fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          newFilters.dateFrom = fromDate;
          newFilters.dateTo = now.toISOString().split('T')[0];
          break;
        case 'month':
          fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          newFilters.dateFrom = fromDate;
          newFilters.dateTo = now.toISOString().split('T')[0];
          break;
        case 'quarter':
          fromDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          newFilters.dateFrom = fromDate;
          newFilters.dateTo = now.toISOString().split('T')[0];
          break;
        default:
          newFilters.dateFrom = '';
          newFilters.dateTo = '';
      }
      setFilters(newFilters);
    }
    
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      status: '',
      dateFrom: '',
      dateTo: '',
      searchTerm: '',
      minAmount: '',
      maxAmount: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== '').length;
  };

  const getActiveFiltersDisplay = () => {
    const activeFilters = [];
    
    if (filters.status) {
      const statusLabel = statusOptions.find(opt => opt.value === filters.status)?.label;
      activeFilters.push(`Trạng thái: ${statusLabel}`);
    }
    
    if (filters.searchTerm) {
      activeFilters.push(`Tìm kiếm: "${filters.searchTerm}"`);
    }
    
    if (filters.dateFrom && filters.dateTo) {
      activeFilters.push(`Từ ${filters.dateFrom} đến ${filters.dateTo}`);
    } else if (filters.dateFrom) {
      activeFilters.push(`Từ ${filters.dateFrom}`);
    } else if (filters.dateTo) {
      activeFilters.push(`Đến ${filters.dateTo}`);
    }
    
    if (filters.minAmount || filters.maxAmount) {
      let amountFilter = 'Số tiền: ';
      if (filters.minAmount && filters.maxAmount) {
        amountFilter += `${filters.minAmount} - ${filters.maxAmount}`;
      } else if (filters.minAmount) {
        amountFilter += `từ ${filters.minAmount}`;
      } else {
        amountFilter += `đến ${filters.maxAmount}`;
      }
      activeFilters.push(amountFilter);
    }
    
    return activeFilters;
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <FilterListIcon color="primary" />
          <Typography variant="h6">
            Bộ lọc đơn hàng
          </Typography>
          {getActiveFiltersCount() > 0 && (
            <Chip 
              label={`${getActiveFiltersCount()} bộ lọc`}
              size="small"
              color="white"
              variant="outlined"
            />
          )}
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" color="text.secondary">
            {totalOrders} đơn hàng
          </Typography>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            size="small"
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Active Filters Display */}
      {getActiveFiltersCount() > 0 && (
        <Box mb={2}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {getActiveFiltersDisplay().map((filter, index) => (
              <Chip
                key={index}
                label={filter}
                size="small"
                variant="outlined"
                color="white"
              />
            ))}
            <Button
              size="small"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
              color="error"
            >
              Xóa bộ lọc
            </Button>
          </Stack>
        </Box>
      )}

      {/* Quick Filters */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            placeholder="Tìm kiếm đơn hàng..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            fullWidth
            size="small"
            label="Trạng thái"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            fullWidth
            size="small"
            label="Thời gian"
            value=""
            onChange={(e) => handleFilterChange('timeRange', e.target.value)}
          >
            {timeRangeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant={expanded ? "contained" : "outlined"}
            onClick={() => setExpanded(!expanded)}
            endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            {expanded ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </Button>
        </Grid>
      </Grid>

      {/* Advanced Filters */}
      <Collapse in={expanded}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Từ ngày"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Đến ngày"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Số tiền tối thiểu"
              value={filters.minAmount}
              onChange={(e) => handleFilterChange('minAmount', e.target.value)}
              placeholder="0"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Số tiền tối đa"
              value={filters.maxAmount}
              onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
              placeholder="1000000"
            />
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
};

export default OrderFilter;