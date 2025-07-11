import React from "react";
import { Table } from "react-bootstrap";
import "./Cart.css";
import "../../styles/performance.css";

// Components
import CartItem from "./components/CartItem";
import Breadcrumb from "./components/Breadcrumb.js";
import CartHeader from "./components/CartHeader.js";
import CartSummary from "./components/CartSummary.js";
import LoadingSpinner from "./components/LoadingSpinner.js";
import EmptyCart from "./components/EmptyCart.js";
import { CartSkeleton } from "./components/SkeletonLoader.js";

// Custom Hooks
import { useCartData } from "./hooks/useCartData";
import { useCartSelection } from "./hooks/useCartSelection";
import { useCartActions } from "./hooks/useCartActions";

/**
 * Cart Component - Displays shopping cart with items, selection, and checkout functionality
 * Optimized for performance with custom hooks and memoized calculations
 */
const Cart = () => {
  // Data management
  const { products, sellers, loading, error, updateCart } = useCartData();

  // Selection state management
  const {
    checkedItems,
    isAllSelected,
    selectedCount,
    totalAmount,
    selectedItems,
    selectedProductIds,
    hasSelectedItems,
    handleItemSelect,
    handleSelectAll,
    clearSelections,
  } = useCartSelection(products);

  // Cart actions
  const {
    handleDeleteItems,
    handleUpdateQuantity,
    handleCheckout,
    handleContinueShopping,
  } = useCartActions(updateCart, clearSelections);

  // Event handlers
  const handleDeleteSelected = () => {
    if (selectedProductIds.length > 0) {
      handleDeleteItems(selectedProductIds);
    }
  };

  const handleCheckoutClick = () => {
    handleCheckout(selectedItems);
  };

  const handleDeleteSingleItem = (productId) => {
    handleDeleteItems([productId]);
  };

  // Error state
  if (error) {
    return (
      <div className="cart-page">
        <div className="container">
          <Breadcrumb />
          <div className="mx-3">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <Breadcrumb />
          <div className="mx-3">
            <CartSkeleton itemCount={3} />
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (products.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <Breadcrumb />
          <div className="mx-3">
            <EmptyCart onContinueShopping={handleContinueShopping} />
          </div>
        </div>
      </div>
    );
  }

  // Main cart view
  return (
    <div className="cart-page">
      <div className="container">
        <Breadcrumb />

        <div className="mx-3">
          <h2 className="cart-title">Giỏ hàng của bạn</h2>

          {/* Cart Items Table */}
          <div className="cart-items-wrapper">
            <Table borderless className="table-hover">
              <CartHeader
                isAllSelected={isAllSelected}
                onSelectAll={handleSelectAll}
              />
              <CartItem
                sellers={sellers}
                products={products}
                handleUpdateQuantity={handleUpdateQuantity}
                checkedItems={checkedItems}
                onCheckboxChange={handleItemSelect}
                onDeleteItem={handleDeleteSingleItem}
              />
            </Table>
          </div>

          {/* Cart Summary */}
          <CartSummary
            hasSelectedItems={hasSelectedItems}
            selectedCount={selectedCount}
            totalAmount={totalAmount}
            onDeleteSelected={handleDeleteSelected}
            onCheckout={handleCheckoutClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
