import * as React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Home } from "./components/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/ecomarket/home" />} />
        <Route path="/ecomarket/home" element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
