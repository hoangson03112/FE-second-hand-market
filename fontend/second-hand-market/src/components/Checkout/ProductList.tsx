import React from "react";
import ShopSection from "./ShopSection";
import { ProductListProps } from "./types/PaymentSummary.types";

const ProductList: React.FC<ProductListProps> = ({
  products,
  sellers,
  deliveryAddress,
  onShippingMethodChange,
  selectedShippingMethods,
  shippingData,
  shippingLoading,
}) => {

  // Group products by seller
  const productsBySeller = sellers.reduce((acc: any, seller: any) => {
    const sellerProducts = products.filter(
      (product: any) => product.seller._id === seller._id
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
        ({ seller, products: sellerProducts }: any) => (
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
