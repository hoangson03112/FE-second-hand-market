import React from "react";

const ShippingMethodCard = ({ shippingMethod, setShippingMethod }) => {
  return (
    <div className="card mb-3">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="bi bi-truck me-2 text-primary"></i>
          Phương thức vận chuyển
        </h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <div
              className={`card h-100 shipping-option ${shippingMethod === "direct" ? "border-primary shadow" : ""}`}
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
                  <span className="badge bg-light text-dark">Không phí vận chuyển</span>
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
          <div className="col-md-6">
            <div
              className={`card h-100 shipping-option ${shippingMethod === "sellerShipping" ? "border-primary shadow" : ""}`}
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
                  <span className="badge bg-light text-dark">Phí thỏa thuận</span>
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
        {shippingMethod && (
          <div className="mt-4 p-3 bg-light rounded">
            <h6>
              <i className="bi bi-info-circle me-2 text-primary"></i>
              Thông tin vận chuyển
            </h6>
            <ul className="list-unstyled">
              {shippingMethod === "direct" && (
                <>
                  <li><i className="bi bi-check2 me-2 text-success"></i> Bạn sẽ nhận hàng trực tiếp từ người bán</li>
                  <li><i className="bi bi-check2 me-2 text-success"></i> Kiểm tra hàng trước khi thanh toán</li>
                  <li><i className="bi bi-check2 me-2 text-success"></i> Thời gian giao dịch linh hoạt</li>
                </>
              )}
              {shippingMethod === "sellerShipping" && (
                <>
                  <li><i className="bi bi-check2 me-2 text-success"></i> Người bán sẽ liên hệ để thống nhất phương thức</li>
                  <li><i className="bi bi-check2 me-2 text-success"></i> Phí vận chuyển sẽ được thông báo sau</li>
                  <li><i className="bi bi-check2 me-2 text-success"></i> Thời gian giao hàng tùy thuộc vào người bán</li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingMethodCard; 