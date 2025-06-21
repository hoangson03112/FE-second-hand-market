import React from "react";
import {
  Table,
  Button,
  Form,
  Image,
  ButtonGroup,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { Add, Remove, Delete } from "@mui/icons-material";
import "./CartItem.css";

const CartItem = ({
  products,
  sellers,
  handleUpdateQuantity,
  checkedItems,
  onCheckboxChange,
  onDeleteItem,
}) => {
  const groupedProducts = products.reduce((acc, product) => {
    const seller = sellers.find((seller) => seller._id === product.sellerId);
    const sellerName = seller?.fullName || "Unknown Seller";
    const sellerAvatar = seller?.avatar;

    if (!acc[sellerName]) {
      acc[sellerName] = {
        products: [],
        avatar: sellerAvatar,
        hasAvatar: !!sellerAvatar
      };
    }
    acc[sellerName].products.push(product);
    return acc;
  }, {});

  // Function to get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to generate background color from name
  const getAvatarColor = (name) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const formatPrice = (price) => {
    return price?.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <tbody>
      {Object.entries(groupedProducts).map(([sellerName, sellerData]) => (
        <React.Fragment key={sellerName}>
          <tr>
            <td colSpan="6" className="text-start bg-light">
              <div className="d-flex align-items-center py-2">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    marginRight: "12px",
                    borderRadius: "50%",
                    border: "2px solid #e0e0e0",
                    backgroundColor: sellerData.hasAvatar ? 'transparent' : getAvatarColor(sellerName),
                    color: sellerData.hasAvatar ? 'inherit' : 'white',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  {sellerData.hasAvatar ? (
                    <Image
                      src={sellerData.avatar}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                      onError={(e) => {
                        // If image fails to load, hide it and show initials
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = getInitials(sellerName);
                        e.target.parentElement.style.backgroundColor = getAvatarColor(sellerName);
                        e.target.parentElement.style.color = 'white';
                      }}
                    />
                  ) : (
                    getInitials(sellerName)
                  )}
                </div>
                <p className="ui-text mb-0 fw-semibold">{sellerName}</p>
              </div>
            </td>
          </tr>
          {sellerData.products.map((product) => (
            <tr key={product._id}>
              <td className="text-center align-middle">
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={!!checkedItems[product._id]}
                    onChange={(e) =>
                      onCheckboxChange(product._id, e.target.checked)
                    }
                  />
                  <span className="checkmark" />
                </label>
              </td>
              <td className="text-start align-middle">
                <div className="d-flex align-items-center">
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      marginRight: "15px",
                      borderRadius: "8px",
                    }}
                  >
                    <Image
                      src={product.avatar || "/images/default-product.png"}
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "100%",
                      }}
                      onError={(e) => {
                        e.target.src = "/images/default-product.png";
                      }}
                    />
                  </div>
                  <div>
                    <div className="fw-bold">{product.name}</div>
                    <div className="text-muted small">
                      {product.category?.name || "Uncategorized"}
                    </div>
                  </div>
                </div>
              </td>
              <td className="text-center fw-semibold text-primary align-middle">
                {formatPrice(product.price)}
              </td>
              <td className="align-middle">
                <div className="d-flex align-items-center justify-content-center">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="p-1"
                    onClick={() => handleUpdateQuantity(product._id, -1)}
                    disabled={product.quantity <= 1}
                  >
                    <Remove fontSize="small" />
                  </Button>
                  <span className="mx-2 fw-bold">{product.quantity}</span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="p-1"
                    onClick={() => handleUpdateQuantity(product._id, 1)}
                  >
                    <Add fontSize="small" />
                  </Button>
                </div>
              </td>
              <td className="text-center fw-bold text-danger align-middle">
                {formatPrice(product.price * product.quantity)}
              </td>
              <td className="text-center align-middle">
                <Button
                  variant="link"
                  className="text-danger p-0"
                  onClick={() => onDeleteItem([product._id])}
                >
                  <Delete />
                </Button>
              </td>
            </tr>
          ))}
        </React.Fragment>
      ))}
    </tbody>
  );
};

export default CartItem;
