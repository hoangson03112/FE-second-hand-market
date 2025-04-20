import * as React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import ProductList from "./components/Product/ProductList";
import { Product } from "./components/Product/Product";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Layout from "./components/Layout/Layout";
import Cart from "./pages/Cart/Cart";
import Checkout from "./components/Checkout/Checkout";
import MyOrder from "./pages/Order/MyOrder";
import PostProduct from "./pages/PostProduct/PostProduct";
import LayoutAdmin from "./components/LayoutAdmin/LayoutAdmin";
import DashBoard from "./pages/DashBoard/DashBoard";
import CategoryManagement from "./pages/Admin/CategoryManagement/CategoryManagement";
import ProductManagement from "./pages/Admin/ProductManagement/ProductManagement";
import UserProfile from "./pages/UserProfile/UserProfile";
import UserManagement from "./pages/Admin/ManageUser/ManageUser";
import OrderManage from "./pages/Admin/OrderManage/OrderManage";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { CategoryProvider } from "./contexts/CategoryContext";
import { ProductProvider } from "./contexts/ProductContext";
import { OrderProvider } from "./contexts/OrderContext";
import { ChatProvider } from "./contexts/ChatContext";
import Verification from "./pages/Verification/Verification";

// Thiết lập axios interceptor khi ứng dụng khởi động
import ApiService from "./services/ApiService";
import authService from "./services/authService";

// Khởi tạo token từ localStorage nếu đã đăng nhập
const token = authService.getToken();
if (token) {
  ApiService.setupInterceptors(token);
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ProductProvider>
          <CategoryProvider>
            <OrderProvider>
              <ChatProvider>
                <BrowserRouter>
                  <Routes>
                    <Route
                      path="/eco-market/admin"
                      element={
                        <LayoutAdmin>
                          <DashBoard />
                        </LayoutAdmin>
                      }
                    />
                    <Route
                      path="/eco-market/admin/products"
                      element={
                        <LayoutAdmin>
                          <ProductManagement />
                        </LayoutAdmin>
                      }
                    />
                    <Route
                      path="/eco-market/admin/categories"
                      element={
                        <LayoutAdmin>
                          <CategoryManagement />
                        </LayoutAdmin>
                      }
                    />

                    <Route
                      path="/"
                      element={<Navigate to="/eco-market/home" />}
                    />
                    <Route
                      path="/eco-market/home"
                      element={
                        <Layout>
                          <Home />
                        </Layout>
                      }
                    />
                    <Route
                      path="/eco-market"
                      element={
                        <Layout>
                          <ProductList />
                        </Layout>
                      }
                    />
                    <Route
                      path="/eco-market/product"
                      element={
                        <Layout>
                          <Product />
                        </Layout>
                      }
                    />
                    <Route
                      path="/eco-market/user/profile"
                      element={
                        <Layout>
                          <UserProfile />
                        </Layout>
                      }
                    />
                    <Route
                      path="/eco-market/admin/customers"
                      element={
                        <LayoutAdmin>
                          <UserManagement />
                        </LayoutAdmin>
                      }
                    />
                    <Route
                      path="/eco-market/admin/orders"
                      element={
                        <LayoutAdmin>
                          <OrderManage />
                        </LayoutAdmin>
                      }
                    />
                    <Route
                      path="/eco-market/login"
                      element={
                        <Layout>
                          <Login />
                        </Layout>
                      }
                    />
                    <Route
                      path="/eco-market/register"
                      element={
                        <Layout>
                          <Register />
                        </Layout>
                      }
                    />
                    <Route
                      path="/eco-market/verification"
                      element={
                        <Layout>
                          <Verification />
                        </Layout>
                      }
                    />
                    <Route
                      path="/eco-market/my-cart"
                      element={
                        <Layout>
                          <Cart />
                        </Layout>
                      }
                    />
                    <Route
                      path="/eco-market/checkout"
                      element={
                        <Layout>
                          <Checkout />
                        </Layout>
                      }
                    />
                    <Route
                      path="/eco-market/customer/orders"
                      element={
                        <Layout>
                          <MyOrder />
                        </Layout>
                      }
                    />
                    <Route
                      path="/eco-market/seller/products/new"
                      element={
                        <Layout>
                          <PostProduct />
                        </Layout>
                      }
                    />
                  </Routes>
                </BrowserRouter>
              </ChatProvider>
            </OrderProvider>
          </CategoryProvider>
        </ProductProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
