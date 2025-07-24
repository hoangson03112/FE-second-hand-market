import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Skeleton,
} from "@mui/material";
import { ShoppingCart, InfoOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductMessage = ({ product }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleViewProduct = () => {
    const productId = product._id;

    if (productId) {
      navigate(`/product?productID=${productId}`);
    } else {
      console.error("Product ID not found in product object:", product);
    }
  };

  // Hiển thị skeleton khi đang tải
  if (isLoading) {
    return (
      <Card
        variant="outlined"
        sx={{
          maxWidth: 320,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(230, 230, 230, 0.7)",
          bgcolor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <Skeleton variant="rectangular" height={140} animation="wave" />
        <CardContent sx={{ p: 2 }}>
          <Skeleton variant="text" width="80%" height={24} animation="wave" />
          <Skeleton
            variant="text"
            width="40%"
            height={20}
            animation="wave"
            sx={{ mb: 1 }}
          />
          <Skeleton variant="rectangular" height={36} animation="wave" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      variant="outlined"
      sx={{
        maxWidth: 320,
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
        border: "1px solid rgba(230, 230, 230, 0.7)",
        bgcolor: "rgba(255, 255, 255, 0.8)",
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          transform: "translateY(-1px)",
        },
      }}
    >
      {product.image ? (
        <CardMedia
          component="img"
          height="140"
          image={product.image.url}
          alt={product.name || "Sản phẩm"}
          sx={{ objectFit: "cover" }}
        />
      ) : (
        <Box
          sx={{
            height: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#324155",
            color: "white",
          }}
        >
          <InfoOutlined sx={{ mr: 1 }} />
          <Typography variant="subtitle1">Không có ảnh sản phẩm</Typography>
        </Box>
      )}
      <CardContent sx={{ p: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: "#324155",
            fontSize: "0.95rem",
            mb: 0.5,
          }}
        >
          {product.name || "Sản phẩm được chia sẻ"}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#324155",
            fontWeight: 500,
            mb: 1.5,
          }}
        >
          {typeof product.price === "number"
            ? product.price.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })
            : product.price || "Liên hệ"}
        </Typography>
        <Button
          variant="contained"
          size="small"
          fullWidth
          onClick={handleViewProduct}
          sx={{
            bgcolor: "#324155",
            color: "#fff",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              bgcolor: "#455a74",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
            },
          }}
          startIcon={<ShoppingCart fontSize="small" />}
        >
          Xem sản phẩm
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductMessage;
