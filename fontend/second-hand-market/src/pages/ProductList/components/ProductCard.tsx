import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Stack,
  Box,
  Rating,
  Chip,
  Tooltip,
  useTheme,
  alpha,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

// Icons
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import ZoomOutMapOutlinedIcon from "@mui/icons-material/ZoomOutMapOutlined";
import FlashOnOutlinedIcon from "@mui/icons-material/FlashOnOutlined";
import NewReleasesOutlinedIcon from "@mui/icons-material/NewReleasesOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

// ========== STYLED COMPONENTS ========== //

const CardContainer = styled(Card, {
  shouldForwardProp: (prop) => prop !== "viewMode",
})(({ theme, viewMode }) => ({
  display: "flex",
  flexDirection: viewMode === "grid" ? "column" : "row",
  height: "100%",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
  overflow: "hidden",
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,

  "&:hover": {
    transform: viewMode === "grid" ? "translateY(-4px)" : "translateY(-2px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",

    "& .product-actions": {
      opacity: 1,
      transform: "translateY(0)",
    },

    "& .add-to-cart-btn": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

const MediaSection = styled(Box, {
  shouldForwardProp: (prop) => prop !== "viewMode",
})(({ theme, viewMode }) => ({
  position: "relative",
  overflow: "hidden",
  backgroundColor: theme.palette.grey[50],
  flexShrink: 0,

  ...(viewMode === "grid" && {
    width: "100%",
    aspectRatio: "1/1", // Luôn giữ tỷ lệ vuông
  }),

  ...(viewMode === "list" && {
    width: "240px",
    height: "240px",
    [theme.breakpoints.down("md")]: {
      width: "180px",
      height: "180px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      aspectRatio: "1/1",
    },
  }),
}));

const ProductImageWrapper = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const ProductImage = styled("img")({
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
  transition: "transform 0.3s ease",
});

const BadgeContainer = styled(Box)({
  position: "absolute",
  top: "12px",
  left: "12px",
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

const ProductBadge = styled(Chip)(({ theme }) => ({
  height: "24px",
  fontWeight: 600,
  fontSize: "0.75rem",
  borderRadius: "6px",
  padding: "0 8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  alignSelf: "flex-start",
}));

const NewBadge = styled(ProductBadge)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: theme.palette.success.contrastText,
}));

const ActionButtons = styled(Box, {
  shouldForwardProp: (prop) => prop !== "viewMode",
})(({ theme, viewMode }) => ({
  position: "absolute",
  top: "12px",
  right: "12px",
  display: "flex",
  flexDirection: viewMode === "grid" ? "column" : "row",
  gap: "8px",
  opacity: 0,
  transform: "translateY(10px)",
  transition: "all 0.3s ease",
  zIndex: 2,
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  width: "32px",
  height: "32px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",

  "&:hover": {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.main,
  },
}));

const ContentSection = styled(CardContent, {
  shouldForwardProp: (prop) => prop !== "viewMode",
})(({ theme, viewMode }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  padding: viewMode === "grid" ? "16px" : "20px",
  gap: "8px",

  [theme.breakpoints.down("sm")]: {
    padding: "16px",
  },
}));

const ProductTitle = styled(Typography)(({ theme, viewMode }) => ({
  fontWeight: 600,
  fontSize: viewMode === "grid" ? "0.95rem" : "1.05rem",
  lineHeight: 1.4,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  minHeight: viewMode === "grid" ? "44px" : "auto",
}));

const PriceWrapper = styled(Box)({
  display: "flex",
  alignItems: "flex-end",
  gap: "8px",
  margin: "4px 0",
});

const CurrentPrice = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.1rem",
  color: theme.palette.primary.main,
}));

const OldPrice = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "0.85rem",
  color: theme.palette.text.disabled,
  textDecoration: "line-through",
}));

const SavingsBadge = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  padding: "4px 8px",
  borderRadius: "4px",
  backgroundColor: alpha(theme.palette.success.main, 0.1),
  color: theme.palette.success.dark,
  fontSize: "0.75rem",
  fontWeight: 600,
}));

const AddToCartButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "viewMode",
})(({ theme, viewMode }) => ({
  borderRadius: "8px",
  padding: viewMode === "grid" ? "8px 16px" : "10px 16px",
  fontWeight: 600,
  fontSize: "0.875rem",
  textTransform: "none",
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  transition: "all 0.2s ease",
  marginTop: "auto",

  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

const StockStatus = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
}));

// ========== IMAGE COMPONENT ========== //

const ImageWithFallback = ({ src, alt, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
    setImgSrc("https://via.placeholder.com/300x300?text=No+Image");
    setLoading(false);
  };

  return (
    <ProductImageWrapper>
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "grey.100",
          }}
        >
          <CircularProgress size={24} />
        </Box>
      )}
      <ProductImage
        src={imgSrc}
        alt={alt}
        onLoad={() => setLoading(false)}
        onError={handleError}
        style={{
          opacity: loading ? 0 : 1,
          padding: error ? 0 : "12px",
          objectFit: error ? "cover" : "contain",
          backgroundColor: error ? "grey.300" : "transparent",
        }}
        {...props}
      />
    </ProductImageWrapper>
  );
};

// ========== MAIN COMPONENT ========== //

export const ProductCard = ({ product, viewMode = "grid" }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const isNew = product.createdAt
    ? new Date() - new Date(product.createdAt) < 7 * 24 * 60 * 60 * 1000
    : false;

  // Hàm lấy URL ảnh với fallback
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    if (product.image) {
      return product.image.url || product.image;
    }
    if (product.avatar?.url) {
      return product.avatar.url;
    }
    return "https://via.placeholder.com/300x300?text=No+Image";
  };

  return (
    <CardContainer viewMode={viewMode}>
      <MediaSection viewMode={viewMode}>
        <Link
          to={`/eco-market/product?productID=${product._id}`}
          style={{ display: "block", height: "100%" }}
        >
          {/* Product Badges */}
          <BadgeContainer>
            {isNew && (
              <NewBadge
                label="Mới"
                size="small"
                icon={<NewReleasesOutlinedIcon sx={{ fontSize: "0.875rem" }} />}
              />
            )}
          </BadgeContainer>

          <ImageWithFallback
            src={getProductImage()}
            alt={product.name}
            loading="lazy"
            crossOrigin="anonymous"
          />
        </Link>
      </MediaSection>

      <ContentSection viewMode={viewMode}>
        {/* Product Title */}
        <ProductTitle viewMode={viewMode} variant="subtitle1">
          <Link
            to={`/eco-market/product?productID=${product._id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              "&:hover": {
                color: theme.palette.primary.main,
              },
            }}
          >
            {product.name}
          </Link>
        </ProductTitle>

        {/* Product Rating */}
        <Box display="flex" alignItems="center">
          <Rating
            value={product.rating || 4.5}
            precision={0.5}
            readOnly
            size="small"
            sx={{
              color: theme.palette.warning.main,
              fontSize: "1rem",
              mr: 0.5,
            }}
          />
          <Typography variant="caption" color="text.secondary">
            ({product.reviews || 128})
          </Typography>
        </Box>

        {/* Product Price */}
        <PriceWrapper>
          <CurrentPrice>{formatPrice(product.price)}</CurrentPrice>
        </PriceWrapper>

        {/* Stock Status */}
        {product.stock > 0 && (
          <StockStatus>
            <CheckCircleOutlinedIcon
              sx={{
                fontSize: "0.875rem",
                color:
                  product.stock > 10
                    ? theme.palette.success.main
                    : theme.palette.warning.main,
              }}
            />
            {product.stock > 10
              ? "Còn hàng"
              : `Chỉ còn ${product.stock} sản phẩm`}
          </StockStatus>
        )}

        {/* Product Description (List view only) */}
        {viewMode === "list" && !isMobile && product.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              fontSize: "0.875rem",
              mt: 1,
            }}
          >
            {product.description}
          </Typography>
        )}

        {/* Add to Cart Button */}
        <AddToCartButton
          component={Link}
          to={`/eco-market/product?productID=${product._id}`}
          viewMode={viewMode}
          className="add-to-cart-btn"
          startIcon={<ShoppingCartOutlinedIcon sx={{ fontSize: "1rem" }} />}
          fullWidth
        >
          Thêm vào giỏ
        </AddToCartButton>
      </ContentSection>
    </CardContainer>
  );
};
