import React from "react";
import ShopSection from "./ShopSection";

const ProductList = ({
  products,
  sellers,
  deliveryAddress,
  onShippingMethodChange,
  selectedShippingMethods,
  shippingData,
  shippingLoading,
}) => {
  // Group products by seller
  const productsBySeller = sellers.reduce((acc, seller) => {
    const sellerProducts = products.filter(
      (product) => product.seller._id === seller._id
    );

    if (sellerProducts.length > 0) {
      acc[seller._id] = {
        seller: seller,
        products: sellerProducts,
      };
    }

    return acc;
  }, {});

  return (
    <div className="products-by-shop">
      {Object.values(productsBySeller).map(
        ({ seller, products: sellerProducts }) => (
          <ShopSection
            key={seller._id}
            seller={seller}
            products={sellerProducts}
            deliveryAddress={deliveryAddress}
            onShippingMethodChange={onShippingMethodChange}
            selectedShippingMethods={selectedShippingMethods}
            shippingData={shippingData[seller._id]}
            shippingLoading={shippingLoading}
          />
        )
      )}
    </div>
  );
};

export default ProductList;
