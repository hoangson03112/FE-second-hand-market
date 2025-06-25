import React, { useEffect, useState, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Breadcrumbs,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  Skeleton,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
  Button,
  Chip,
} from "@mui/material";
import {
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  LocationOn as LocationOnIcon,
  ShoppingCart as ShoppingCartIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

import FilterSidebar from "../../components/Product/FilterSidebar";
import SubCategoryContext from "../../contexts/SubCategoryContext";
import { useCategory } from "../../contexts/CategoryContext";
import { useProduct } from "../../contexts/ProductContext";
import { formatPrice } from "../../utils/function";
import { ProductCard } from "./components/ProductCard";

// Professional styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  transition: "box-shadow 0.2s ease-in-out",
  "&:hover": {
    boxShadow: theme.shadows[4],
  },
}));

const ProductImageContainer = styled(Box)({
  position: "relative",
  height: 200,
  overflow: "hidden",
  backgroundColor: "#fafafa",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const ProductImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const HeaderSection = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  marginBottom: theme.spacing(3),
}));

const FilterButton = styled(Button)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

function ProductList() {
  const { getCategory } = useCategory();
  const { getProductList } = useProduct();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState({});
  const [subCategory, setSubCategory] = useState({});
  const [sortOption, setSortOption] = useState("default");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const queryParams = new URLSearchParams(location.search);
  const categoryID = queryParams.get("categoryID");
  const subcategoryID = queryParams.get("subcategoryID");

  const sortProducts = useCallback((products, option) => {
    const sorted = [...products];
    switch (option) {
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      default:
        return sorted;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (categoryID) {
          try {
            const categoryData = await getCategory(categoryID);
            setCategory(categoryData);
          } catch (catError) {
            console.error("Error fetching category:", catError);
          }
        }

        if (subcategoryID) {
          try {
            const subCategoryData = await SubCategoryContext.getSubCategory(
              subcategoryID
            );
            setSubCategory(subCategoryData.subcategory);
          } catch (subCatError) {
            console.error("Error fetching subcategory:", subCatError);
          }
        }

        try {
          const productsData = await getProductList(categoryID, subcategoryID);
          if (Array.isArray(productsData)) {
            setProducts(sortProducts(productsData, sortOption));
          } else {
            console.error("Expected array of products but got:", productsData);
            setProducts([]);
          }
        } catch (productError) {
          console.error("Error fetching products:", productError);
          setError("Không thể tải danh sách sản phẩm");
        }
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    categoryID,
    subcategoryID,
    sortOption,
    getCategory,
    getProductList,
    sortProducts,
  ]);

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            border: `1px solid ${theme.palette.error.light}`,
            borderRadius: 1,
            backgroundColor: theme.palette.error.light,
          }}
        >
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ py: 2 }}>
        {/* Breadcrumb */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
          }}
        >
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Link
              to="/eco-market/home"
              style={{
                textDecoration: "none",
                color: theme.palette.text.secondary,
                display: "flex",
                alignItems: "center",
              }}
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
              <Typography variant="body2">Trang chủ</Typography>
            </Link>
            <Link
              to="/eco-market"
              style={{
                textDecoration: "none",
                color: theme.palette.primary.main,
              }}
            >
              <Typography variant="body2">Mua đồ cũ</Typography>
            </Link>
            {category?.name && (
              <Link
                to={`/eco-market?categoryID=${category._id}`}
                style={{
                  textDecoration: "none",
                  color: theme.palette.primary.main,
                }}
              >
                <Typography variant="body2">{category.name}</Typography>
              </Link>
            )}
            {subCategory?.name && (
              <Typography variant="body2" color="text.primary">
                {subCategory.name}
              </Typography>
            )}
          </Breadcrumbs>
        </Paper>

        <Grid container spacing={3}>
          {/* Sidebar - Desktop */}
          <Grid item lg={3} sx={{ display: { xs: "none", lg: "block" } }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <FilterSidebar category={category} />
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} lg={9}>
            {/* Header Section */}
            <HeaderSection>
              <Box sx={{ p: 3 }}>
                <Typography
                  variant="h4"
                  fontWeight={600}
                  color="text.primary"
                  gutterBottom
                >
                  {subcategoryID ? subCategory?.name : category?.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Khám phá những sản phẩm đồ cũ chất lượng cao với giá cả hợp lý
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Chip
                    label={`${products.length} sản phẩm`}
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    label="Đã kiểm tra"
                    variant="outlined"
                    size="small"
                    color="success"
                  />
                </Stack>
              </Box>
            </HeaderSection>

            {/* Controls */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={2}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  {isMobile && (
                    <FilterButton
                      variant="outlined"
                      startIcon={<FilterListIcon />}
                      onClick={toggleMobileFilters}
                    >
                      Bộ lọc
                    </FilterButton>
                  )}

                  <IconButton
                    onClick={() =>
                      setViewMode(viewMode === "grid" ? "list" : "grid")
                    }
                    size="small"
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                    }}
                  >
                    {viewMode === "grid" ? (
                      <ViewListIcon />
                    ) : (
                      <ViewModuleIcon />
                    )}
                  </IconButton>

                  <Typography variant="body2" color="text.secondary">
                    {products.length} sản phẩm
                  </Typography>
                </Stack>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>Sắp xếp theo</InputLabel>
                  <Select
                    value={sortOption}
                    onChange={handleSortChange}
                    label="Sắp xếp theo"
                  >
                    <MenuItem value="default">Mặc định</MenuItem>
                    <MenuItem value="price-desc">Giá: Cao đến thấp</MenuItem>
                    <MenuItem value="price-asc">Giá: Thấp đến cao</MenuItem>
                    <MenuItem value="newest">Mới nhất</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Paper>

            {/* Product Grid */}
            {loading ? (
              <Grid container spacing={2}>
                {[...Array(12)].map((_, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      <Skeleton
                        variant="rectangular"
                        height={200}
                        sx={{ bgcolor: "#f5f5f5" }}
                      />
                      <Box sx={{ p: 2 }}>
                        <Skeleton variant="text" height={24} />
                        <Skeleton variant="text" height={20} width="60%" />
                        <Skeleton variant="text" height={20} width="40%" />
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : products.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  textAlign: "center",
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Không tìm thấy sản phẩm nào
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={2}>
                {products.map((product) => (
                  <Grid
                    item
                    xs={12} // In list view, it takes full width, the card handles the rest
                    sm={viewMode === "grid" ? 6 : 12}
                    md={viewMode === "grid" ? 4 : 12}
                    lg={viewMode === "grid" ? 3 : 12}
                    key={product._id}
                  >
                    <ProductCard
                      product={product}
                      category={category}
                      viewMode={viewMode}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="left"
        open={showMobileFilters}
        onClose={toggleMobileFilters}
        sx={{
          "& .MuiDrawer-paper": {
            width: "80%",
            maxWidth: 320,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" fontWeight={600}>
              Bộ lọc sản phẩm
            </Typography>
            <IconButton onClick={toggleMobileFilters} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <FilterSidebar category={category} />
        </Box>
      </Drawer>
    </Box>
  );
}

export default ProductList;
