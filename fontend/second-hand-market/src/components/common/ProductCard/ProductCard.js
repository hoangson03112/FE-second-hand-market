import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Skeleton,
  styled,
} from "@mui/material";
import { LocationOn, Visibility, FavoriteBorder } from "@mui/icons-material";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  cursor: "pointer",
  marginBottom: theme.spacing(3),
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    "& .product-image": {
      transform: "scale(1.05)",
    },
    "& .product-overlay": {
      opacity: 1,
    },
  },
}));

const ProductImageContainer = styled(Box)(({ theme }) => ({
  height: 200,
  position: "relative",
  overflow: "hidden",
}));

const ProductImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
  transition: "transform 0.3s ease-in-out",
  display: "block",
}));

const ProductOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 200,
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: 0,
  transition: "opacity 0.3s ease-in-out",
  zIndex: 2,
}));

const ViewButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "white",
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: "white",
    transform: "scale(1.1)",
  },
  boxShadow: theme.shadows[2],
}));

const PriceChip = styled(Chip)(({ theme }) => ({
  position: "absolute",
  top: 12,
  right: 12,
  backgroundColor: theme.palette.secondary.main,
  color: "white",
  fontWeight: 600,
  fontSize: "0.875rem",
  zIndex: 1,
}));

const LocationBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(1),
}));

const ProductCard = ({ product, isLoading = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isLoading && product?._id) {
      navigate(`/eco-market/product?productID=${product._id}`);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  if (isLoading) {
    return (
      <StyledCard>
        <Skeleton variant="rectangular" height={200} />
        <CardContent>
          <Skeleton variant="text" height={60} />
          <Skeleton variant="text" width="60%" height={24} sx={{ mt: 1 }} />
          <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
        </CardContent>
      </StyledCard>
    );
  }

  return (
    <StyledCard onClick={handleClick}>
      <Box position="relative">
        <ProductImageContainer>
          <ProductImage
            className="product-image"
            src={product?.avatar}
            alt={product?.title || "Product"}
            onError={(e) => {
              e.target.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmFmYiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPktow7RuZyBjw7MgaOG7i25oIOG6o25oPC90ZXh0Pgo8L3N2Zz4=";
            }}
            onLoad={() => {
              console.log("Image loaded successfully:", product?.avatar);
            }}
          />
        </ProductImageContainer>
        <PriceChip label={formatPrice(product?.price)} size="small" />
        <ProductOverlay className="product-overlay">
          <ViewButton size="large">
            <Visibility />
          </ViewButton>
        </ProductOverlay>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="body1"
          component="h3"
          sx={{
            fontWeight: 500,
            mb: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.4,
            height: "2.8em",
          }}
        >
          {product?.title || "Tên sản phẩm"}
        </Typography>

        <LocationBox>
          <LocationOn
            sx={{
              fontSize: "1rem",
              color: "text.secondary",
            }}
          />
          <Typography variant="body2" color="text.secondary">
            {product?.location || "Chưa cập nhật"}
          </Typography>
        </LocationBox>
      </CardContent>
    </StyledCard>
  );
};

export default ProductCard;
