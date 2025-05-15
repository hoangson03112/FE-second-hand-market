import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import OrderItem from "../../components/specific/OrderItem";
import { useOrder } from "../../contexts/OrderContext";

const MyOrder = () => {
  const { getOrder } = useOrder();
  const [activeTab, setActiveTab] = useState("ALL");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { label: "Tất cả", value: "ALL" },
    { label: "Chờ xác nhận", value: "PENDING" },
    { label: "Đang vận chuyển", value: "SHIPPING" },
    { label: "Hoàn thành", value: "COMPLETED" },
    { label: "Đã hủy", value: "CANCELLED" },
    { label: "Trả hàng/Hoàn tiền", value: "REFUND" },
  ];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrder();
      setOrders(data.orders);
      setFilteredOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (activeTab === "ALL") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => order.status === activeTab);
      setFilteredOrders(filtered);
    }
  }, [activeTab, orders]);

  return (
    <div className="container bg-white p-3">
      <ul className="nav nav-tabs border-bottom-0">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.value}>
            <span
              className={`nav-link ${
                activeTab === tab.value ? "active text-danger" : "text-muted"
              } hover:text-primary hover:font-semibold transition`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(tab.value);
              }}
            >
              {tab.label}
            </span>
          </li>
        ))}
      </ul>

      <div style={{ minHeight: "60vh" }}>
        {filteredOrders?.length > 0 &&
          filteredOrders?.map((order, index) => (
            <div className="border p-3 pb-5 mb-3" key={index}>
              <OrderItem order={order} setOrders={setOrders} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default MyOrder;
