import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import ProductContext from "../../contexts/ProductContext";
import "./Checkout.css";

const Checkout = () => {
  const location = useLocation();
  const { selectedItems } = location.state || { selectedItems: [] };
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery");
  const [tempPaymentMethod, setTempPaymentMethod] = useState(paymentMethod);

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
    setTempPaymentMethod(paymentMethod);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePaymentChange = (e) => {
    setTempPaymentMethod(e.target.value);
  };

  const handleSaveChanges = () => {
    setPaymentMethod(tempPaymentMethod);
    handleCloseModal();
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
              {paymentMethod === "creditCard"
                ? "Thẻ tín dụng"
                : paymentMethod === "bankTransfer"
                ? "Chuyển khoản ngân hàng"
                : paymentMethod === "cashOnDelivery"
                ? "Thanh toán khi nhận hàng"
                : "Ví điện tử"}
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
            <Modal.Title>Chọn phương thức thanh toán</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Check
                type="radio"
                id="payment-method-creditCard"
                name="paymentMethod"
                label="Thẻ tín dụng"
                value="creditCard"
                checked={tempPaymentMethod === "creditCard"}
                onChange={handlePaymentChange}
              />
              <Form.Check
                type="radio"
                id="payment-method-bankTransfer"
                name="paymentMethod"
                label="Chuyển khoản ngân hàng"
                value="bankTransfer"
                checked={tempPaymentMethod === "bankTransfer"}
                onChange={handlePaymentChange}
              />
              <Form.Check
                type="radio"
                id="payment-method-cashOnDelivery"
                name="paymentMethod"
                label="Thanh toán khi nhận hàng"
                value="cashOnDelivery"
                checked={tempPaymentMethod === "cashOnDelivery"}
                onChange={handlePaymentChange}
              />
              <Form.Check
                type="radio"
                id="payment-method-eWallet"
                name="paymentMethod"
                label="Ví điện tử"
                value="eWallet"
                checked={tempPaymentMethod === "eWallet"}
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
          <div className="d-flex justify-content-between mb-2">
            <span>Phí vận chuyển</span>
            <span>20.000₫</span>
          </div>
          <div className="d-flex justify-content-between mb-2 fw-bold">
            <span>Tổng thanh toán</span>
            <span>{(getTotalAmount() + 20000).toLocaleString()}₫</span>
          </div>
        </div>
        <div className="card-footer">
          <label className="form-check-label" htmlFor="agreementCheck">
            Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo{" "}
            <span className="text-primary">Điều khoản EcoMarket</span>
          </label>
          <Button className="btn btn-danger float-end">Đặt hàng</Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
