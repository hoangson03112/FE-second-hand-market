import React, { useEffect, useState } from "react";
import { useProduct } from "../../contexts/ProductContext";
import CancelOrderModal from "../../components/specific/CancelOrderModal";
import { formatPrice } from "../../utils/function";
import { useOrder } from "../../contexts/OrderContext";
import AccountContext from "../../contexts/AccountContext";
const OrderItem = ({ order, setOrders }) => {
  const { getProduct } = useProduct();
  const { updateOrder } = useOrder();
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (order?.products?.length > 0) {
          const productPromises = order.products.map((item) =>
            getProduct(item.productId)
          );
          const productsData = await Promise.all(productPromises);
          setProducts(productsData);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [getProduct, order]);

  useEffect(() => {
    setTotalAmount(
      products.reduce((total, product) => {
        const orderProduct = order.products.find(
          (p) => p.productId === product?._id
        );
        return total + product?.price * (orderProduct?.quantity || 0);
      }, 0)
    );
  }, [products, order]);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const sellerIds = [
          ...new Set(products.map((product) => product?.sellerId)),
        ];
        const sellerPromises = sellerIds.map((id) =>
          AccountContext.getAccount(id)
        );
        const sellersData = await Promise.all(sellerPromises);

        const sellersMap = {};
        sellersData.forEach((seller) => {
          sellersMap[seller?._id] = seller;
        });

        setSellers(sellersMap);
      } catch (err) {
        console.error("Error fetching sellers:", err);
      }
    };

    if (products.length > 0) {
      fetchSellers();
    }
  }, [products]);

  const handleCancelOrder = async (orderId, reason, status) => {
    try {
      const data = await updateOrder(orderId, reason, status);
      setOrders(data.orders);
      setShowCancelModal(false);
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  const renderStatusButtons = () => {
    switch (order.status) {
      case "PENDING":
        return (
          <>
            <button className="btn btn-outline-secondary btn-sm">
              Liên hệ với người bán
            </button>
            <button
              className="btn btn-outline-danger btn-sm mx-2"
              onClick={() => setShowCancelModal(true)}
            >
              Hủy đơn hàng
            </button>
          </>
        );
      case "SHIPPING":
        return (
          <>
            <button className="btn btn-outline-primary btn-sm">
              Yêu cầu trả hàng
            </button>
            <button className="btn btn-outline-danger btn-sm mx-2">
              Đã nhận được hàng
            </button>
          </>
        );
      case "COMPLETED":
        return (
          <>
            <button className="btn btn-outline-dark btn-sm">Mua lại</button>
            <button className="btn btn-outline-danger btn-sm mx-2">
              Đánh giá
            </button>
          </>
        );
      case "CANCELLED":
      case "REFUND":
        return (
          <>
            <button className="btn btn-outline-dark btn-sm">Mua lại</button>
            <button className="btn btn-outline-danger btn-sm mx-2">
              Liên hệ người bán
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-2">
        {Object.values(sellers).map((seller) => {
          const sellerProducts = products.filter(
            (product) => product?.sellerId === seller?._id
          );

          if (sellerProducts.length === 0) {
            return null;
          }
          return (
            <div
              key={seller?._id}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <div
                  className="d-flex align-items-center text-decoration-none"
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={seller?.avatar || "https://default-avatar-url.png"}
                    alt="User"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                    }}
                    className="me-2"
                  />
                  <span className="fw-bold">{seller.fullName}</span>
                </div>
              </div>
              <div>
                <span className="fs-4">
                  {{
                    PENDING: "Chờ xác nhận",
                    SHIPPING: "Đang vận chuyển",
                    CANCELLED: "Đã hủy",
                    COMPLETED: "Hoàn thành",
                    REFUND: "Trả hàng",
                  }[order.status] || "Trạng thái không xác định"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <hr className="m-0 mb-2" />
      {products?.map((product) => (
        <div
          key={product?._id}
          className="d-flex justify-content-between align-items-center py-2"
        >
          <div className="row align-items-center">
            <div className="col-auto">
              <img
                src={product?.avatar || "/path/to/default-product-image.png"}
                alt={product?.name || "Product"}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
            </div>
            <div className="col">
              <a
                href={`/eco-market/product?productID=${product?._id}`}
                className="text-black text-decoration-none"
              >
                <p className="mb-0 fw-bold">{product?.name}</p>
                <p className="mb-0">
                  Số Lượng:{" "}
                  {
                    order?.products.find((p) => p?.productId === product?._id)
                      ?.quantity
                  }
                </p>
              </a>
            </div>
          </div>
          <p>
            Giá:{" "}
            <span className="text-danger me-3 fw-bold">
              {" "}
              {formatPrice(product.price)}
            </span>
          </p>
        </div>
      ))}
      <div className="d-flex justify-content-end align-items-center mt-2">
        <span>Thành tiền:</span>
        <h3 className="text-danger mx-2">{formatPrice(totalAmount)}</h3>
      </div>
      <div className="float-end">
        {showCancelModal && (
          <CancelOrderModal
            orderId={order?._id}
            onConfirm={handleCancelOrder}
            onClose={() => setShowCancelModal(false)}
          />
        )}
        {renderStatusButtons()}
      </div>
    </div>
  );
};

export default OrderItem;
