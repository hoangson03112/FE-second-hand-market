import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import ProductContext from "../../contexts/ProductContext";
import "./Checkout.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Checkout = () => {
  const location = useLocation();
  const { selectedItems } = location.state || { selectedItems: [] };
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("buyer");
  const [tempShippingMethod, setTempShippingMethod] = useState(shippingMethod);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await Promise.all(
          selectedItems.map((item) => ProductContext.getProduct(item.productId))
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

  const handleShowModal = () => {
    setTempShippingMethod(shippingMethod);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePaymentChange = (e) => {
    setTempShippingMethod(e.target.value);
  };

  const handleSaveChanges = () => {
    setShippingMethod(tempShippingMethod);
    handleCloseModal();
  };
  //Xoa san pham trong cart khi da tao order
  const deleteItems = () => {
    const ids = selectedItems.map((item) => item.productId);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập để tiếp tục.");
      navigate("/login");
      return;
    }

    axios
      .delete("http://localhost:2000/eco-market/delete-item", {
        headers: { Authorization: `Bearer ${token}` },
        data: { ids },
      })
      .then((response) => {
        console.log("Items deleted successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error deleting items:", error);
        alert("Có lỗi xảy ra khi xóa sản phẩm.");
      });
  };

  const handlePlaceOrder = async () => {
    const orderData = {
      products: selectedItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalAmount: getTotalAmount(),
      shippingMethod,
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

      // Lấy dữ liệu sản phẩm
      const productsData = await Promise.all(
        orderData.products.map((product) =>
          ProductContext.getProduct(product.productId)
        )
      );

      // Lấy danh sách ID người bán duy nhất
      const uniqueSellerIds = Array.from(
        new Set(productsData.map((product) => product.sellerId).filter(Boolean))
      );

      // Nhóm sản phẩm theo người bán
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

      // Gửi yêu cầu tạo đơn hàng cho mỗi người bán
      console.log(ordersBySeller);
      for (const order of ordersBySeller) {
       
        const orderPayload = {
          totalAmount: getTotalAmount(), // Cần tính toán lại tổng số tiền cho từng người bán
          shippingMethod,
          shippingAddress: {
            name: "Hoàng Sơn",
            phone: "(+84) 332454556",
            address:
              "132/50, Mễ Trì Thượng, Phường Mễ Trì, Quận Nam Từ Liêm, Hà Nội",
          },
          sellerId: order.sellerId, 
          products: order.products,
        };

        // Gửi yêu cầu tạo đơn hàng
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
        icon: "success", // Các kiểu: 'success', 'error', 'warning', 'info', 'question'
        confirmButtonText: "OK",
      });
      navigate("/eco-market/customer/orders");
      // Xóa các sản phẩm đã chọn sau khi đặt hàng
      deleteItems();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
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
            <button className="btn btn-outline-danger ">Thay Đổi</button>
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
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Phương thức thanh toán</h5>
          <div>
            <span className="text-primary me-2">
              {shippingMethod === "buyer"
                ? "Tôi sẽ đến lấy"
                : "Người bán sẽ vận chuyển"}
            </span>
            <button
              className="btn btn-outline-danger "
              onClick={handleShowModal}
            >
              Thay Đổi
            </button>
          </div>
        </div>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Chọn phương thức vận chuyển</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Check
                type="radio"
                id="payment-method-creditCard"
                name="paymentMethod"
                label="Tôi sẽ đến lấy"
                value="buyer"
                checked={tempShippingMethod === "buyer"}
                onChange={handlePaymentChange}
              />
              <Form.Check
                type="radio"
                id="payment-method-bankTransfer"
                name="paymentMethod"
                label="Người bán vận chuyển"
                value="seller"
                checked={tempShippingMethod === "seller"}
                onChange={handlePaymentChange}
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Đóng
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Lưu thay đổi
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="card-body">
          <div className="d-flex justify-content-between mb-2">
            <span>Tổng tiền hàng</span>
            <span>{getTotalAmount().toLocaleString()}₫</span>
          </div>

          <div className="d-flex justify-content-between mb-2 fw-bold">
            <span>Tổng thanh toán</span>
            <span>{getTotalAmount().toLocaleString()}₫</span>
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
    </div>
  );
};

export default Checkout;
