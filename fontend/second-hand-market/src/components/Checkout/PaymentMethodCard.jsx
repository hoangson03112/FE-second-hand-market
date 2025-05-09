import React from "react";

const PaymentMethodCard = ({ getTotalAmount }) => {
  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Phương thức thanh toán</h5>
        <div>
          <span className="text-primary">Thanh toán khi nhận hàng (COD)</span>
        </div>
      </div>
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <div className="me-3">
            <i className="bi bi-cash-coin fs-1 text-success"></i>
          </div>
          <div>
            <h6 className="mb-1">Thanh toán khi nhận hàng</h6>
            <p className="text-muted mb-0 small">
              Bạn sẽ thanh toán bằng tiền mặt khi nhận được hàng
            </p>
          </div>
        </div>
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          Vì lý do an toàn, chúng tôi chỉ hỗ trợ phương thức thanh toán khi
          nhận hàng (COD) để đảm bảo bạn có thể kiểm tra hàng hóa trước khi
          thanh toán.
        </div>
        {getTotalAmount && (
          <>
            <div className="d-flex justify-content-between mb-2">
              <span>Tổng tiền hàng</span>
              <span>{getTotalAmount().toLocaleString()}₫</span>
            </div>
            <div className="d-flex justify-content-between mb-2 fw-bold">
              <span>Tổng thanh toán</span>
              <span className="text-danger">
                {getTotalAmount().toLocaleString()}₫
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodCard; 