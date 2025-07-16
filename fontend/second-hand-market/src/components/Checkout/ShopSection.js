import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import ProductItem from "./ProductItem";
import {
  formatPrice,
  calculateTotalWithDiscounts,
} from "../../utils/checkoutUtils";
import { shippingService } from "../../services/shippingService";
import ShippingMethodSelector from "./ShippingMethodSelector";

const ShopSection = ({
  seller,
  products,
  deliveryAddress,
  onShippingMethodChange,
  selectedShippingMethods,
  shippingData,
  shippingLoading,
}) => {
  // Calculate shop total with discounts applied
  const shopTotals = calculateTotalWithDiscounts(products);
  const shopTotal = shopTotals.finalTotal;
  const originalShopTotal = shopTotals.originalTotal;
  const shopSavings = shopTotals.totalSavings;

  // Use shipping data from parent component
  const shopShippingData = shippingData || {
    services: [],
    selectedService: null,
    loading: false,
    error: null,
  };

  const handleServiceChange = (service) => {
    onShippingMethodChange(seller._id, service);
  };

  return (
    <Card className="mb-4 shop-section">
      {/* Shop Header */}
      <Card.Header className="bg-light">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <img
              src={seller?.avatar?.url || "/default-avatar.png"}
              alt={seller.fullName}
              className="rounded-circle me-3"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <div>
              <h6 className="mb-0">
                <i className="bi bi-shop me-2"></i>
                {seller.fullName}
              </h6>
              <small className="text-muted">
                <i className="bi bi-geo-alt me-1 text-danger"></i>
                {seller?.province || "Không rõ địa chỉ"}
              </small>
            </div>
          </div>
          <div className="text-end">
            <div className="text-muted small">Tổng đơn hàng</div>
            {shopSavings > 0 ? (
              <div>
                <div className="text-muted small text-decoration-line-through">
                  {formatPrice(originalShopTotal)}₫
                </div>
                <div className="fw-bold text-primary">
                  {formatPrice(shopTotal)}₫
                </div>
                <div className="small fw-bold text-muted">
                  Tiết kiệm: {formatPrice(shopSavings)}₫
                </div>
              </div>
            ) : (
              <div className="fw-bold text-primary">
                {formatPrice(shopTotal)}₫
              </div>
            )}
          </div>
        </div>
      </Card.Header>

      <Card.Body className="p-0">
        {/* Products Table */}
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="bg-light">
              <tr style={{ fontSize: "0.9rem" }}>
                <th style={{ width: "50%" }}>Sản phẩm</th>
                <th className="text-center" style={{ width: "15%" }}>
                  Đơn giá
                </th>
                <th className="text-center" style={{ width: "15%" }}>
                  Số lượng
                </th>
                <th className="text-center" style={{ width: "20%" }}>
                  Thành tiền
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <ProductItem
                  key={product._id}
                  product={product}
                  showBorder={false}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Shipping Methods */}
        <div className="shipping-methods-section p-3 bg-light border-top">
          <ShippingMethodSelector
            shopName={seller.fullName}
            services={shopShippingData.services}
            selectedService={shopShippingData.selectedService}
            onServiceChange={handleServiceChange}
            loading={shippingLoading || shopShippingData.loading}
            error={shopShippingData.error}
          />
        </div>
      </Card.Body>
    </Card>
  );
};

export default ShopSection;
