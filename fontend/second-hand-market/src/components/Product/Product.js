import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import emitter from "../../utils/mitt";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  Table,
  Toast,
  Nav,
} from "react-bootstrap";
import "./Product.css";
import CategoryContext from "../../contexts/CategoryContext";
import AccountContext from "../../contexts/AccountContext";
import { useProduct } from "../../contexts/ProductContext";
import { useCart } from "../../contexts/CartContext";
export const Product = () => {
  const location = useLocation();
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

  useEffect(() => {
    const fetchAccount = async (accountId) => {
      try {
        const response = await AccountContext.getAccount(accountId);

        setAccount(response);
      } catch (error) {
        console.error("Error fetching account:", error);
        setError("Error fetching account");
      }
    };

    const fetchProduct = async () => {
      try {
        const product = await getProduct(productID);
        fetchAccount(product.sellerId);
        setProduct(product);
        setMainImage(product.images?.[0]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [productID]);

  useEffect(() => {
    const fetchCategory = async () => {
      if (product.categoryId) {
        try {
          const category = await CategoryContext.getCategory(
            product.categoryId
          );
          setCategory(category);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchCategory();
  }, [product.categoryId]);

  const handleThumbnailClick = (image) => {
    setImageLoading(true);
    setMainImage(image);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
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
        }
      } else {
        navigate("/eco-market/login");
      }
    } catch (error) {
      console.error("Error fetching", error);
    }
  };

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

  // Render a product card with consistent styling
  const renderProductCard = (item) => (
    <Card className="h-100 product-card shadow-sm hover-scale">
      <div className="image-container">
        <Card.Img
          variant="top"
          src={item.image}
          alt={item.title}
          className="product-image"
        />
        <div className="overlay">
          <Button variant="light" className="quick-view-btn">
            <i className="bi bi-eye"></i> Xem nhanh
          </Button>
        </div>
      </div>
      <Card.Body>
        <Badge bg="success" className="mb-2 rounded-pill">
          Freeship
        </Badge>
        <Card.Title className="product-title">{item.title}</Card.Title>
        <Card.Text className="price">{item.price}</Card.Text>
        <Card.Text className="location">
          <i className="bi bi-geo-alt text-muted"></i> {item.location}
        </Card.Text>
      </Card.Body>
    </Card>
  );

  return (
    <div className="product-page py-4">
      <Container>
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb bg-light p-2 rounded">
            <li className="breadcrumb-item">
              <a href="/eco-market">Trang chủ</a>
            </li>
            <li className="breadcrumb-item">
              <a href="/eco-market/category">Đồ cũ</a>
            </li>
            <li className="breadcrumb-item">
              <a href={`/eco-market/category/${category?._id}`}>
                {category?.name}
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product?.name}
            </li>
          </ol>
        </nav>

        {/* Product Main Section */}
        <Row className="mb-4">
          <Col lg={8}>
            <Card className="border-0 shadow product-main-card rounded-4 overflow-hidden">
              {/* Product Gallery */}
              <Card.Body className="p-0">
                <Row className="g-0">
                  <Col md={6} className="product-gallery p-4">
                    <div className="main-image-container mb-3 position-relative">
                      {imageLoading && (
                        <div className="image-loader">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      )}
                      <img
                        src={mainImage}
                        className="img-fluid rounded main-product-image"
                        alt={product?.name}
                        style={{
                          objectFit: "contain",
                          height: "400px",
                          width: "100%",
                        }}
                        onLoad={handleImageLoad}
                      />
                      <div className="image-zoom-icon">
                        <i className="bi bi-zoom-in"></i>
                      </div>
                    </div>
                    <div className="thumbnails-container d-flex justify-content-center">
                      {product?.images?.map((image, index) => (
                        <div
                          key={index}
                          className={`thumbnail-wrapper mx-1 ${
                            mainImage === image ? "active-thumbnail" : ""
                          }`}
                          onClick={() => handleThumbnailClick(image)}
                        >
                          <img
                            src={image || "/api/placeholder/50/70"}
                            alt={`Thumbnail ${index + 1}`}
                            className="thumbnail-image"
                          />
                        </div>
                      ))}
                    </div>
                  </Col>

                  {/* Product Info */}
                  <Col md={6} className="product-info p-4">
                    <div className="mb-2">
                      <Badge bg="secondary" className="me-2 rounded-pill">
                        Mới
                      </Badge>
                      <Badge bg="info" className="rounded-pill">
                        Freeship
                      </Badge>
                    </div>
                    <h3 className="product-title mb-2">{product?.name}</h3>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h2 className="product-price text-danger mb-0 fw-bold">
                        {product?.price?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </h2>
                      <span className="text-muted small">
                        Đăng ngày{" "}
                        {new Date(product?.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>

                    <hr className="my-3" />

                    <div className="product-highlights p-3 mb-3 bg-light rounded">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-geo-alt text-danger me-2"></i>
                        <span>{product.location}</span>
                      </div>

                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-truck text-success me-2"></i>
                        <span>Miễn phí vận chuyển</span>
                      </div>

                      <div className="d-flex align-items-center">
                        <i className="bi bi-box-seam text-primary me-2"></i>
                        <span>
                          Còn <strong>{product.stock}</strong> sản phẩm có sẵn
                        </span>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <Form.Group className="my-4">
                      <Form.Label className="fw-bold">Số lượng:</Form.Label>
                      <div className="ms-3 mt-3 quantity-selector d-flex align-items-center">
                        <Button
                          variant="outline-secondary"
                          className="quantity-btn rounded-circle d-flex justify-content-center align-items-center"
                          onClick={() => handleQuantityChange(quantity - 1)}
                          style={{ width: "40px", height: "40px" }} // Đảm bảo kích thước cố định
                        >
                          <i
                            className="bi bi-dash"
                            style={{ fontSize: "1.2rem" }}
                          ></i>
                        </Button>
                        <Form.Control
                          type="text"
                          value={quantity}
                          onChange={(e) =>
                            handleQuantityChange(parseInt(e.target.value))
                          }
                          className="quantity-input text-center mx-2 border-0 bg-light"
                          style={{ width: "60px" }} // Điều chỉnh chiều rộng input nếu cần
                        />
                        <Button
                          variant="outline-secondary"
                          className="quantity-btn rounded-circle d-flex justify-content-center align-items-center"
                          onClick={() => handleQuantityChange(quantity + 1)}
                          style={{ width: "40px", height: "40px" }} // Đảm bảo kích thước cố định
                        >
                          <i
                            className="bi bi-plus"
                            style={{ fontSize: "1.2rem" }}
                          ></i>
                        </Button>
                      </div>
                    </Form.Group>

                    {/* Action Buttons */}
                    <div className="d-grid gap-2">
                      <Button
                        variant="outline-primary"
                        className="btn-action btn-press-effect"
                        onClick={handleAddToCart}
                      >
                        <i className="bi bi-cart-plus me-2"></i>Thêm vào giỏ
                        hàng
                      </Button>
                      <Button
                        variant="primary"
                        className="btn-action gradient-custom-2 btn-press-effect"
                        onClick={handlePurchaseNow}
                      >
                        <i className="bi bi-lightning-charge me-2"></i>Mua ngay
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* Seller Info Card */}
          <Col lg={4}>
            <Card className="border-0 shadow rounded-4 mb-4 seller-card">
              <Card.Body>
                <h5 className="mb-3 border-bottom pb-2">
                  <i className="bi bi-shop me-2"></i>Thông tin người bán
                </h5>
                <div className="d-flex align-items-center mb-3">
                  {account?.avatar ? (
                    <img
                      src={account?.avatar}
                      alt="Shop Logo"
                      className="seller-avatar rounded-circle border"
                    />
                  ) : (
                    <div className="seller-avatar-placeholder rounded-circle d-flex align-items-center justify-content-center bg-primary text-white">
                      {account?.username?.charAt(0)}
                    </div>
                  )}
                  <div className="ms-3">
                    <h6 className="mb-1">{account?.fullName}</h6>
                    <p className="mb-1 text-muted small">
                      <i className="bi bi-geo-alt me-1"></i>
                      {product.location}
                    </p>
                    <div className="seller-rating text-warning">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-half"></i>
                      <span className="ms-1 text-muted small">(4.5)</span>
                    </div>
                  </div>
                </div>
                <div className="seller-stats d-flex justify-content-around py-2 mb-3 bg-light rounded">
                  <div className="text-center">
                    <div className="fw-bold">96%</div>
                    <div className="text-muted small">Phản hồi</div>
                  </div>
                  <div className="text-center border-start border-end px-3">
                    <div className="fw-bold">98%</div>
                    <div className="text-muted small">Đánh giá tốt</div>
                  </div>
                  <div className="text-center">
                    <div className="fw-bold">2 năm</div>
                    <div className="text-muted small">Tham gia</div>
                  </div>
                </div>
                <div className="d-grid gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="d-flex align-items-center justify-content-center btn-press-effect"
                  >
                    <i className="bi bi-person-lines-fill me-2"></i>Xem hồ sơ
                  </Button>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="d-flex align-items-center justify-content-center btn-press-effect"
                  >
                    <i className="bi bi-chat-dots me-2"></i>Chat với người bán
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Recommend Products */}
            <Card className="border-0 shadow rounded-4">
              <Card.Body>
                <h5 className="mb-3 d-flex justify-content-between align-items-center">
                  <span>
                    <i className="bi bi-lightning me-2"></i>Có thể bạn thích
                  </span>
                  <Button variant="link" className="p-0 small">
                    Xem tất cả
                  </Button>
                </h5>
                <div className="recommended-products">
                  {relatedProducts.slice(0, 2).map((product) => (
                    <div key={product.id} className="mb-3 hover-scale">
                      <Card className="recommended-product-card border-0 shadow-sm">
                        <Row className="g-0">
                          <Col xs={4}>
                            <img
                              src={product.image}
                              alt={product.title}
                              className="img-fluid rounded-start h-100 w-100"
                              style={{ objectFit: "cover" }}
                            />
                          </Col>
                          <Col xs={8}>
                            <Card.Body className="p-2">
                              <Card.Title
                                className="fs-6 text-truncate"
                                title={product.title}
                              >
                                {product.title}
                              </Card.Title>
                              <Card.Text className="text-danger fw-bold mb-0">
                                {product.price}
                              </Card.Text>
                              <Card.Text className="text-muted small">
                                <i className="bi bi-geo-alt"></i>{" "}
                                {product.location}
                              </Card.Text>
                            </Card.Body>
                          </Col>
                        </Row>
                      </Card>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Product Details Tabs */}
        <Card className="border-0 shadow rounded-4 mb-4">
          <Card.Body>
            <Nav variant="tabs" className="mb-3 product-tabs">
              <Nav.Item>
                <Nav.Link
                  className={activeTab === "description" ? "active-tab" : ""}
                  active={activeTab === "description"}
                  onClick={() => setActiveTab("description")}
                >
                  <i className="bi bi-file-text me-2"></i>Mô tả sản phẩm
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  className={activeTab === "specs" ? "active-tab" : ""}
                  active={activeTab === "specs"}
                  onClick={() => setActiveTab("specs")}
                >
                  <i className="bi bi-list-ul me-2"></i>Thông số kỹ thuật
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  className={activeTab === "reviews" ? "active-tab" : ""}
                  active={activeTab === "reviews"}
                  onClick={() => setActiveTab("reviews")}
                >
                  <i className="bi bi-star me-2"></i>Đánh giá (0)
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  className={activeTab === "questions" ? "active-tab" : ""}
                  active={activeTab === "questions"}
                  onClick={() => setActiveTab("questions")}
                >
                  <i className="bi bi-question-circle me-2"></i>Hỏi đáp
                </Nav.Link>
              </Nav.Item>
            </Nav>

            {/* Tab Content */}
            <div className="tab-content p-3">
              {activeTab === "description" && (
                <div className="product-description">
                  <p className="lead">
                    {product.description ||
                      "Chưa có mô tả chi tiết cho sản phẩm này."}
                  </p>
                </div>
              )}

              {activeTab === "specs" && (
                <div className="product-specs">
                  <Table responsive borderless hover className="specs-table">
                    <tbody>
                      <tr>
                        <td className="text-muted" style={{ width: "30%" }}>
                          Danh mục
                        </td>
                        <td>
                          <a href="/" className="text-primary">
                            Oreka
                          </a>{" "}
                          &gt;{" "}
                          <a href="#" className="text-primary">
                            Đồ cũ
                          </a>{" "}
                          &gt;{" "}
                          <a href="#" className="text-primary">
                            {category?.name}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-muted">Tình trạng</td>
                        <td>Mới</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Thương hiệu</td>
                        <td>{product.brand || "Không có thông tin"}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Màu sắc</td>
                        <td>{product.color || "Không có thông tin"}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Kích thước</td>
                        <td>{product.size || "Không có thông tin"}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Xuất xứ</td>
                        <td>{product.origin || "Không có thông tin"}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="product-reviews text-center py-4">
                  <i className="bi bi-star fs-1 text-muted"></i>
                  <p className="mt-3">Chưa có đánh giá nào cho sản phẩm này.</p>
                  <Button
                    variant="outline-primary"
                    className="btn-press-effect"
                  >
                    <i className="bi bi-pencil me-2"></i>Viết đánh giá
                  </Button>
                </div>
              )}

              {activeTab === "questions" && (
                <div className="product-questions">
                  <div className="text-center py-4">
                    <i className="bi bi-chat-dots fs-1 text-muted"></i>
                    <p className="mt-3">
                      Hiện tại chưa có câu hỏi nào. Cần thêm thông tin hãy gửi
                      câu hỏi cho người bán.
                    </p>
                    <Button
                      variant="outline-primary"
                      className="btn-press-effect"
                    >
                      <i className="bi bi-plus-circle me-2"></i>Hỏi ngay
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* Related Products */}
        <Card className="border-0 shadow rounded-4 mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                <i className="bi bi-box2 me-2"></i>Sản phẩm tương tự
              </h5>
              <Button variant="link" className="p-0">
                Xem tất cả
              </Button>
            </div>
            <Row className="g-3">
              {relatedProducts.map((product) => (
                <Col key={product.id} md={3} sm={6}>
                  {renderProductCard(product)}
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>

        {/* Recently Viewed */}
        <Card className="border-0 shadow rounded-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                <i className="bi bi-clock-history me-2"></i>Đã xem gần đây
              </h5>
              <Button variant="link" className="p-0">
                Xem tất cả
              </Button>
            </div>
            <Row className="g-3">
              {relatedProducts.slice(0, 4).map((product) => (
                <Col key={product.id} md={3} sm={6}>
                  {renderProductCard(product)}
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Container>

      {/* Success Toast */}
      <Toast
        className="success-toast"
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{
          position: "fixed",
          bottom: "40px",
          right: "20px",
          zIndex: 1000,
          minWidth: "350px",
        }}
      >
        <Toast.Header className="bg-success text-white">
          <i className="bi bi-check-circle-fill me-2"></i>
          <strong className="me-auto">Thành công</strong>
        </Toast.Header>
        <Toast.Body>
          <div className="d-flex align-items-center">
            <i className="bi bi-cart-check text-success fs-4 me-2"></i>
            <span>Thêm sản phẩm vào giỏ hàng thành công!</span>
          </div>
        </Toast.Body>
      </Toast>
    </div>
  );
};

export default Product;
