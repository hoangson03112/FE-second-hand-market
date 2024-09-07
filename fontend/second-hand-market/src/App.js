import * as React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Home } from "./components/Home";
import ProductList from "./components/ProductList";
import { Product } from "./components/Product";
import Login from "./components/Login";
import Register from "./components/Register";
import Verification from "./components/Verification";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/ecomarket/home" />} />
        <Route path="/ecomarket/home" element={<Home />}></Route>
        <Route path="/ecomarket" element={<ProductList />}></Route>
        <Route path="/ecomarket/product" element={<Product />}></Route>
        <Route path="/ecomarket/login" element={<Login />}></Route>
        <Route path="/ecomarket/register" element={<Register />}></Route>
        <Route path="/ecomarket/verifi" element={<Verification />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
