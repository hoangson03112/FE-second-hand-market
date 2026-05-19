import React from "react";
import {
  formatPrice,
  renderCategory,
} from "../../utils/checkoutUtils";
import { ProductItemProps } from "./types/PaymentSummary.types";

const ProductItem: React.FC<ProductItemProps> = ({ product, showBorder = true }) => {

  return (
    <tr className={showBorder ? "border-bottom" : ""}>
      <td className="text-start py-3">
        <div className="d-flex align-items-center">
          <img
            src={product?.avatar?.url || "/default-product.png"}
            alt={product.name}
            className="img-fluid rounded me-3"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
            }}
          />
          <div className="flex-grow-1">
            <h6 className="mb-1 fw-bold">{product.name}</h6>
            <div className="text-muted small">
              {product.category && (
                <span className="badge bg-light text-dark me-2">
                  {renderCategory(product.category)}
                </span>
              )}
              {product.condition && (
                <span className="text-muted me-2">
                  Tình trạng: {product.condition}%
                </span>
              )}
            </div>

            {product.description && (
              <div
                className="text-muted small mt-1"
                style={{ fontSize: "0.8rem" }}
              >
                {product.description.length > 100
                  ? `${product.description.substring(0, 100)}...`
                  : product.description}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="text-center">
        <div className="fw-bold">{formatPrice(product.currentPrice || product.price)}₫</div>
      </td>


      <td className="text-center">
        <div className="quantity-display">
          <span className="fw-bold fs-5">{product.quantity}</span>
        </div>
      </td>

    </tr>
  );
};

export default ProductItem;
