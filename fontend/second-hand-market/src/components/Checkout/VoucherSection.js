import React from 'react';
import { formatPrice } from '../../utils/checkoutUtils';

const VoucherSection = ({ 
  selectedVoucher, 
  voucherDiscount, 
  onSelectVoucher 
}) => {
  return (
    <div className="card mb-4 voucher-section">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1 d-flex align-items-center">
              <i className="bi bi-ticket-perforated me-2"></i>
              Mã giảm giá
            </h5>
            {selectedVoucher ? (
              <div>
                <p className="mb-1">
                  <strong>{selectedVoucher.name}</strong>
                </p>
                <p className="mb-0 small opacity-75">
                  Mã: {selectedVoucher.code} | Giảm:{" "}
                  {formatPrice(voucherDiscount)}₫
                </p>
              </div>
            ) : (
              <p className="mb-0 opacity-75">Chọn hoặc nhập mã giảm giá</p>
            )}
          </div>
          <button
            className={`btn ${
              selectedVoucher ? "voucher-selected" : "voucher-btn"
            }`}
            onClick={onSelectVoucher}
          >
            <i className="bi bi-plus-circle me-2"></i>
            {selectedVoucher ? "Đổi voucher" : "Chọn voucher"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherSection; 