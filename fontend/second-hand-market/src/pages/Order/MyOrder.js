import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import OrderItem from "./OrderItem";
import OrderContext from "../../contexts/OrderContext";

const MyOrder = () => {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [orders, setOrders] = useState([]);

  const tabs = [
    "Tất cả",
    "Chờ thanh toán",
    "Chờ đóng gói",
    "Vận chuyển",
    "Chờ giao hàng",
    "Hoàn thành",
    "Đã hủy",
    "Trả hàng/Hoàn tiền",
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await OrderContext.getOrder();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="container bg-white p-3">
      <ul className="nav nav-tabs border-bottom-0">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab}>
            <a
              className={`nav-link ${
                activeTab === tab ? "active text-danger" : "text-muted"
              }`}
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(tab);
              }}
            >
              {tab}
            </a>
          </li>
        ))}
      </ul>

      <div className="border-top pt-3">
        {orders.map((order, index) => (
          <div className="border p-3 mb-3" key={index}>
            <OrderItem order={order} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrder;
