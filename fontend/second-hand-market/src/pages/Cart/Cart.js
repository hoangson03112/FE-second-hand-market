import React, { useState, useEffect } from "react";
import { Table, Button, Card } from "react-bootstrap";
import "./Cart.css";
import "../../../src/styles/theme.css";
import CartItem from "../../components/specific/CartItem";
import axios from "axios";
import AccountContext from "../../contexts/AccountContext";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../../contexts/ProductContext";
import { useCart } from "../../contexts/CartContext";
const Cart = () => {
  const { getProduct } = useProduct();
  const { deleteItem, updateQuantity } = useCart();
  const [checkedItems, setCheckedItems] = useState({});
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const data = await AccountContext.Authentication();

        if (data.data) {
          setCart(data.data.account.cart);
          const initialCheckedItems = {};
          data.data.account.cart.forEach((item) => {
            initialCheckedItems[item.productId] = false;
          });
          setCheckedItems(initialCheckedItems);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    checkAuthentication();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (cart.length > 0) {
          const productPromises = cart.map((item) =>
            getProduct(item.productId)
          );
          const productsData = await Promise.all(productPromises);

          const productsWithQuantity = productsData.map((product) => {
            const cartItem = cart.find(
              (item) => item.productId === product._id
            );
            return {
              ...product,
              quantity: cartItem ? cartItem.quantity : 0,
            };
          });
          setProducts(productsWithQuantity);
        } else {
          setProducts([]); // Xóa hết sản phẩm khi giỏ hàng rỗng
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [cart]);

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
        setSellers(sellersData);
      } catch (err) {
        console.error("Error fetching sellers:", err);
      }
    };

    if (products.length > 0) {
      fetchSellers();
    }
  }, [products]);

  useEffect(() => {
    const allChecked = Object.values(checkedItems).every(Boolean);
    const anyChecked = Object.values(checkedItems).some(Boolean);
    setIsCheckedAll(allChecked && anyChecked);
  }, [checkedItems]);

  useEffect(() => {
    const calculateTotal = () => {
      const total = products.reduce((sum, product) => {
        if (checkedItems[product._id]) {
          return sum + product.price * product.quantity;
        }
        return sum;
      }, 0);
      setTotalAmount(total);
    };
    calculateTotal();
  }, [products, checkedItems]);

  const handleCheckboxChange = (productId, isChecked) => {
    setCheckedItems((prev) => ({ ...prev, [productId]: isChecked }));
  };

  const handleCheckboxAllChange = () => {
    const newCheckedState = !isCheckedAll;
    const newCheckedItems = {};
    cart.forEach((item) => {
      newCheckedItems[item.productId] = newCheckedState;
    });
    setCheckedItems(newCheckedItems);
    setIsCheckedAll(newCheckedState);
  };

  const handleDeleteSelected = () => {
    const selectedIds = Object.entries(checkedItems)
      .filter(([, isChecked]) => isChecked)
      .map(([productId]) => productId);

    deleteItems(selectedIds);
  };

  const deleteItems = async (ids) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập để tiếp tục.");
      navigate("/login");
      return;
    }

    try {
      const response = await deleteItem(ids);
      if (response.status === "success") {
        setCart(response.cart);
        setCheckedItems({});
        setIsCheckedAll(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateQuantity = async (productId, change) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập để tiếp tục.");
      navigate("/login");
      return;
    }

    try {
      const response = await updateQuantity(productId, change);

      if (response.status === "success") {
        setCart(response.cart);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const getSelectedCount = () =>
    Object.values(checkedItems).filter(Boolean).length;

  const handleCheckout = () => {
    const selectedItems = cart.filter((item) => checkedItems[item.productId]);

    if (selectedItems.length > 0) {
      navigate("/eco-market/checkout", { state: { selectedItems } });
    }
  };

  return (
    <div className="container vh-100">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb d-flex align-items-center mt-4">
          <li className="ms-3">
            <a
              href="/eco-market/home"
              className="text-decoration-none text-primary-custom"
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
      <div className="mx-3">
        <div className="card p-3 shadow" style={{ transform: "none" }}>
          <Table borderless className="table-hover">
            <thead>
              <tr className="text-center bg-light text-nowrap">
                <th>
                  <label className="custom-checkbox">
                    <input
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
            <CartItem
              sellers={sellers}
              products={products}
              handleUpdateQuantity={handleUpdateQuantity}
              checkedItems={checkedItems}
              onCheckboxChange={handleCheckboxChange}
              onDeleteItem={deleteItems}
            />
          </Table>
        </div>
        <Card className="shadow-sm sticky-bottom mt-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Button
                  variant="link"
                  className="text-primary-custom p-0 text-decoration-none"
                  onClick={handleDeleteSelected}
                >
                  <i className="bi bi-trash icon-primary"></i> Xóa
                </Button>
              </div>
              <div className="text-right">
                <p className="mb-0 font-weight-bold me-3">
                  Tổng tiền ({getSelectedCount()} Sản phẩm):{" "}
                  <strong className="text-gradient fs-5 ms-2">
                    {totalAmount.toLocaleString()}₫
                  </strong>
                </p>
                <Button
                  className="mt-2 float-end btn-primary"
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
