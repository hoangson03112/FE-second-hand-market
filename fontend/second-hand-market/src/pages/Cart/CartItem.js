import React, { memo } from "react";
import { Button } from "react-bootstrap";
import "./CartItem.css";

const CartItem = memo(
  ({
    sellers,
    products,
    updateQuantity,
    checkedItems,
    onCheckboxChange,
    onDeleteItem,
  }) => {
    return (
      <tbody>
        {sellers.map((seller) => {
          const sellerProducts = products.filter(
            (product) => product.sellerId === seller._id
          );

          if (sellerProducts.length === 0) {
            return null;
          }

          return (
            <React.Fragment key={seller._id}>
              <tr>
                <td colSpan="6">
                  <div className="d-flex align-items-center w-100 mb-2">
                    <img
                      src={seller.avatar}
                      alt="Avatar"
                      className="rounded-circle"
                      width="50"
                      height="50"
                    />
                    <span className="ms-3">
                      {seller.fullName || "Loading..."}
                    </span>
                  </div>
                </td>
              </tr>

              {sellerProducts.map((product) => (
                <tr key={product._id} className="text-center align-middle">
                  <td>
                    <label className="custom-checkbox ms-2">
                      <input
                        type="checkbox"
                        checked={checkedItems[product._id] || false}
                        onChange={(e) =>
                          onCheckboxChange(product._id, e.target.checked)
                        }
                      />
                      <span className="checkmark" />
                    </label>
                  </td>
                  <td>
                    <div className="d-flex align-items-center ms-3">
                      <img
                        src={product.avatar}
                        alt={product.name}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                      <p className="mb-0 ms-3 font-weight-bold text-wrap">
                        {product.name || "Loading..."}
                      </p>
                    </div>
                  </td>
                  <td>{product.price?.toLocaleString()}₫</td>
                  <td>
                    <div className="d-flex align-items-center justify-content-center">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => updateQuantity(product._id, -1)}
                        className="fs-7 px-2 btn-circle text-white"
                      >
                        -
                      </Button>
                      <div className="quantity-span mx-2">
                        {product.quantity || 0}
                      </div>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => updateQuantity(product._id, 1)}
                        className="fs-7 px-2 btn-circle text-white"
                      >
                        +
                      </Button>
                    </div>
                  </td>
                  <td>
                    {(product.price * product.quantity).toLocaleString()}₫
                  </td>
                  <td>
                    <Button
                      variant="link"
                      className="text-danger p-0 text-decoration-none"
                      onClick={() => onDeleteItem([product._id])}
                    >
                      <i className="bi bi-trash"></i> Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          );
        })}
      </tbody>
    );
  }
);

export default CartItem;
