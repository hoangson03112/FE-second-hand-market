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
import LayoutSeller from "./components/LayoutSeller/LayoutSeller";
import DashBoard from "./pages/DashBoard/DashBoard";
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

import Verification from "./pages/Verification/Verification";

// Thiết lập axios interceptor khi ứng dụng khởi động
import ApiService from "./services/ApiService";
import authService from "./services/authService";
import OrderDetails from "./pages/OrderDetails/OrderDetails";

import BlogList from './pages/Blog/BlogList';
import BlogDetail from './pages/Blog/BlogDetail';

import AdminBlogList from './pages/Admin/BlogManagement/AdminBlogList';
import BlogForm from './pages/Admin/BlogManagement/BlogForm';


import VoucherList from "./pages/Voucher/VoucherList";
import VoucherManagement from "./pages/Admin/VoucherManagement/VoucherManagement";
import RegisterSeller from "./pages/RegisterSeller/RegisterSeller";
import SellerManagement from "./pages/Admin/SellerManagement/SellerManagement";


// Khởi tạo token từ localStorage nếu đã đăng nhập
const token = authService.getToken();
if (token) {
  ApiService.setupInterceptors(token);
}

function App() {
  return (
    <AuthProvider>
        <CoinProvider>
      <CartProvider>
        <ProductProvider>
          <CategoryProvider>
            <OrderProvider>
              <VoucherProvider>
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
                        path="/eco-market/admin/blogs"
                        element={
                          <LayoutAdmin>
                            <AdminBlogList />
                          </LayoutAdmin>
                        }
                      />

                      <Route
                        path="/eco-market/admin/blogs/new"
                        element={
                          <LayoutAdmin>
                            <BlogForm />
                          </LayoutAdmin>
                        }
                      />

                      <Route
                        path="/eco-market/admin/blogs/edit/:id"
                        element={
                          <LayoutAdmin>
                            <BlogForm />
                          </LayoutAdmin>
                        }
                      />

                      <Route
                        path="/eco-market/admin/vouchers"
                        element={
                          <LayoutAdmin>
                            <VoucherManagement />
                          </LayoutAdmin>
                        }
                      />

                      <Route
                        path="/eco-market/admin/sellers"
                        element={
                          <LayoutAdmin>
                            <SellerManagement />
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
                        path="/eco-market/order-details/:orderId"
                        element={
                          <Layout>
                            <OrderDetails />
                          </Layout>
                        }
                      />
                      <Route
                        path="/eco-market/order-details"
                        element={<Navigate to="/eco-market/customer/orders" />}
                      />

                      {/* Blog Routes - Public */}
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
                        <LayoutSeller>
                          <SellerDashboard />
                        </LayoutSeller>
                      }
                    />
                      <Route
                        path="/eco-market/seller/register"
                        element={
                          <Layout>
                            <PostProduct />
                          </Layout>
                        }
                      />
                      <Route
                        path="/eco-market/seller/products/create"
                        element={
                          <Layout>
                            <PostProduct />
                          </Layout>
                        }
                      />

          
                    <Route
                      path="/eco-market/seller/products"
                      element={
                        <LayoutSeller>
                          <SellerProducts />
                        </LayoutSeller>
                      }
                    />
                    <Route
                      path="/eco-market/seller/orders"
                      element={
                        <LayoutSeller>
                          <SellerOrders />
                        </LayoutSeller>
                      }
                    />
                    <Route
                      path="/eco-market/seller/vouchers"
                      element={
                        <LayoutSeller>
                          <SellerVouchers />
                        </LayoutSeller>
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

                    </Routes>
                  </BrowserRouter>
                </ChatProvider>
              </VoucherProvider>
            </OrderProvider>
          </CategoryProvider>
        </ProductProvider>
      </CartProvider>
      </CoinProvider>
    </AuthProvider>
  );
}

export default App;
