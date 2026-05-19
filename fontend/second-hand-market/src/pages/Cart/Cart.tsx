import React from "react";
import { Table } from "react-bootstrap";

// Components
import CartItem from "./components/CartItem";
import Breadcrumb from "./components/Breadcrumb";
import CartHeader from "./components/CartHeader";
import CartSummary from "./components/CartSummary";
import EmptyCart from "./components/EmptyCart";
import { CartSkeleton } from "./components/SkeletonLoader";
import NotificationSnackbar from "../../components/common/NotificationSnackbar";

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
  const { products, sellers, loading, error } = useCartData();

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
    isItemUpdating,
    notification,
    setNotification,
  } = useCartActions(clearSelections);

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
      <div className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <Breadcrumb />
          <div className="mx-3">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" role="alert">
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
      <div className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <Breadcrumb />
          <div className="mx-3">
            <CartSkeleton itemCount={3} />
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
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
    <div className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <Breadcrumb />

        {/* Notification Snackbar */}
        <NotificationSnackbar
          open={notification.open}
          message={notification.message}
          severity={notification.severity}
          onClose={() => setNotification({ ...notification, open: false })}
        />

        <div className="mx-3">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 relative inline-block after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-16 after:h-1 after:bg-gradient-to-r after:from-orange-500 after:to-pink-500 after:rounded-full">
            Giỏ hàng của bạn
          </h2>

          {/* Cart Items Table */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
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
                isItemUpdating={isItemUpdating}
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
