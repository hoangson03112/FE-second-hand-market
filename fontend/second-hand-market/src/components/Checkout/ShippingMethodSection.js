import React from "react";
import { SHIPPING_METHOD_CONFIG } from "../../constants/checkout";

const ShippingMethodCard = ({ method, config, isSelected, onSelect }) => {
  return (
    <div className="col-md-6">
      <div
        className={`card h-100 shipping-option ${
          isSelected ? "border-primary shadow-lg" : ""
        }`}
        onClick={() => onSelect(method)}
        style={{ cursor: "pointer" }}
      >
        <div className="card-body text-center">
          <div className="mb-3">
            <i className={`bi ${config.icon} fs-1 text-muted`}></i>
          </div>
          <h6 className="card-title">{config.name}</h6>
          <p className="card-text text-muted small">{config.description}</p>
          <p className="text-muted small fw-semibold">
            <i className="bi bi-check-circle me-1"></i>Kiểm tra hàng trước khi
            nhận
          </p>
          <div className="mt-2">
            <span className="badge bg-secondary text-white">
              {config.badge.text}
            </span>
          </div>
        </div>
        <div className="card-footer bg-transparent">
          {isSelected && (
            <button className="btn btn-sm btn-primary w-100">
              <i className="bi bi-check-circle me-1"></i> Đã chọn
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ShippingInfoSection = ({ method, config }) => {
  if (!method || !config) return null;

  return (
    <div className="mt-4 p-3 bg-light rounded">
      <h6>
        <i className="bi bi-info-circle me-2 text-muted"></i>
        Thông tin vận chuyển
      </h6>
      <ul className="list-unstyled">
        {config.benefits.map((benefit, index) => (
          <li key={index}>
            <i className="bi bi-check2 me-2 text-muted"></i> {benefit}
          </li>
        ))}
      </ul>
    </div>
  );
};

const ShippingMethodSection = ({ shippingMethod, onShippingMethodChange }) => {
  const selectedConfig = SHIPPING_METHOD_CONFIG[shippingMethod];

  return (
    <div className="card mb-3">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="bi bi-truck me-2 text-muted"></i>
          Phương thức vận chuyển
        </h5>
      </div>

      <div className="card-body">
        <div className="row g-3">
          {Object.entries(SHIPPING_METHOD_CONFIG).map(([method, config]) => (
            <ShippingMethodCard
              key={method}
              method={method}
              config={config}
              isSelected={shippingMethod === method}
              onSelect={onShippingMethodChange}
            />
          ))}
        </div>

        <ShippingInfoSection method={shippingMethod} config={selectedConfig} />
      </div>
    </div>
  );
};

export default ShippingMethodSection;
