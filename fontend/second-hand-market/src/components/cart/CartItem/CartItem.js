import React from 'react';
import { Box, Card, Typography, IconButton, TextField, Stack, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import './CartItem.css';
import { formatCurrency } from '../../../utils/helpers';
import { Link } from 'react-router-dom';

/**
 * Component hiển thị một sản phẩm trong giỏ hàng
 * 
 * @param {Object} product - Thông tin sản phẩm
 * @param {number} quantity - Số lượng sản phẩm
 * @param {function} onRemove - Hàm xử lý khi xóa sản phẩm
 * @param {function} onUpdateQuantity - Hàm xử lý khi cập nhật số lượng
 */
const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  const { product, quantity } = item;
  
  // Xử lý thay đổi số lượng sản phẩm
  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value);
    if (newQuantity > 0) {
      onUpdateQuantity(product._id, newQuantity);
    }
  };

  // Tăng số lượng sản phẩm
  const increaseQuantity = () => {
    onUpdateQuantity(product._id, quantity + 1);
  };

  // Giảm số lượng sản phẩm
  const decreaseQuantity = () => {
    if (quantity > 1) {
      onUpdateQuantity(product._id, quantity - 1);
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemove = () => {
    onRemove(product._id);
  };

  return (
    <Card className="cart-item-card">
      <Box className="cart-item">
        <Box className="cart-item-image-container">
          <img
            src={product.images[0]} 
            alt={product.name}
            className="cart-item-image"
          />
        </Box>
        
        <Box className="cart-item-details">
          <Link to={`/eco-market/product?id=${product._id}`} className="cart-item-name-link">
            <Typography variant="h6" className="cart-item-name">
              {product.name}
            </Typography>
          </Link>
          
          <Typography variant="body2" className="cart-item-seller">
            Người bán: {product.seller.name}
          </Typography>
          
          <Typography variant="body2" className="cart-item-category">
            Danh mục: {product.category.name}
          </Typography>
        </Box>
        
        <Box className="cart-item-price">
          <Typography variant="h6" color="primary">
            {formatCurrency(product.price)}
          </Typography>
        </Box>
        
        <Box className="cart-item-quantity">
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton 
              size="small" 
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className="quantity-button"
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            
            <TextField
              type="number"
              size="small"
              InputProps={{ inputProps: { min: 1, max: 100 } }}
              value={quantity}
              onChange={handleQuantityChange}
              className="quantity-input"
            />
            
            <IconButton 
              size="small" 
              onClick={increaseQuantity}
              className="quantity-button"
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
        
        <Box className="cart-item-subtotal">
          <Typography variant="h6">
            {formatCurrency(product.price * quantity)}
          </Typography>
        </Box>
        
        <Box className="cart-item-actions">
          <IconButton 
            color="error" 
            onClick={handleRemove}
            className="remove-button"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      <Divider />
    </Card>
  );
};

export default CartItem;