import React, { useState, useEffect } from "react";
import { Table, Button, Card } from "react-bootstrap";
import "./Cart.css";
import CartItem from "./CartItem";
import axios from "axios";
import AccountContext from "../../contexts/AccountContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [checkedItems, setCheckedItems] = useState(false);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [cart, setCart] = useState([]);
  const [product, setProduct] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    if (cart.length === 0) {
      setIsCheckedAll(false);
    } else {
      const allChecked = cart.every((item) => checkedItems[item.productId]);
      setIsCheckedAll(allChecked);
    }
  }, [checkedItems, cart]);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const data = await AccountContext.Authentication();
        if (data.account) {
          setCart(data.account.cart);
        }
      } catch (error) {
        console.error("Error fetching", error);
      }
    };
    checkAuthentication();
  }, []);

  const handleCheckboxChange = (_id, isChecked) => {
    setCheckedItems((prev) => ({
      ...prev,
      [_id]: isChecked,
    }));
  };

  const handleCheckboxAllChange = (event) => {
    setIsCheckedAll(!isCheckedAll);
    setCheckedItems((prev) => {
      const newCheckedItems = {};
      cart.forEach((item) => {
        newCheckedItems[item.productId] = !isCheckedAll;
      });
      return newCheckedItems;
    });
  };

  const handleDeleteSelected = () => {
    const ids = Object.keys(checkedItems).filter(
      (productId) => checkedItems[productId]
    );

    const token = localStorage.getItem("token");
    if (!token) {
      return { message: "Chưa đăng nhập", status: 401 };
    }

    axios
      .delete("http://localhost:2000/ecomarket/delete-item", {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
        },
        data: {
          ids, // Gửi id dưới dạng data trong request DELETE
        },
      })
      .then((response) => {
        setCart(response.data.cart);
        setCheckedItems({});
        setIsCheckedAll(false);
      })
      .catch((error) => console.error(error));
  };

  const updateQuantity = async (id, change) => {
    setCart((prevItems) =>
      prevItems.map((item) =>
        item.productId === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
    const updatedQuantity =
      cart.find((item) => item.productId === id)?.quantity + change;

    const token = localStorage.getItem("token");
    if (!token) {
      return { message: "Chưa đăng nhập", status: 401 };
    }
    await axios
      .put(
        "http://localhost:2000/ecomarket/update-item-quantity",
        {
          productId: id,
          quantity: updatedQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.status === "success") {
          setCart(response.data.cart);
        }
      })
      .catch((error) => {
        console.error("Error updating quantity:", error);
      });
  };

  const getTotalAmount = () => {
    return cart.reduce(
      (total, item) =>
        checkedItems[item.productId]
          ? total + product.price * item.quantity
          : total,
      0
    );
  };

  const getSelectedCount = () => {
    return Object.values(checkedItems).filter(Boolean).length;
  };

  const handleDeleteItem = (ids) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return { message: "Chưa đăng nhập", status: 401 };
    }

    axios
      .delete("http://localhost:2000/ecomarket/delete-item", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          ids,
        },
      })
      .then((response) => setCart(response.data.cart))
      .catch((error) => console.error(error));
  };
  const handleCheckout = () => {
    const selectedItems = cart.filter((item) => checkedItems[item.productId]);

    if (selectedItems.length > 0) {
      // Điều hướng sang trang thanh toán và gửi các sản phẩm đã chọn
      navigate("/ecomarket/checkout", { state: { selectedItems } });
    }
  };
  return (
    <div className="container vh-100">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb d-flex align-items-center mt-4">
          <li className="ms-3">
            <a
              href="/ecomarket/home"
              className="text-decoration-none text-black"
            >
              Trang chủ
            </a>
          </li>
          <li className="mx-2">
            <span>&nbsp;&gt;&nbsp;</span>
            Giỏ hàng
          </li>
        </ol>
      </nav>
      <div className="mx-3 ">
        <div
          className="card p-3 shadow"
          style={{ transform: "none", boxShadow: "none" }}
        >
          <Table borderless className="table-hover">
            <thead>
              <tr className="text-center bg-light text-nowrap">
                <th>
                  <label className="custom-checkbox">
                    <input
                      name="dummy"
                      type="checkbox"
                      checked={isCheckedAll}
                      onChange={handleCheckboxAllChange}
                    />
                    <span className="checkmark" />
                    Tất cả
                  </label>
                </th>
                <th>Sản Phẩm</th>
                <th>Đơn Giá</th>
                <th>Số Lượng</th>
                <th>Số Tiền</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <CartItem
                  product={product}
                  key={index}
                  item={item}
                  updateQuantity={updateQuantity}
                  isChecked={!!checkedItems[item.productId]}
                  onCheckboxChange={handleCheckboxChange}
                  onDeleteItem={handleDeleteItem}
                  setProduct={setProduct}
                />
              ))}
            </tbody>
          </Table>
        </div>
        <Card
          className="shadow-sm sticky-bottom mt-4"
          style={{ transform: "none", boxShadow: "none" }}
        >
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Button
                  variant="link"
                  className="text-danger p-0 text-decoration-none"
                  onClick={handleDeleteSelected}
                >
                  Xóa
                </Button>
              </div>
              <div className="text-right">
                <p className="mb-0 font-weight-bold  me-3">
                  Tổng tiền ({getSelectedCount()} Sản phẩm):{" "}
                  <strong className="text-danger fs-5 ms-2">
                    {getTotalAmount().toLocaleString()}₫
                  </strong>
                </p>
                <Button
                  variant="danger"
                  className="mt-2 float-end"
                  onClick={handleCheckout}
                >
                  Mua Hàng
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
