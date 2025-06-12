import { useState, useEffect, useMemo, useCallback } from 'react';

export const useCartSelection = (products) => {
  const [checkedItems, setCheckedItems] = useState({});

  // Initialize checked items when products change
  useEffect(() => {
    if (products.length > 0) {
      const initialCheckedItems = {};
      products.forEach(product => {
        if (!(product._id in checkedItems)) {
          initialCheckedItems[product._id] = false;
        }
      });
      
      if (Object.keys(initialCheckedItems).length > 0) {
        setCheckedItems(prev => ({ ...prev, ...initialCheckedItems }));
      }
    }
  }, [products]); // Remove checkedItems from dependencies to prevent infinite loop

  // Calculate if all items are selected
  const isAllSelected = useMemo(() => {
    const checkedValues = Object.values(checkedItems);
    return checkedValues.length > 0 && checkedValues.every(Boolean);
  }, [checkedItems]);

  // Calculate selected count
  const selectedCount = useMemo(() => {
    return Object.values(checkedItems).filter(Boolean).length;
  }, [checkedItems]);

  // Calculate total amount for selected items
  const totalAmount = useMemo(() => {
    return products.reduce((sum, product) => {
      if (checkedItems[product._id]) {
        return sum + (product.price * product.quantity);
      }
      return sum;
    }, 0);
  }, [products, checkedItems]);

  // Get selected items
  const selectedItems = useMemo(() => {
    return products.filter(product => checkedItems[product._id]);
  }, [products, checkedItems]);

  // Get selected product IDs
  const selectedProductIds = useMemo(() => {
    return Object.entries(checkedItems)
      .filter(([, isChecked]) => isChecked)
      .map(([productId]) => productId);
  }, [checkedItems]);

  // Handle individual item selection
  const handleItemSelect = useCallback((productId, isChecked) => {
    setCheckedItems(prev => ({ 
      ...prev, 
      [productId]: isChecked 
    }));
  }, []);

  // Handle select all toggle
  const handleSelectAll = useCallback(() => {
    const newCheckedState = !isAllSelected;
    const newCheckedItems = {};
    
    products.forEach(product => {
      newCheckedItems[product._id] = newCheckedState;
    });
    
    setCheckedItems(newCheckedItems);
  }, [isAllSelected, products]);

  // Clear all selections
  const clearSelections = useCallback(() => {
    setCheckedItems({});
  }, []);

  // Check if any items are selected
  const hasSelectedItems = useMemo(() => {
    return selectedCount > 0;
  }, [selectedCount]);

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