import React from "react";
import { Table } from "react-bootstrap";
import "./Cart.css";

// Components
import CartItem from "./components/CartItem";
import Breadcrumb from "./components/Breadcrumb";
import CartHeader from "./components/CartHeader";
import CartSummary from "./components/CartSummary";
import LoadingSpinner from "./components/LoadingSpinner";
import EmptyCart from "./components/EmptyCart";

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
  const { cart, products, sellers, loading, error, updateCart } = useCartData();

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
      <div className="container vh-100">
        <Breadcrumb />
        <div className="mx-3">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="container vh-100">
        <Breadcrumb />
        <div className="mx-3">
          <LoadingSpinner message="Đang tải giỏ hàng..." />
        </div>
      </div>
    );
  }

  // Empty cart state
  if (products.length === 0) {
    return (
      <div className="container vh-100">
        <Breadcrumb />
        <div className="mx-3">
          <EmptyCart onContinueShopping={handleContinueShopping} />
        </div>
      </div>
    );
  }

  // Main cart view
  return (
    <div className="container vh-100">
      <Breadcrumb />

      <div className="mx-3">
        {/* Cart Items Table */}
        <div className="card p-3 shadow" style={{ transform: "none" }}>
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
  );
};

export default Cart;
