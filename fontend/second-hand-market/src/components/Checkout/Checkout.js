import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import ProductContext from "../../contexts/ProductContext";
import "./Checkout.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useCart } from "../../contexts/CartContext";
import { useProduct } from "../../contexts/ProductContext";
const Checkout = () => {
  const { getProduct } = useProduct();
  const { deleteItem } = useCart();
  const location = useLocation();
  const { selectedItems } = location.state || { selectedItems: [] };
  const [products, setProducts] = useState([]);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("direct");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [tempShippingMethod, setTempShippingMethod] = useState(shippingMethod);
  const [tempPaymentMethod, setTempPaymentMethod] = useState(paymentMethod);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await Promise.all(
          selectedItems.map((item) => getProduct(item.productId))
        );
        setProducts(productsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [selectedItems]);

  const getTotalAmount = () => {
    return selectedItems.reduce((total, item) => {
      const product = products.find((p) => p._id === item.productId);
      return product ? total + product.price * item.quantity : total;
    }, 0);
  };

  const handleCloseShippingModal = () => {
    setShowShippingModal(false);
  };

  // Payment Method Handlers
  const handleShowPaymentModal = () => {
    setTempPaymentMethod(paymentMethod);
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
  };

  const handlePaymentMethodChange = (e) => {
    setTempPaymentMethod(e.target.value);
  };

  const handleSavePaymentChanges = () => {
    setPaymentMethod(tempPaymentMethod);
    handleClosePaymentModal();
  };

  // Delete items from cart
  const handleDeleteItems = async () => {
    const ids = selectedItems.map((item) => item.productId);
    await deleteItem(ids);
  };

  const handlePlaceOrder = async () => {
    const orderData = {
      products: selectedItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalAmount: getTotalAmount(),
      shippingMethod,
      paymentMethod,
      shippingAddress: {
        name: "Hoàng Sơn",
        phone: "(+84) 332454556",
        address:
          "132/50, Mễ Trì Thượng, Phường Mễ Trì, Quận Nam Từ Liêm, Hà Nội",
      },
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vui lòng đăng nhập để tiếp tục.");
        navigate("/login");
        return;
      }

      const productsData = await Promise.all(
        orderData.products.map((product) => getProduct(product.productId))
      );

      const uniqueSellerIds = Array.from(
        new Set(productsData.map((product) => product.sellerId).filter(Boolean))
      );

      const ordersBySeller = uniqueSellerIds
        .map((sellerId) => {
          const sellerProducts = productsData
            .filter((product) => product.sellerId === sellerId)
            .map((product) => {
              const orderProduct = orderData.products.find(
                (item) => item.productId === product._id
              );
              return {
                productId: product._id,
                quantity: orderProduct ? orderProduct.quantity : 0,
              };
            })
            .filter((product) => product.quantity > 0);

          return {
            sellerId,
            products: sellerProducts,
          };
        })
        .filter((order) => order.products.length > 0);

      for (const order of ordersBySeller) {
        const orderPayload = {
          totalAmount: getTotalAmount(),
          shippingMethod,
          paymentMethod,
          shippingAddress: orderData.shippingAddress,
          sellerId: order.sellerId,
          products: order.products,
        };

        await axios.post(
          "http://localhost:2000/eco-market/orders",
          orderPayload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      Swal.fire({
        title: "Thông báo!",
        text: "Tạo đơn hàng thành công!",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/eco-market/customer/orders");
      handleDeleteItems();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
    }
  };

  const getShippingMethodText = () => {
    switch (shippingMethod) {
      case "direct":
        return "Giao dịch trực tiếp";
      case "thirdParty":
        return "Vận chuyển qua bên thứ 3";
      case "sellerShipping":
        return "Người bán tự vận chuyển";
      default:
        return "Chưa chọn";
    }
  };

  const getPaymentMethodText = () => {
    switch (paymentMethod) {
      case "cod":
        return "Thanh toán khi nhận hàng (COD)";
      case "bankTransfer":
        return "Chuyển khoản ngân hàng";
      case "eWallet":
        return "Ví điện tử (Momo, ZaloPay)";
      case "platformPayment":
        return "Thanh toán qua nền tảng";
      default:
        return "Chưa chọn";
    }
  };

  return (
    <div className="container">
      <div className="card mb-4 p-3">
        <h5 className="card-title text-danger">
          <i className="bi bi-geo-alt me-2"></i>Địa Chỉ Nhận Hàng
        </h5>
        <div className="d-flex justify-content-between">
          <div>
            <p>
              <strong>Hoàng Sơn</strong> (+84) 332454556
            </p>
            <p>
              132/50, Mễ Trì Thượng, Phường Mễ Trì, Quận Nam Từ Liêm, Hà Nội
            </p>
          </div>
          <div className="me-4">
            <button className="btn btn-outline-danger">Thay Đổi</button>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr className="bg-light">
                  <th
                    className="fs-5 fw-normal text-start"
                    style={{ width: "50%" }}
                  >
                    Sản phẩm
                  </th>
                  <th
                    className="fs-6 fw-normal text-center"
                    style={{ width: "15%" }}
                  >
                    Đơn giá
                  </th>
                  <th
                    className="fs-6 fw-normal text-center"
                    style={{ width: "10%" }}
                  >
                    Số lượng
                  </th>
                  <th
                    className="fs-6 fw-normal text-danger text-center"
                    style={{ width: "15%" }}
                  >
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const item = selectedItems.find(
                    (item) => item.productId === product._id
                  );
                  return item ? (
                    <tr key={product._id}>
                      <td className="text-start">
                        <img
                          src={product.avatar}
                          alt={product.name}
                          className="img-fluid"
                          style={{
                            width: "80px",
                            height: "100px",
                            objectFit: "contain",
                            display: "inline-block",
                            verticalAlign: "middle",
                          }}
                        />
                        <div
                          className="ms-3"
                          style={{
                            display: "inline-block",
                            verticalAlign: "middle",
                          }}
                        >
                          <p className="mb-1 fw-bold">{product.name}</p>
                          <p className="text-muted mb-0">
                            Loại: {product.brand} - {product.color}
                          </p>
                        </div>
                      </td>
                      <td className="text-center">{product.price}₫</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-center text-danger">
                        {(item.quantity * product.price).toLocaleString()}₫
                      </td>
                    </tr>
                  ) : null;
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card mb-3">
        {/* Phần phương thức vận chuyển mới */}
        <div className="card-header">
          <h5 className="mb-0">
            <i className="bi bi-truck me-2 text-primary"></i>
            Phương thức vận chuyển
          </h5>
        </div>

        <div className="card-body">
          <div className="row g-3">
            {/* Option 1: Giao dịch trực tiếp */}
            <div className="col-md-4">
              <div
                className={`card h-100 shipping-option ${
                  shippingMethod === "direct" ? "border-primary shadow" : ""
                }`}
                onClick={() => setShippingMethod("direct")}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-people-fill fs-1 text-success"></i>
                  </div>
                  <h5 className="card-title">Gặp mặt trực tiếp</h5>
                  <p className="card-text text-muted small">
                    Tự thỏa thuận địa điểm giao dịch với người bán
                  </p>
                  <div className="mt-2">
                    <span className="badge bg-light text-dark">
                      Không phí vận chuyển
                    </span>
                  </div>
                </div>
                <div className="card-footer bg-transparent">
                  {shippingMethod === "direct" && (
                    <button className="btn btn-sm btn-success w-100">
                      <i className="bi bi-check-circle me-1"></i> Đã chọn
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Option 2: Vận chuyển bên thứ 3 */}
            <div className="col-md-4">
              <div
                className={`card h-100 shipping-option ${
                  shippingMethod === "thirdParty" ? "border-primary shadow" : ""
                }`}
                onClick={() => setShippingMethod("thirdParty")}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-box-seam fs-1 text-warning"></i>
                  </div>
                  <h5 className="card-title">Đơn vị vận chuyển</h5>
                  <p className="card-text text-muted small">
                    Giao hàng nhanh chóng qua GHN, GHTK, Viettel Post
                  </p>
                  <div className="mt-2">
                    <span className="badge bg-light text-dark">
                      Phí 30,000đ
                    </span>
                  </div>
                </div>
                <div className="card-footer bg-transparent">
                  {shippingMethod === "thirdParty" && (
                    <button className="btn btn-sm btn-success w-100">
                      <i className="bi bi-check-circle me-1"></i> Đã chọn
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Option 3: Người bán tự giao */}
            <div className="col-md-4">
              <div
                className={`card h-100 shipping-option ${
                  shippingMethod === "sellerShipping"
                    ? "border-primary shadow"
                    : ""
                }`}
                onClick={() => setShippingMethod("sellerShipping")}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-person-badge fs-1 text-info"></i>
                  </div>
                  <h5 className="card-title">Người bán giao hàng</h5>
                  <p className="card-text text-muted small">
                    Người bán tự tổ chức vận chuyển theo thỏa thuận
                  </p>
                  <div className="mt-2">
                    <span className="badge bg-light text-dark">
                      Phí thỏa thuận
                    </span>
                  </div>
                </div>
                <div className="card-footer bg-transparent">
                  {shippingMethod === "sellerShipping" && (
                    <button className="btn btn-sm btn-success w-100">
                      <i className="bi bi-check-circle me-1"></i> Đã chọn
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Chi tiết phương thức đã chọn */}
          {shippingMethod && (
            <div className="mt-4 p-3 bg-light rounded">
              <h6>
                <i className="bi bi-info-circle me-2 text-primary"></i>
                Thông tin vận chuyển
              </h6>
              <ul className="list-unstyled">
                {shippingMethod === "direct" && (
                  <>
                    <li>
                      <i className="bi bi-check2 me-2 text-success"></i> Bạn sẽ
                      nhận hàng trực tiếp từ người bán
                    </li>
                    <li>
                      <i className="bi bi-check2 me-2 text-success"></i> Kiểm
                      tra hàng trước khi thanh toán
                    </li>
                    <li>
                      <i className="bi bi-check2 me-2 text-success"></i> Thời
                      gian giao dịch linh hoạt
                    </li>
                  </>
                )}
                {shippingMethod === "thirdParty" && (
                  <>
                    <li>
                      <i className="bi bi-check2 me-2 text-success"></i> Giao
                      hàng toàn quốc trong 2-5 ngày
                    </li>
                    <li>
                      <i className="bi bi-check2 me-2 text-success"></i> Được
                      đóng gói và bảo hiểm hàng hóa
                    </li>
                    <li>
                      <i className="bi bi-check2 me-2 text-success"></i> Theo
                      dõi đơn hàng trực tuyến
                    </li>
                  </>
                )}
                {shippingMethod === "sellerShipping" && (
                  <>
                    <li>
                      <i className="bi bi-check2 me-2 text-success"></i> Người
                      bán sẽ liên hệ để thống nhất phương thức
                    </li>
                    <li>
                      <i className="bi bi-check2 me-2 text-success"></i> Phí vận
                      chuyển sẽ được thông báo sau
                    </li>
                    <li>
                      <i className="bi bi-check2 me-2 text-success"></i> Thời
                      gian giao hàng tùy thuộc vào người bán
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Phương thức thanh toán</h5>
          <div>
            <span className="text-primary me-2">{getPaymentMethodText()}</span>
            <button
              className="btn btn-outline-danger"
              onClick={handleShowPaymentModal}
            >
              Thay Đổi
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between mb-2">
            <span>Tổng tiền hàng</span>
            <span>{getTotalAmount().toLocaleString()}₫</span>
          </div>

          {/* Hiển thị phí vận chuyển nếu có */}
          {shippingMethod === "thirdParty" && (
            <div className="d-flex justify-content-between mb-2">
              <span>Phí vận chuyển</span>
              <span>30,000₫</span>
            </div>
          )}

          <div className="d-flex justify-content-between mb-2 fw-bold">
            <span>Tổng thanh toán</span>
            <span className="text-danger">
              {(
                getTotalAmount() + (shippingMethod === "thirdParty" ? 30000 : 0)
              ).toLocaleString()}
              ₫
            </span>
          </div>
        </div>
        <div className="card-footer">
          <label className="form-check-label" htmlFor="agreementCheck">
            Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo{" "}
            <span className="text-primary">Điều khoản eco-market</span>
          </label>
          <Button
            className="btn btn-danger float-end"
            onClick={handlePlaceOrder}
          >
            Đặt hàng
          </Button>
        </div>
      </div>

      <Modal show={showPaymentModal} onHide={handleClosePaymentModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chọn phương thức thanh toán</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Check
              type="radio"
              id="payment-cod"
              name="paymentMethod"
              label="Thanh toán khi nhận hàng (COD)"
              value="cod"
              checked={tempPaymentMethod === "cod"}
              onChange={handlePaymentMethodChange}
            />
            <Form.Check
              type="radio"
              id="payment-bank"
              name="paymentMethod"
              label="Chuyển khoản ngân hàng"
              value="bankTransfer"
              checked={tempPaymentMethod === "bankTransfer"}
              onChange={handlePaymentMethodChange}
            />
            <Form.Check
              type="radio"
              id="payment-ewallet"
              name="paymentMethod"
              label="Ví điện tử (Momo, ZaloPay)"
              value="eWallet"
              checked={tempPaymentMethod === "eWallet"}
              onChange={handlePaymentMethodChange}
            />
            <Form.Check
              type="radio"
              id="payment-platform"
              name="paymentMethod"
              label="Thanh toán qua nền tảng"
              value="platformPayment"
              checked={tempPaymentMethod === "platformPayment"}
              onChange={handlePaymentMethodChange}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePaymentModal}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleSavePaymentChanges}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Checkout;
