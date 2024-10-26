import React, { useEffect, useState } from "react";
import ProductContext from "../../contexts/ProductContext";
import AccountContext from "../../contexts/AccountContext";

const OrderItem = ({ order }) => {
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState({});


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log(order);
        if (order?.products?.length > 0) {
          const productPromises = order?.products?.map((item) => {
           

            return ProductContext.getProduct(item.productId);
          });
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
  }, [order]);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const uniqueSellerIds = Array.from(
          new Set(products.map((product) => product.sellerId))
        );

        const sellerPromises = uniqueSellerIds.map((sellerId) =>
          AccountContext.getAccount(sellerId)
        );
        const sellersData = await Promise.all(sellerPromises);
        const sellersMap = sellersData.reduce((acc, seller) => {
          acc[seller._id] = seller;
          return acc;
        }, {});
        setSellers(sellersMap);
      } catch (err) {
        console.error("Error fetching sellers:", err);
      }
    };

    if (products.length > 0) {
      fetchSellers();
    }
  }, [products]);
 

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          {products.length > 0 && sellers[products[0].sellerId] && (
            <div
              className="d-flex align-items-center text-decoration-none"
              style={{ cursor: "pointer" }}
            >
              <img
                src={
                  sellers[products[0].sellerId].avatar ||
                  "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
                }
                alt="User"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                }}
                className="me-2"
              />
              <span className="fw-bold">
                {sellers[products[0].sellerId].fullName}
              </span>
            </div>
          )}
        </div>
        <div>
          <button className="btn btn-outline-danger btn-sm me-2">
            <i className="bi bi-chat-dots me-1"></i>
            Chat
          </button>
          <button className="btn btn-outline-secondary btn-sm">Xem Shop</button>
        </div>
      </div>
      {products.map((product, index) => (
        <div
          key={index}
          className="d-flex justify-content-between align-items-center py-2"
        >
          <div className="row align-items-center">
            <div className="col-auto">
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
            </div>
            <div className="col">
              <p className="mb-0 fw-bold">{product.name}</p>
              <p className="mb-0">
                Số Lượng:{" "}
                {order.products.find((p) => p.productId === product._id)
                  ?.quantity || 0}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderItem;
