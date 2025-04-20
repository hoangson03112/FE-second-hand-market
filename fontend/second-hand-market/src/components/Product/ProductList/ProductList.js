import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Pagination, CircularProgress, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import ProductCard from '../ProductCard';
import { useLocation, useNavigate } from 'react-router-dom';
import productService from '../../../services/productService';
import './ProductList.css';

/**
 * Component hiển thị danh sách sản phẩm
 * 
 * @param {Array} products - Danh sách sản phẩm (nếu được cung cấp)
 * @param {String} title - Tiêu đề cho danh sách
 * @param {Function} onAddToWishlist - Hàm xử lý khi thêm vào wishlist
 * @param {Array} wishlist - Danh sách ID của các sản phẩm đã yêu thích
 */
const ProductList = ({ 
  products: propProducts, 
  title, 
  onAddToWishlist, 
  wishlist = [] 
}) => {
  const [products, setProducts] = useState(propProducts || []);
  const [loading, setLoading] = useState(!propProducts);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const query = searchParams.get('q');
  const itemsPerPage = 12;

  // Nếu không có sản phẩm từ props, lấy từ API
  useEffect(() => {
    if (propProducts) {
      setProducts(propProducts);
      setTotalPages(Math.ceil(propProducts.length / itemsPerPage));
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: itemsPerPage,
          sort: mapSortToApi(sortBy)
        };

        if (category) params.categoryId = category;
        if (subcategory) params.subcategoryId = subcategory;
        if (query) params.query = query;

        const data = await productService.getAllProducts(params);
        setProducts(data.products || []);
        setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
      } catch (err) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', err);
        setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, sortBy, category, subcategory, query, propProducts]);

  // Chuyển trang
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Thay đổi sắp xếp
  const handleSortChange = (event) => {
    const newSortBy = event.target.value;
    setSortBy(newSortBy);
    
    // Cập nhật URL với tham số sort
    const currentParams = new URLSearchParams(location.search);
    currentParams.set('sort', newSortBy);
    navigate(`${location.pathname}?${currentParams.toString()}`);
  };

  // Ánh xạ từ các tùy chọn sắp xếp UI sang API
  const mapSortToApi = (uiSort) => {
    const sortMap = {
      'newest': '-createdAt',
      'oldest': 'createdAt',
      'price_asc': 'price',
      'price_desc': '-price',
      'popularity': '-viewCount'
    };
    return sortMap[uiSort] || '-createdAt';
  };

  return (
    <Box className="product-list-container">
      <Box className="product-list-header">
        <Typography variant="h5" className="product-list-title">
          {title || 'Sản phẩm'}
        </Typography>
        
        <FormControl variant="outlined" size="small" className="sort-control">
          <InputLabel>Sắp xếp theo</InputLabel>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            label="Sắp xếp theo"
          >
            <MenuItem value="newest">Mới nhất</MenuItem>
            <MenuItem value="oldest">Cũ nhất</MenuItem>
            <MenuItem value="price_asc">Giá tăng dần</MenuItem>
            <MenuItem value="price_desc">Giá giảm dần</MenuItem>
            <MenuItem value="popularity">Phổ biến nhất</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {loading ? (
        <Box className="loading-container">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box className="error-container">
          <Typography color="error">{error}</Typography>
        </Box>
      ) : products.length === 0 ? (
        <Box className="empty-container">
          <Typography variant="h6">Không tìm thấy sản phẩm nào</Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3} className="product-grid">
            {products.map((product) => (
              <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard 
                  product={product} 
                  onAddToWishlist={onAddToWishlist}
                  inWishlist={wishlist.includes(product._id)}
                />
              </Grid>
            ))}
          </Grid>
          
          {totalPages > 1 && (
            <Box className="pagination-container">
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ProductList; 