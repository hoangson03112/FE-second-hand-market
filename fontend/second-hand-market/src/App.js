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
import { ChatBox } from "./components/ChatBox/ChatBox";
import OrderSuccess from "./pages/Order/OrderSuccess";
import MyOrder from "./pages/Order/MyOrder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/ecomarket/home" />} />
        <Route
          path="/ecomarket/home"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/ecomarket"
          element={
            <Layout>
              <ProductList />
            </Layout>
          }
        />
        <Route
          path="/ecomarket/product"
          element={
            <Layout>
              <Product />
            </Layout>
          }
        />
        <Route
          path="/ecomarket/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        ></Route>
        <Route
          path="/ecomarket/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        ></Route>
        <Route
          path="/ecomarket/my-cart"
          element={
            <Layout>
              <Cart />
            </Layout>
          }
        ></Route>
        <Route
          path="/ecomarket/checkout"
          element={
            <Layout>
              <Checkout />
            </Layout>
          }
        ></Route>
        <Route
          path="/ecomarket/order-success"
          element={
            <Layout>
              <OrderSuccess />
            </Layout>
          }
        ></Route>
        <Route
          path="/ecomarket/my-order"
          element={
            <Layout>
              <MyOrder />
            </Layout>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
