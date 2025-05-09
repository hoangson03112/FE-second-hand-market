import React, { memo } from "react";
import { Button } from "react-bootstrap";
import "./CartItem.css";
import "../../../src/styles/theme.css";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const CartItem = memo(
  ({
    sellers,
    products,
    handleUpdateQuantity,
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
              <tr className="border-top mt-3">
                <td colSpan="6">
                  <div className="d-flex align-items-center w-100 mb-2">
                    <img
                      src={seller?.avatar}
                      alt="Avatar"
                      className="rounded-circle"
                      width="50"
                      height="50"
                    />
                    <span className="ms-3 text-primary-custom">
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
                  <td className="text-primary-custom">
                    {product.price?.toLocaleString()}₫
                  </td>
                  <td>
                    <div className="d-flex align-items-center justify-content-center">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleUpdateQuantity(product._id, -1)}
                        className="fs-7 px-2 btn-circle text-white"
                      >
                        -
                      </Button>
                      <div className="quantity-span px-2">
                        {product.quantity || 0}
                      </div>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleUpdateQuantity(product._id, 1)}
                        className="fs-7 px-2 btn-circle text-white"
                      >
                        +
                      </Button>
                    </div>
                  </td>
                  <td className="text-danger fw-bold">
                    {(product.price * product.quantity).toLocaleString()}₫
                  </td>
                  <td className="text-start">
                    <DeleteForeverIcon
                      className="delete-icon"
                      onClick={() => onDeleteItem([product._id])}
                    />
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
