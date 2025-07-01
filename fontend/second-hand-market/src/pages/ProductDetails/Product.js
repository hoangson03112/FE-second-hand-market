import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import emitter from "../../utils/mitt";
import CategoryContext from "../../contexts/CategoryContext";
import AccountContext from "../../contexts/AccountContext";
import { useProduct } from "../../contexts/ProductContext";
import { useCart } from "../../contexts/CartContext";
import {
  Button,
  Card,
  Container,
  Table,
  Box,
  Grid,
  Typography,
  CardContent,
  CircularProgress,
  Breadcrumbs,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useChat } from "../../contexts/ChatContext";
import NotificationSnackbar from "./../../components/common/NotificationSnackbar";

export const Product = () => {
  const location = useLocation();
  const { findOrCreateWithProduct } = useChat();
  const queryParams = new URLSearchParams(location.search);
  const productID = queryParams.get("productID");
  const navigate = useNavigate();

  const { getProduct } = useProduct();
  const { addToCart } = useCart();
  const relatedProducts = [
    {
      id: 1,
      image:
        "https://static.oreka.vn/250-250_8efd61a6-25e2-490f-977f-63bec8c95ca2",
      title: "(Thanh lý chính hãng) Máy sưởi điện 3 bóng Halogen",
      price: "399,000đ",
      location: "Hà Nội",
    },
    {
      id: 2,
      image:
        "https://static.oreka.vn/250-250_8efd61a6-25e2-490f-977f-63bec8c95ca2",
      title: "(Thanh lý chính hãng) Kính UNIQLO chống tia UV nội địa Nhật",
      price: "119,000đ",
      location: "Hà Nội",
    },
    {
      id: 3,
      image:
        "https://static.oreka.vn/250-250_8efd61a6-25e2-490f-977f-63bec8c95ca2",
      title: "(Thanh lý chính hãng) Máy rửa mặt Foreo Luna Mini 2",
      price: "649,000đ",
      location: "Hà Nội",
    },
    {
      id: 4,
      image:
        "https://static.oreka.vn/250-250_8efd61a6-25e2-490f-977f-63bec8c95ca2",
      title: "(Thanh lý chính hãng) Vòng tay trang sức bạc s925",
      price: "286,000đ",
      location: "Hà Nội",
    },
  ];

  const [product, setProduct] = useState({});
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [account, setAccount] = useState({});
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [imageLoading, setImageLoading] = useState(true);

  const attributesOfProduct = useMemo(() => {
    const baseAttributes = [
      {
        label: "Danh mục",
        value: product?.category?.name || "Chưa xác định",
      },
      {
        label: "Danh mục con",
        value: product?.subcategory?.name || "Chưa xác định",
      },
    ];

    // Thêm các thuộc tính tùy chỉnh nếu có
    const customAttributes =
      product?.attributes?.map((att) => ({
        label: att.key,
        value: att.value,
      })) || [];

    return [...baseAttributes, ...customAttributes];
  }, [
    product?.category?.name,
    product?.subcategory?.name,
    product?.attributes,
  ]);
  const fetchAccount = useCallback(async (accountId) => {
    try {
      const response = await AccountContext.getAccount(accountId);

      setAccount(response);
    } catch (error) {
      console.error("Error fetching account:", error);
      setError("Error fetching account");
    }
  }, []);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProduct(productID);
        fetchAccount(productData.seller._id);
        setProduct(productData);
        setMainImage(productData.avatar);
        // Loại bỏ logic push vào attributesOfProduct vì đã được xử lý trong useMemo
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Không thể tải thông tin sản phẩm");
      }
    };
    fetchProduct();
  }, [productID, getProduct]); // Thêm getProduct vào dependency array

  const handleThumbnailClick = (image) => {
    setImageLoading(true);
    setMainImage(image);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = useCallback(async () => {
    try {
      const data = await AccountContext.Authentication();
      if (data.data.account) {
        const messageAddToCart = await addToCart(
          product._id,
          quantity,
          account._id
        );
        if (messageAddToCart.status === "success") {
          emitter.emit("CART_UPDATED");
          setShowToast(true);
        } else {
          setError("Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
        }
      } else {
        navigate("/eco-market/login");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setError("Có lỗi xảy ra khi thêm vào giỏ hàng.");
    }
  }, [product._id, quantity, account._id, addToCart, navigate]);

  const handlePurchaseNow = async () => {
    try {
      const data = await AccountContext.Authentication();
      if (data.data.account) {
        navigate("/eco-market/checkout", {
          state: {
            selectedItems: [{ ...product, productId: product._id, quantity }],
          },
        });
      } else {
        navigate("/eco-market/login");
      }
    } catch (error) {
      console.error("Error fetching", error);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleOpenChat = useCallback(async () => {
    try {
      const authData = await AccountContext.Authentication();
      if (!authData || !authData.data || !authData.data.account) {
        navigate("/eco-market/login");
        return;
      }

      const response = await findOrCreateWithProduct(productID, account._id);

      if (!response || !response.success) {
        console.error("Failed to create chat conversation:", response);
        alert("Không thể kết nối với người bán. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error creating chat conversation:", error);
      alert("Có lỗi xảy ra khi kết nối với người bán. Vui lòng thử lại sau.");
    }
  }, [productID, account._id, findOrCreateWithProduct, navigate]);

  // Component con để render từng hàng attribute - tránh re-render không cần thiết
  const AttributeRow = React.memo(({ attribute, isLast }) => (
    <tr
      style={{
        borderBottom: !isLast ? "1px solid #e0e0e0" : "none",
        transition: "background 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f7fa")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "")}
    >
      <td
        style={{
          width: "30%",
          padding: "12px 16px",
          fontWeight: 700,
          color: "#555",
        }}
      >
        {attribute.label}
      </td>
      <td
        style={{
          padding: "12px 16px",
          color: "#333",
        }}
      >
        {attribute.value || "Không có thông tin"}
      </td>
    </tr>
  ));

  return (
    <Box className="product-page py-4">
      <Container maxWidth="xl" disableGutters>
        {/* Breadcrumb */}
        <Box mb={3}>
          <Box sx={{ bgcolor: "grey.100", p: 2, borderRadius: 2 }}>
            <Breadcrumbs aria-label="breadcrumb">
              <Typography
                component="a"
                href="/eco-market/home"
                color="primary"
                sx={{ textDecoration: "none", fontWeight: 500 }}
              >
                Trang chủ
              </Typography>
              <Typography
                component="a"
                href="/eco-market/home"
                color="primary"
                sx={{ textDecoration: "none", fontWeight: 500 }}
              >
                Đồ cũ
              </Typography>
              {category?._id && (
                <Typography
                  component="a"
                  href={`/eco-market/category/${category?._id}`}
                  color="primary"
                  sx={{ textDecoration: "none", fontWeight: 500 }}
                >
                  {category?.name}
                </Typography>
              )}
              <Typography color="text.primary" fontWeight={600}>
                {product?.name}
              </Typography>
            </Breadcrumbs>
          </Box>
        </Box>

        {/* Product Main Section */}
        <Grid container spacing={4} mb={4}>
          <Grid item lg={8} xs={12}>
            <Card
              elevation={0}
              sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "none" }}
            >
              <CardContent sx={{ p: 0 }}>
                <Grid container>
                  {/* Gallery */}
                  <Grid item md={6} xs={12} sx={{ p: 4 }}>
                    <Box
                      sx={{
                        mb: 3,
                        position: "relative",
                        borderRadius: 2,
                        overflow: "hidden",
                        bgcolor: "grey.100",
                        height: 400,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {imageLoading && (
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
                            bgcolor: "rgba(255,255,255,0.7)",
                            zIndex: 2,
                          }}
                        >
                          <CircularProgress color="primary" />
                        </Box>
                      )}
                      <Box
                        component="img"
                        src={mainImage?.url}
                        alt={product?.name}
                        sx={{
                          objectFit: "contain",
                          width: "100%",
                          height: 400,
                          borderRadius: 2,
                          transition: "0.3s",
                        }}
                        onLoad={handleImageLoad}
                      />
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                    >
                      {product?.images?.map((image, idx) => (
                        <Box
                          key={idx}
                          onClick={() => handleThumbnailClick(image)}
                          sx={{
                            border: mainImage === image ? 2 : 1,
                            borderColor:
                              mainImage === image ? "primary.main" : "grey.300",
                            borderRadius: 1,
                            p: 0.5,
                            cursor: "pointer",
                            bgcolor: "white",
                            transition: "0.2s",
                          }}
                        >
                          <Box
                            component="img"
                            src={image.url || "/api/placeholder/50/70"}
                            alt={`Thumbnail ${idx + 1}`}
                            sx={{
                              width: 56,
                              height: 56,
                              objectFit: "cover",
                              borderRadius: 1,
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                  {/* Product Info */}
                  <Grid
                    item
                    md={6}
                    xs={12}
                    sx={{
                      p: 4,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="h4" fontWeight={700} mb={2}>
                      {product?.name}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                      }}
                    >
                      <Typography variant="h5" color="error" fontWeight={700}>
                        {product?.price?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Đăng ngày{" "}
                        {product?.createdAt
                          ? new Date(product?.createdAt).toLocaleDateString(
                              "vi-VN"
                            )
                          : ""}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ bgcolor: "grey.100", borderRadius: 2, p: 2, mb: 3 }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Box sx={{ color: "error.main", mr: 1 }}>
                          <i className="bi bi-geo-alt" />
                        </Box>
                        <Typography>{product?.seller?.province}</Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Box sx={{ color: "success.main", mr: 1 }}>
                          <i className="bi bi-truck" />
                        </Box>
                        <Typography>Miễn phí vận chuyển</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ color: "primary.main", mr: 1 }}>
                          <i className="bi bi-box-seam" />
                        </Box>
                        <Typography>
                          Còn <b>{product.stock}</b> sản phẩm có sẵn
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: "center",
                        gap: 2,
                        mt: 2,
                        width: "100%",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{ mr: 2, minWidth: 80 }}
                      >
                        Số lượng:
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          px: 1.5,
                          py: 0.5,
                          mb: { xs: 2, sm: 0 },
                        }}
                      >
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleQuantityChange(quantity - 1)}
                          sx={{
                            minWidth: 40,
                            minHeight: 40,
                            borderRadius: "50%",
                            p: 0,
                            mr: 1,
                            borderWidth: 2,
                            boxShadow: 1,
                            bgcolor: "white",
                            "&:hover": {
                              bgcolor: "grey.100",
                              borderColor: "primary.main",
                              boxShadow: 2,
                            },
                          }}
                        >
                          <RemoveIcon fontSize="medium" />
                        </Button>
                        <Box
                          component="input"
                          type="number"
                          value={quantity}
                          min={1}
                          max={product.stock}
                          onChange={(e) => {
                            let val = parseInt(e.target.value);
                            if (isNaN(val)) val = 1;
                            if (val < 1) val = 1;
                            if (val > product.stock) val = product.stock;
                            handleQuantityChange(val);
                          }}
                          sx={{
                            width: 56,

                            mx: 1,
                            textAlign: "center",
                            border: "none",
                            bgcolor: "grey.50",
                            borderRadius: 2,
                            fontSize: 18,
                            fontWeight: 700,
                            py: 1,
                            boxShadow: 1,
                            outline: "none",

                            MozAppearance: "textfield",
                            "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                              {
                                WebkitAppearance: "none",
                                margin: 0,
                              },
                          }}
                        />
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleQuantityChange(quantity + 1)}
                          sx={{
                            minWidth: 40,
                            minHeight: 40,
                            borderRadius: "50%",
                            p: 0,
                            ml: 1,
                            borderWidth: 2,
                            boxShadow: 1,
                            bgcolor: "white",
                            "&:hover": {
                              bgcolor: "grey.100",
                              borderColor: "primary.main",
                              boxShadow: 2,
                            },
                          }}
                        >
                          <AddIcon fontSize="medium" />
                        </Button>
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 1.5,
                        mt: 2.5,
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={handleAddToCart}
                        sx={{
                          flex: 1,
                          fontWeight: 500,
                          fontSize: 14,
                          borderRadius: 1.5,
                          py: 1.5,
                          textTransform: "none",
                          minHeight: 48,
                          bgcolor: "white",
                          borderColor: "#e0e0e0",
                          color: "#424242",
                          "&:hover": {
                            bgcolor: "#f5f5f5",
                            borderColor: "#bdbdbd",
                          },
                        }}
                        startIcon={
                          <i
                            className="bi bi-cart-plus"
                            style={{ fontSize: 16 }}
                          />
                        }
                      >
                        Thêm vào giỏ hàng
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handlePurchaseNow}
                        sx={{
                          flex: 1,
                          fontWeight: 500,
                          fontSize: 14,
                          borderRadius: 1.5,
                          py: 1.5,
                          textTransform: "none",
                          minHeight: 48,
                          bgcolor: "#1976d2",
                          "&:hover": {
                            bgcolor: "#1565c0",
                          },
                        }}
                        startIcon={
                          <i
                            className="bi bi-lightning-charge"
                            style={{ fontSize: 16 }}
                          />
                        }
                      >
                        Mua ngay
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Seller Info Card */}
          <Grid item lg={4} xs={12}>
            <Card
              elevation={0}
              sx={{ borderRadius: 4, mb: 4, boxShadow: "none" }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  mb={3}
                  pb={2}
                  sx={{
                    borderBottom: 1,
                    borderColor: "grey.200",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <i className="bi bi-shop" style={{ marginRight: 8 }} />
                  Thông tin người bán
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  {product?.seller ? (
                    <Box
                      component="img"
                      src={product?.seller?.avatar.url}
                      alt="Shop Logo"
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        border: 2,
                        borderColor: "primary.main",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 32,
                        fontWeight: 700,
                      }}
                    >
                      {product?.seller?.fullName?.charAt(0)}
                    </Box>
                  )}
                  <Box sx={{ ml: 3 }}>
                    <Typography variant="h6" mb={0.5}>
                      {product?.seller?.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      <i className="bi bi-geo-alt" style={{ marginRight: 4 }} />
                      {product?.seller?.province}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "warning.main",
                        fontSize: 18,
                      }}
                    >
                      <i className="bi bi-star-fill" />
                      <i className="bi bi-star-fill" />
                      <i className="bi bi-star-fill" />
                      <i className="bi bi-star-fill" />
                      <i className="bi bi-star-half" />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        (4.5)
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    py: 2,
                    mb: 3,
                    bgcolor: "grey.100",
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h6" fontWeight={700}>
                      96%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Phản hồi
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      textAlign: "center",
                      borderLeft: 1,
                      borderRight: 1,
                      borderColor: "grey.300",
                      px: 3,
                    }}
                  >
                    <Typography variant="h6" fontWeight={700}>
                      98%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Đánh giá tốt
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h6" fontWeight={700}>
                      2 năm
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tham gia
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    sx={{ flex: 1, fontWeight: 600 }}
                  >
                    <i
                      className="bi bi-person-lines-fill"
                      s
                      style={{ marginRight: 8 }}
                    />
                    Xem hồ sơ
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    sx={{ flex: 1, fontWeight: 600 }}
                    onClick={handleOpenChat}
                  >
                    <i className="bi bi-chat-dots" style={{ marginRight: 8 }} />
                    Chat với người bán
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Product Details Tabs */}
        <Card elevation={0} sx={{ borderRadius: 4, mb: 4, boxShadow: "none" }}>
          <CardContent sx={{ padding: 4 }}>
            <Box mb={3} sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant={activeTab === "description" ? "contained" : "outlined"}
                onClick={() => setActiveTab("description")}
                sx={{ mr: 1, fontWeight: 600 }}
                color="primary"
              >
                <i className="bi bi-file-text" style={{ marginRight: 8 }} />
                Mô tả sản phẩm
              </Button>
              <Button
                variant={activeTab === "specs" ? "contained" : "outlined"}
                onClick={() => setActiveTab("specs")}
                sx={{ mr: 1, fontWeight: 600 }}
                color="primary"
              >
                <i className="bi bi-list-ul" style={{ marginRight: 8 }} />
                Thông số kỹ thuật
              </Button>
              <Button
                variant={activeTab === "reviews" ? "contained" : "outlined"}
                onClick={() => setActiveTab("reviews")}
                sx={{ mr: 1, fontWeight: 600 }}
                color="primary"
              >
                <i className="bi bi-star" style={{ marginRight: 8 }} />
                Đánh giá (0)
              </Button>
              <Button
                variant={activeTab === "questions" ? "contained" : "outlined"}
                onClick={() => setActiveTab("questions")}
                sx={{ fontWeight: 600 }}
                color="primary"
              >
                <i
                  className="bi bi-question-circle"
                  style={{ marginRight: 8 }}
                />
                Hỏi đáp
              </Button>
            </Box>
            {/* Tab Content */}
            <Box sx={{ p: 3 }}>
              {activeTab === "description" && (
                <Box>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: 18, color: "text.primary" }}
                  >
                    {product.description ||
                      "Chưa có mô tả chi tiết cho sản phẩm này."}
                  </Typography>
                </Box>
              )}
              {activeTab === "specs" && (
                <Box>
                  <Table
                    sx={{ width: "100%" }}
                    aria-label="product specifications"
                  >
                    <tbody>
                      {attributesOfProduct.map((attribute, idx) => (
                        <AttributeRow
                          key={`${attribute.label}-${idx}`}
                          attribute={attribute}
                          isLast={idx === attributesOfProduct.length - 1}
                        />
                      ))}
                    </tbody>
                  </Table>
                </Box>
              )}
              {activeTab === "reviews" && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <i
                    className="bi bi-star"
                    style={{ fontSize: 40, color: "#ccc" }}
                  />
                  <Typography variant="body1" mt={3} mb={2}>
                    Chưa có đánh giá nào cho sản phẩm này.
                  </Typography>
                </Box>
              )}
              {activeTab === "questions" && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <i
                    className="bi bi-chat-dots"
                    style={{ fontSize: 40, color: "#ccc" }}
                  />
                  <Typography variant="body1" mt={3} mb={2}>
                    Hiện tại chưa có câu hỏi nào. Cần thêm thông tin hãy gửi câu
                    hỏi cho người bán.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  >
                    <i
                      className="bi bi-plus-circle"
                      style={{ marginRight: 8 }}
                    />
                    Hỏi ngay
                  </Button>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Related Products */}
        <Card elevation={0} sx={{ borderRadius: 4, mb: 4, boxShadow: "none" }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                variant="h5"
                mb={0}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <i className="bi bi-box2" style={{ marginRight: 8 }} />
                Sản phẩm tương tự
              </Typography>
              <Button variant="text" sx={{ p: 0, fontWeight: 600 }}>
                Xem tất cả
              </Button>
            </Box>
            <Grid container spacing={3}>
              {relatedProducts.map((product) => (
                <Grid key={product.id} item md={3} sm={6} xs={12}>
                  <Card
                    elevation={0}
                    style={{
                      boxShadow: "none",
                      transform: "none",
                      transition: "none",
                    }}
                    sx={{
                      height: "100%",
                      borderRadius: 2,
                      boxShadow: "none !important",
                      border: "1px solid #e0e0e0",
                      transition: "none !important",
                      transform: "none !important",
                      // ✅ Force override tất cả hover states
                      "&:hover, &:focus, &:active": {
                        boxShadow: "none !important",
                        transform: "none !important",
                        borderColor: "#e0e0e0 !important",
                        transition: "none !important",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 180,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "grey.100",
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                      }}
                    >
                      <Box
                        component="img"
                        src={product.image}
                        alt={product.title}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                        }}
                      />
                    </Box>
                    <CardContent sx={{ p: 2 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          fontSize: 16,
                          mb: 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={product.title}
                      >
                        {product.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="error"
                        fontWeight={700}
                        mb={0.5}
                      >
                        {product.price}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: 14,
                        }}
                      >
                        <i
                          className="bi bi-geo-alt"
                          style={{ marginRight: 4 }}
                        />
                        {product.location}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Recently Viewed */}
        <Card elevation={0} sx={{ borderRadius: 4, boxShadow: "none" }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                variant="h5"
                mb={0}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <i className="bi bi-clock-history" style={{ marginRight: 8 }} />
                Đã xem gần đây
              </Typography>
              <Button variant="text" sx={{ p: 0, fontWeight: 600 }}>
                Xem tất cả
              </Button>
            </Box>
            <Grid container spacing={3}>
              {relatedProducts.slice(0, 4).map((product) => (
                <Grid key={product.id} item md={3} sm={6} xs={12}>
                  <Card
                    elevation={0}
                    style={{
                      boxShadow: "none",
                      transform: "none",
                      transition: "none",
                    }}
                    sx={{
                      height: "100%",
                      borderRadius: 2,
                      boxShadow: "none !important",
                      border: "1px solid #e0e0e0",
                      transition: "none !important",
                      transform: "none !important",
                      // ✅ Force override tất cả hover states
                      "&:hover, &:focus, &:active": {
                        boxShadow: "none !important",
                        transform: "none !important",
                        borderColor: "#e0e0e0 !important",
                        transition: "none !important",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 180,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "grey.100",
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                      }}
                    >
                      <Box
                        component="img"
                        src={product.image}
                        alt={product.title}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                        }}
                      />
                    </Box>
                    <CardContent sx={{ p: 2 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          fontSize: 16,
                          mb: 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={product.title}
                      >
                        {product.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="error"
                        fontWeight={700}
                        mb={0.5}
                      >
                        {product.price}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: 14,
                        }}
                      >
                        <i
                          className="bi bi-geo-alt"
                          style={{ marginRight: 4 }}
                        />
                        {product.location}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Container>

      <NotificationSnackbar
        showToast={showToast}
        setShowToast={setShowToast}
        message="Thêm sản phẩm vào giỏ hàng thành công!"
      />
    </Box>
  );
};

export default Product;
