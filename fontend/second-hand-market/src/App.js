import * as React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Home } from "./components/Home";
import ProductList from "./components/ProductList";
import { Product } from "./components/Product";
import Login from "./components/Login";
import Register from "./components/Register";
import Layout from "./components/Layout";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
