import { useState, useEffect, useMemo } from 'react';

export const useCartSelection = (products) => {
  const [checkedItems, setCheckedItems] = useState({});

  // Calculate derived state
  const selectedCount = useMemo(() => {
    return Object.values(checkedItems).filter(Boolean).length;
  }, [checkedItems]);

  const isAllSelected = useMemo(() => {
    return products.length > 0 && selectedCount === products.length;
  }, [products.length, selectedCount]);

  const selectedItems = useMemo(() => {
    return products.filter(product => checkedItems[product._id]);
  }, [products, checkedItems]);

  const selectedProductIds = useMemo(() => {
    return selectedItems.map(item => item._id);
  }, [selectedItems]);

  const totalAmount = useMemo(() => {
    return selectedItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }, [selectedItems]);

  const hasSelectedItems = useMemo(() => {
    return selectedCount > 0;
  }, [selectedCount]);

  // Reset selection when products length changes (items added/removed)
  useEffect(() => {
    setCheckedItems({});
  }, [products.length]);

  const handleItemSelect = (productId, isChecked) => {
    setCheckedItems(prev => ({
      ...prev,
      [productId]: isChecked
    }));
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      // Deselect all
      setCheckedItems({});
    } else {
      // Select all
      const allSelected = {};
      products.forEach(product => {
        allSelected[product._id] = true;
      });
      setCheckedItems(allSelected);
    }
  };

  const clearSelections = () => {
    setCheckedItems({});
  };

  return {
    checkedItems,
    isAllSelected,
    selectedCount,
    totalAmount,
    selectedItems,
    selectedProductIds,
    hasSelectedItems,
    handleItemSelect,
    handleSelectAll,
    clearSelections
  };
}; 