import NoAccess from "./pages/NoAccess";

import * as React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/theme";
import { Home } from "./pages/Home/Home";
import ProductList from "./pages/ProductList/ProductList";
import Product from "./pages/ProductDetails/Product";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Layout from "./components/Layout/Layout";
import Cart from "./pages/Cart/Cart";
import Checkout from "./components/Checkout/Checkout";
import MyOrder from "./pages/Order/MyOrder";
import PostProduct from "./pages/PostProduct/PostProduct";
import LayoutAdmin from "./components/LayoutAdmin/LayoutAdmin";
import LayoutSeller from "./components/LayoutSeller/LayoutSeller";
import DashBoard from "./pages/Admin/DashBoard/DashBoard";
import CategoryManagement from "./pages/Admin/CategoryManagement/CategoryManagement";
import ProductManagement from "./pages/Admin/ProductManagement/ProductManagement";
import UserProfile from "./pages/UserProfile/UserProfile";
import UserManagement from "./pages/Admin/ManageUser/ManageUser";
import OrderManage from "./pages/Admin/OrderManage/OrderManage";

import SellerDashboard from "./pages/Seller/SellerDashboard";
import SellerProducts from "./pages/Seller/SellerProducts";
import SellerOrders from "./pages/Seller/SellerOrders";
import SellerVouchers from "./pages/Seller/SellerVouchers";
import SellerAnalytics from "./pages/Seller/SellerAnalytics";

import { AuthProvider } from "./contexts/AuthContext";
import { CoinProvider } from "./contexts/CoinProvider";
import { CartProvider } from "./contexts/CartContext";
import { CategoryProvider } from "./contexts/CategoryContext";
import { ProductProvider } from "./contexts/ProductContext";
import { OrderProvider } from "./contexts/OrderContext";
import { ChatProvider } from "./contexts/ChatContext";
import { VoucherProvider } from "./contexts/VoucherContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { PersonalDiscountProvider } from "./contexts/PersonalDiscountContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Verification from "./pages/Verification/Verification";

// Thiết lập axios interceptor khi ứng dụng khởi động
import ApiService from "./services/ApiService";
import authService from "./services/authService";
import OrderDetails from "./pages/OrderDetails/OrderDetails";

import BlogList from "./pages/Blog/BlogList";
import BlogDetail from "./pages/Blog/BlogDetail";

import AdminBlogList from "./pages/Admin/BlogManagement/AdminBlogList";
import BlogForm from "./pages/Admin/BlogManagement/BlogForm";

// import VoucherList from "./pages/Voucher/VoucherList";
import VoucherManagement from "./pages/Admin/VoucherManagement/VoucherManagement";
// import RegisterSeller from "./pages/RegisterSeller/RegisterSeller";
import SellerManagement from "./pages/Admin/SellerManagement/SellerManagement";

// import QRPaymentPage from "./pages/PaymentResult/QRPaymentPage";
import PaymentCancelPage from "./pages/PaymentResult/PaymentCancelPage";
import PaymentSuccessPage from "./pages/PaymentResult/PaymentSuccessPage";
import ReturnedOrders from "./pages/Admin/ReturnedOrders/ReturnedOrders";
import ReportManagement from "./pages/Admin/ReportManagement/ReportManagement";
import OrderDetailsSeller from "./pages/Seller/OrderDetailsSeller";
import FeedBackSeller from "./pages/FeedBackSeller/FeedBackSeller";
import ManageDiscount from "./pages/Seller/ManageDiscount";

