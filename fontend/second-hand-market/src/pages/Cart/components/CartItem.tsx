import React, { useState, useMemo, useCallback, memo } from "react";
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

// Optimized Image Component with lazy loading and error handling
const OptimizedImage = memo(({ src, alt, onError, style, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  return (
    <div style={{ position: "relative", ...style }}>
      {isLoading && (
        <div
          className="image-skeleton"
          style={{
            ...style,
            background:
              "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
            backgroundSize: "200% 100%",
            animation: "loading 1.5s infinite",
          }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        style={{
          ...style,
          display: isLoading ? "none" : "block",
          objectFit: "cover",
        }}
        {...props}
      />
      {hasError && (
        <div
          style={{
            ...style,
            background: "#f8f9fa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6c757d",
            fontSize: "12px",
          }}
        >
          <i className="bi bi-image" />
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = "OptimizedImage";

// Đảm bảo CartItem chỉ re-render khi các props thực sự thay đổi
const areEqual = (prevProps, nextProps) => {
  // So sánh shallow cho các props chính
  return (
    prevProps.products === nextProps.products &&
    prevProps.sellers === nextProps.sellers &&
    prevProps.checkedItems === nextProps.checkedItems &&
    prevProps.isItemUpdating === nextProps.isItemUpdating
  );
};

const CartItem = React.memo(
  ({
    products,
    sellers,
    handleUpdateQuantity,
    checkedItems,
    onCheckboxChange,
    onDeleteItem,
    isItemUpdating,
  }) => {
    const [failedImages, setFailedImages] = useState(new Set());

    const groupedProducts = useMemo(() => {
      return products.reduce((acc, product) => {
        const seller = sellers.find(
          (seller) => seller._id === product.seller._id
        );

        const sellerName = seller?.fullName || "Unknown Seller";
        const sellerAvatar = seller?.avatar;

        if (!acc[sellerName]) {
          acc[sellerName] = {
            products: [],
            avatar: sellerAvatar,
            hasAvatar: !!sellerAvatar,
          };
        }
        acc[sellerName].products.push(product);
        return acc;
      }, {});
    }, [products, sellers]);

    // Memoized functions to prevent unnecessary re-renders
    const getInitials = useCallback((name) => {
      return name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }, []);

    const getAvatarColor = useCallback((name) => {
      const colors = [
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
        "#96CEB4",
        "#FFEAA7",
        "#DDA0DD",
        "#98D8C8",
        "#F7DC6F",
        "#BB8FCE",
        "#85C1E9",
      ];
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
    }, []);

    const formatPrice = useCallback((price) => {
      return price?.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    }, []);

    // Memoized handlers
    const handleImageError = useCallback((imageUrl) => {
      setFailedImages((prev) => new Set([...prev, imageUrl]));
    }, []);

    const handleQuantityChange = useCallback(
      (productId, change) => {
        handleUpdateQuantity(productId, change);
      },
      [handleUpdateQuantity]
    );

    const handleCheckChange = useCallback(
      (productId, checked) => {
        onCheckboxChange(productId, checked);
      },
      [onCheckboxChange]
    );

    const handleDelete = useCallback(
      (productId) => {
        onDeleteItem(productId);
      },
      [onDeleteItem]
    );

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
                      backgroundColor:
                        sellerData.hasAvatar &&
                        !failedImages.has(sellerData.avatar?.url)
                          ? "transparent"
                          : getAvatarColor(sellerName),
                      color:
                        sellerData.hasAvatar &&
                        !failedImages.has(sellerData.avatar?.url)
                          ? "inherit"
                          : "white",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {sellerData.hasAvatar &&
                    !failedImages.has(sellerData.avatar?.url) ? (
                      <OptimizedImage
                        src={sellerData.avatar.url}
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                        onError={() => handleImageError(sellerData.avatar.url)}
                      />
                    ) : (
                      getInitials(sellerName)
                    )}
                  </div>
                  <p className="ui-text mb-0 fw-semibold">{sellerName}</p>
                </div>
              </td>
            </tr>
            {sellerData.products.map((product) => {
              const finalPrice = product.price;
              return (
                <tr key={product._id}>
                  <td className="text-center align-middle">
                    <label className="custom-checkbox">
                      <input
                        type="checkbox"
                        checked={!!checkedItems[product._id]}
                        onChange={(e) =>
                          handleCheckChange(product._id, e.target.checked)
                        }
                      />
                      <span className="checkmark" />
                    </label>
                  </td>
                  <td className="text-start align-middle">
                    <div className="d-flex align-items-center">
                      <OptimizedImage
                        src={product.avatar?.url}
                        alt={product.name}
                        style={{
                          width: "80px",
                          height: "80px",
                          marginRight: "15px",
                          borderRadius: "8px",
                        }}
                      />
                      <div>
                        <div className="fw-bold">{product.name}</div>
                        <div className="text-muted small">
                          {product.category?.name || "Uncategorized"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center fw-semibold align-middle">
                    {formatPrice(finalPrice)}
                  </td>
                  <td className="align-middle">
                    <div className="d-flex align-items-center justify-content-center quantity-container">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="p-1 quantity-button"
                        onClick={() => handleQuantityChange(product._id, -1)}
                        disabled={product.quantity <= 1}
                      >
                        <Remove fontSize="small" />
                      </Button>
                      <span
                        className={`mx-2 fw-bold quantity-display ${
                          isItemUpdating?.(product._id) ? "updating" : ""
                        }`}
                      >
                        {product.quantity}
                      </span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="p-1 quantity-button"
                        onClick={() => handleQuantityChange(product._id, 1)}
                      >
                        <Add fontSize="small" />
                      </Button>
                    </div>
                  </td>
                  <td className="text-center fw-bold align-middle text-danger">
                    <span
                      className={`price-display ${
                        isItemUpdating?.(product._id) ? "updating" : ""
                      }`}
                    >
                      {formatPrice(finalPrice * product.quantity)}
                    </span>
                  </td>
                  <td className="text-center align-middle">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(product._id)}
                      className="d-flex align-items-center"
                    >
                      <Delete fontSize="small" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </React.Fragment>
        ))}

        <style jsx>{`
          @keyframes loading {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }

          .image-skeleton {
            border-radius: 8px;
          }
        `}</style>
      </tbody>
    );
  },
  areEqual
);

CartItem.displayName = "CartItem";

export default CartItem;
