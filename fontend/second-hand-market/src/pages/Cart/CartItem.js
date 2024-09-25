import React, { memo, useEffect } from "react";
import { Button } from "react-bootstrap";
import "./CartItem.css";
import ProductContext from "../../contexts/ProductContext";

const CartItem = memo(
  ({
    item,
    updateQuantity,
    isChecked,
    onCheckboxChange,
    onDeleteItem,
    setProduct,
    product,
  }) => {
    useEffect(() => {
      const fetchProduct = async () => {
        try {
          const product = await ProductContext.getProduct(item.productId);
          setProduct(product);
        } catch (err) {
          console.error(err);
        }
      };

      fetchProduct();
    }, []);

    return (
      <tr className="text-center align-middle">
        <td>
          <label className="custom-checkbox ms-2">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) =>
                onCheckboxChange(item.productId, e.target.checked)
              }
            />
            <span className="checkmark" />
          </label>
        </td>
        <td>
          <div className="d-flex align-items-center ms-3 ">
            <img
              src="https://static.oreka.vn/250-250_c653f6a5-fffc-43f3-8131-84d3cf909bd6"
              alt="Product"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "5px",
              }}
            />
            <p className="mb-0 ms-3 font-weight-bold text-wrap">
              {product.name}
            </p>
          </div>
        </td>
        <td>{product.price}₫</td>
        <td>
          <div className="d-flex  align-items-center">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => updateQuantity(item.productId, -1)}
              className="fs-7 px-2 btn-circle text-white"
            >
              -
            </Button>
            <div className=" quantity-span">{item.quantity}</div>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => updateQuantity(item.productId, 1)}
              className="fs-7 px-2 btn-circle text-white"
            >
              +
            </Button>
          </div>
        </td>
        <td>{(product.price * item.quantity).toLocaleString()}₫</td>
        <td>
          <Button
            variant="link"
            className="text-danger p-0 text-decoration-none"
            onClick={() => onDeleteItem([item.productId])}
          >
            <i className="bi bi-trash "></i> Xóa
          </Button>
        </td>
      </tr>
    );
  }
);

export default CartItem;


