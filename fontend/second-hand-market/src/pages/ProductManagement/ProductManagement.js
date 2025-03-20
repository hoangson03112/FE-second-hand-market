import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  Pagination,
  Badge,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Search,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  ShoppingCart,
} from "@mui/icons-material";
import ProductContext from "../../contexts/ProductContext";
import SubCategoryContext from "../../contexts/SubCategoryContext";
import CategoryContext from "../../contexts/CategoryContext";

const ProductManagement = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState(["Tất cả"]);
  // Dữ liệu mẫu
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Laptop Dell Latitude E7450",
      price: 7500000,
      category: "Điện tử",
      status: "pending",
      image: "https://picsum.photos/200/150?random=1",
      description: "Core i5 6300U, RAM 8GB, SSD 256GB",
    },
    {
      id: 2,
      name: "iPhone 12 Pro Max 128GB",
      price: 15500000,
      category: "Điện tử",
      status: "approved",
      image: "https://picsum.photos/200/150?random=2",
      description: "Máy nguyên bản, còn bảo hành",
    },
    {
      id: 3,
      name: "Bàn làm việc gỗ sồi",
      price: 1200000,
      category: "Nội thất",
      status: "rejected",
      image: "https://picsum.photos/200/150?random=3",
      description: "Kích thước 120x60cm",
    },
  ]);

  // Danh sách danh mục để lọc

  // Lọc sản phẩm theo tab, tìm kiếm, danh mục và giá
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab =
      currentTab === 0 ||
      (currentTab === 1 && product.status === "pending") ||
      (currentTab === 2 && product.status === "approved") ||
      (currentTab === 3 && product.status === "rejected");
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "low" && product.price < 5000000) ||
      (priceFilter === "medium" &&
        product.price >= 5000000 &&
        product.price <= 10000000) ||
      (priceFilter === "high" && product.price > 10000000);
    return matchesSearch && matchesTab && matchesCategory && matchesPrice;
  });
  const fetchProducts = useCallback(async () => {
    try {
      const productsData = await ProductContext.getProducts();
      console.log(productsData);
      setProducts(productsData);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoriesData = await CategoryContext.getCategories();
        console.log(categoriesData);

        setCategories(categoriesData);
      } catch (err) {}
    };

    fetchCategory();

    fetchProducts();
  }, []);

  // Phân trang
  const productsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Xử lý duyệt và hủy
  const handleApproveProduct = async (slug) => {
    await ProductContext.updateProductStatus(slug, "approved");
    fetchProducts();
  };

  const handleRejectProduct = async (slug) => {
    await ProductContext.updateProductStatus(slug, "rejected");
    fetchProducts();
  };

  // Xem chi tiết sản phẩm
  const handleViewDetail = (product) => {
    setSelectedProduct(product);
    setOpenDetail(true);
  };

  // Đóng dialog chi tiết
  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedProduct(null);
  };

  // Thống kê
  const stats = [
    {
      label: "Tổng sản phẩm",
      value: products.length,
      icon: ShoppingCart,
      color: "primary",
    },
    {
      label: "Chờ duyệt",
      value: products.filter((p) => p.status === "pending").length,
      icon: HourglassEmpty,
      color: "warning",
    },
    {
      label: "Đã duyệt",
      value: products.filter((p) => p.status === "approved").length,
      icon: CheckCircle,
      color: "success",
    },
    {
      label: "Đã hủy",
      value: products.filter((p) => p.status === "rejected").length,
      icon: Cancel,
      color: "error",
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
        Quản lý sản phẩm
      </Typography>

      {/* Thanh tìm kiếm, bộ lọc và tabs */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{ startAdornment: <Search /> }}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Danh mục</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Danh mục"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Giá</InputLabel>
              <Select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                label="Giá"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="low">Dưới 5 triệu</MenuItem>
                <MenuItem value="medium">5 - 10 triệu</MenuItem>
                <MenuItem value="high">Trên 10 triệu</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          sx={{ mt: 2 }}
        >
          <Tab label="Tất cả" icon={<ShoppingCart />} />
          <Tab label="Chờ duyệt" icon={<HourglassEmpty />} />
          <Tab label="Đã duyệt" icon={<CheckCircle />} />
          <Tab label="Đã hủy" icon={<Cancel />} />
        </Tabs>
      </Box>

      {/* Thống kê */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Card sx={{ p: 2, textAlign: "center" }}>
              <stat.icon color={stat.color} />
              <Typography variant="h6">{stat.value}</Typography>
              <Typography>{stat.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Danh sách sản phẩm */}
      <Grid container spacing={3}>
        {displayedProducts.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product.id}>
            <Card sx={{ height: "100%", position: "relative" }}>
              <CardMedia
                component="img"
                height="150"
                image={product.avatar}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6" noWrap>
                  {product.name}
                </Typography>
                <Typography color="primary" fontWeight="bold">
                  {new Intl.NumberFormat("vi-VN").format(product.price)}₫
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
              </CardContent>
              <Stack
                direction="row"
                spacing={1}
                sx={{ height: 40, justifyContent: "center", my: 1 }}
              >
                {product.status === "pending" ? (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={() => handleApproveProduct(product.slug)}
                    >
                      Duyệt
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Cancel />}
                      onClick={() => handleRejectProduct(product.slug)}
                    >
                      Hủy
                    </Button>
                  </>
                ) : (
                  <Typography
                    sx={{ width: "60%", textAlign: "center" }}
                    color={
                      product.status === "approved"
                        ? "success.main"
                        : "error.main"
                    }
                  >
                    {product.status === "approved" ? "Đã duyệt" : "Đã hủy"}
                  </Typography>
                )}
                <Button
                  variant="outlined"
                  onClick={() => handleViewDetail(product)}
                  sx={{ marginRight: 5 }}
                >
                  Xem
                </Button>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Phân trang */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
          />
        </Box>
      )}

      {/* Dialog chi tiết sản phẩm */}
      {selectedProduct && (
        <Dialog
          open={openDetail}
          onClose={handleCloseDetail}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>Chi tiết sản phẩm</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <img
                  src={selectedProduct.avatar}
                  alt={selectedProduct.name}
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5">{selectedProduct.name}</Typography>
                <Typography variant="h6" color="red">
                  {new Intl.NumberFormat("vi-VN").format(selectedProduct.price)}
                  ₫
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <strong>Danh mục:</strong>{" "}
                  {
                    categories.find(
                      (cate) => cate._id === selectedProduct.categoryId
                    ).name
                  }
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <strong>Danh mục con:</strong>{" "}
                  {categories
                    .flatMap((cate) => cate.subcategories)
                    .find(
                      (subCate) => subCate._id === selectedProduct.subcategoryId
                    )?.name || "Không tìm thấy subcategory"}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <strong>Vị trí:</strong> {selectedProduct.location}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <strong>Ngày đăng:</strong> {selectedProduct.createdAt}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <strong>Mô tả:</strong> {selectedProduct.description}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <strong>Trạng thái:</strong>{" "}
                  {selectedProduct.status === "pending"
                    ? "Chờ duyệt"
                    : selectedProduct.status === "approved"
                    ? "Đã duyệt"
                    : "Đã hủy"}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      )}
    </Container>
  );
};

export default ProductManagement;