// Khởi tạo token từ localStorage nếu đã đăng nhập
const token = authService.getToken();
if (token) {
  ApiService.setupInterceptors(token);
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <AuthProvider>
          <PersonalDiscountProvider>
            <CoinProvider>
              <CartProvider>
                <ProductProvider>
                  <CategoryProvider>
                    <OrderProvider>
                      <VoucherProvider>
                        <ChatProvider>
                          <BrowserRouter>
                            <Routes>
                              {/* Admin routes */}
                              <Route
                                path="/eco-market/admin"
                                element={
                                  <ProtectedRoute roles={["admin"]}>
                                    <LayoutAdmin>
                                      <DashBoard />
                                    </LayoutAdmin>
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/eco-market/admin/products"
                                element={
                                  <ProtectedRoute roles={["admin"]}>
                                    <LayoutAdmin>
                                      <ProductManagement />
                                    </LayoutAdmin>
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/eco-market/no-access"
                                element={<NoAccess />}
                              />
                              ;
                              <Route
                                path="/eco-market/admin/categories"
                                element={
                                  <ProtectedRoute roles={["admin"]}>
                                    <LayoutAdmin>
                                      <CategoryManagement />
                                    </LayoutAdmin>
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/eco-market/admin/blogs"
                                element={
                                  <ProtectedRoute roles={["admin"]}>
                                    <LayoutAdmin>
                                      <AdminBlogList />
                                    </LayoutAdmin>
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/eco-market/admin/blogs/new"
                                element={
                                  <ProtectedRoute roles={["admin"]}>
                                    <LayoutAdmin>
                                      <BlogForm />
                                    </LayoutAdmin>
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/eco-market/admin/blogs/edit/:id"
                                element={
                                  <ProtectedRoute roles={["admin"]}>
                                    <LayoutAdmin>
                                      <BlogForm />
                                    </LayoutAdmin>
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/eco-market/admin/vouchers"
                                element={
                                  <ProtectedRoute roles={["admin"]}>
                                    <LayoutAdmin>
                                      <VoucherManagement />
                                    </LayoutAdmin>
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/eco-market/admin/sellers"
                                element={
                                  <ProtectedRoute roles={["admin"]}>
                                    <LayoutAdmin>
                                      <SellerManagement />
                                    </LayoutAdmin>
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/eco-market/admin/orders/refund"
                                element={
                                  <ProtectedRoute roles={["admin"]}>
                                    <LayoutAdmin>
                                      <ReturnedOrders />
                                    </LayoutAdmin>
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/eco-market/admin/reports"
                                element={
                                  <ProtectedRoute roles={["admin"]}>
                                    <LayoutAdmin>
                                      <ReportManagement />
                                    </LayoutAdmin>
                                  </ProtectedRoute>
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
                                  <ProtectedRoute roles={["admin"]}>
                                    <LayoutAdmin>
                                      <UserManagement />
                                    </LayoutAdmin>
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/eco-market/admin/orders"
                                element={
                                  <ProtectedRoute roles={["admin"]}>
                                    <LayoutAdmin>
                                      <OrderManage />
                                    </LayoutAdmin>
                                  </ProtectedRoute>
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
                                path="/eco-market/order-details/:orderId"
                                element={
                                  <Layout>
                                    <OrderDetails />
                                  </Layout>
                                }
                              />
                              <Route
                                path="/eco-market/feedback-seller/:orderId"
                                element={
                                  <Layout>
                                    <FeedBackSeller />
                                  </Layout>
                                }
                              />
                              <Route
                                path="/eco-market/seller/order-details/:orderId"
                                element={
                                  <ProtectedRoute roles={["seller"]}>
                                    <Layout>
                                      <OrderDetailsSeller />
                                    </Layout>
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/eco-market/order-details"
                                element={
                                  <Navigate to="/eco-market/customer/orders" />
                                }
                              />
                              <Route
                                path="/eco-market/blogs"
                                element={
                                  <Layout>
                                    <BlogList />
                                  </Layout>
                                }
                              />
                              <Route
                                path="/eco-market/blogs/:id"
                                element={
                                  <Layout>
                                    <BlogDetail />
                                  </Layout>
                                }
                              />
                              {/* Seller Routes */}
                              <Route
                                path="/eco-market/seller"
                                element={
                                  <ProtectedRoute roles={["seller"]}>
                                    <LayoutSeller>
                                      <SellerDashboard />
                                    </LayoutSeller>
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/eco-market/seller/register"
                                element={
                                  <ProtectedRoute roles={["buyer"]}>
                                    <Layout>
                                      <PostProduct />
                                    </Layout>
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/eco-market/seller/products/create"
                                element={
                                  <ProtectedRoute roles={["seller"]}>
                                    <Layout>
                                      <PostProduct />
                                    </Layout>
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/eco-market/seller/products"
                                element={
                                  <ProtectedRoute roles={["seller"]}>
                                    <LayoutSeller>
                                      <SellerProducts />
                                    </LayoutSeller>
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/eco-market/seller/orders"
                                element={
                                  <ProtectedRoute roles={["seller"]}>
                                    <LayoutSeller>
                                      <SellerOrders />
                                    </LayoutSeller>
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/eco-market/seller/vouchers"
                                element={
                                  <ProtectedRoute roles={["seller"]}>
                                    <LayoutSeller>
                                      <SellerVouchers />
                                    </LayoutSeller>
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/eco-market/seller/manage-discount"
                                element={
                                  <ProtectedRoute roles={["seller"]}>
                                    <LayoutSeller>
                                      <ManageDiscount />
                                    </LayoutSeller>
                                  </ProtectedRoute>
                                }
                              />
                              {/* <Route
                      path="/eco-market/seller/analytics"
                      element={
                        <LayoutSeller>
                          <SellerAnalytics />
                        </LayoutSeller>
                      }
                    /> */}
                              <Route
                                path="/eco-market/payment-cancel"
                                element={
                                  <Layout>
                                    <PaymentCancelPage />
                                  </Layout>
                                }
                              />
                              <Route
                                path="/eco-market/payment-success"
                                element={
                                  <Layout>
                                    <PaymentSuccessPage />
                                  </Layout>
                                }
                              />
                            </Routes>
                          </BrowserRouter>
                        </ChatProvider>
                      </VoucherProvider>
                    </OrderProvider>
                  </CategoryProvider>
                </ProductProvider>
              </CartProvider>
            </CoinProvider>
          </PersonalDiscountProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
